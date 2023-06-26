const { UserInputError } = require('apollo-server')
const moment = require('moment')
const { fn, col, Op } = require('sequelize')
const bitcoinConversion = require('bitcoin-conversion')

const { validateDatesFormat } = require('../helpers/inputValidation')
const apiModules = require('../../modules')
const { DEFAULT_STRIPE_CURRENCY, STRIPE_SUPPORTED_CURRENCIES } = require('../../config/constants')
const lnd = require('../../handlers/lnd')
const btcPayServer = require('../../handlers/btcPayServer')

module.exports = {

    Payment: {
        allocations: (payment, args, { models }) => {
            return models.Allocation.findAll({
                where: {
                    payment_id: payment.id
                }
            })
        },
        client: (payment, args, { models }) => {
            return models.Client.findByPk(payment.client_id)
        },
        totalAllocated: async (payment, args, { models }) => {
            const allocations = await models.Allocation.findAll({
                attributes: [
                    'amount',
                    [fn('sum', col('amount')), 'total_amount'],
                ],
                where: {
                    payment_id: payment.id
                },
                raw: true
            })
            return allocations[0].total_amount
        },
        isBitcoinInvoiceExpired: async (payment) => {
            if (payment.external_uuid && payment.external_uuid_type === 'bitcoin') {
                return apiModules.paymentManagement.checkIfBitcoinInvoiceHasExpired(payment.external_uuid)
            }
        },
        bitcoinCheckoutUrl: async (payment) => {
            if (payment.external_uuid && payment.external_uuid_type === 'bitcoin') {
                return apiModules.paymentManagement.getBitcoinCheckoutUrl(payment.external_uuid)
            }
        },
        contributor: (payment, args, { models }) => {
            return models.Contributor.findOne({
                where: {
                    id: payment.contributor_id
                }
            })
        }
    },
    Query: {
        getPaymentById: (root, { id }, { models }) => {
            return models.Payment.findByPk(id)
        },
        getPayments: (root, args, { models }) => {
            return models.Payment.findAll()
        },
        getClientPaymentsByClientId: (root, { clientId }, { models }) => {
            return models.Payment.findAll({ where: { client_id: clientId } })
        },
        importInvoicelyCsvToStripe: async (root, args, { models }) => {
            return apiModules.dataSyncs.importInvoicelyCsvToStripe()
        },
    },
    Mutation: {
        createPayment: async (root, { createFields }, { models }) => {
            validateDatesFormat({
                date_incurred: createFields['date_incurred'],
                date_paid: createFields['date_paid']
            })

            if (createFields['client_id']) {
                const client = await models.Client.findOne({
                    where: {
                        id: createFields['client_id']
                    }
                })
                // Check if the client has an associated Stripe account and if the currency is supported
                // If it does, proceed to create the invoice on Stripe
                if (client.external_uuid && STRIPE_SUPPORTED_CURRENCIES.includes(client.currency)) {
                    const stripeInvoice = await apiModules.paymentManagement.processStripeInvoiceWithPayment({
                        amount: createFields['amount'],
                        clientId: client.id,
                        currency: client.currency,
                        date_paid: createFields['date_paid']
                    })
                    createFields['external_uuid'] = stripeInvoice.id
                }
            }
            
            return models.Payment.create({
                ...createFields
            })
        },
        deletePaymentById: (root, { id }, { models }) => {
            return models.Payment.destroy({ where: { id } })
        },
        generateBitcoinInvoiceFromPayment: async (root, { paymentId }, { models }) => {
            const newInvoice = await apiModules.paymentManagement.processBitcoinInvoiceCreation(paymentId)
            await models.Payment.update(
                {
                    external_uuid: newInvoice.id,
                    external_uuid_type: `bitcoin`
                }, 
                { 
                    where: { id: paymentId } 
                }
            )
            return models.Payment.findByPk(paymentId)
        },
        syncPayments: async (root, { source }, { models }) => {
            if (source.toUpperCase() == 'INVOICELY') {
                return apiModules.dataSyncs.syncInvoicelyCSV()
            } else {
                throw new UserInputError(`There's not source that matchs the input`)
            }
        },
        updatePaymentById: async (root, { id, updateFields }, { models }) => {
            validateDatesFormat({
                date_incurred: updateFields['date_incurred'],
                date_paid: updateFields['date_paid']
            })
            const payment = await models.Payment.findByPk(id)
            const { external_uuid, external_uuid_type } = payment.dataValues 
            if (external_uuid && external_uuid_type === 'bitcoin') {
                if (await apiModules.paymentManagement.checkIfBitcoinInvoiceIsPaid(external_uuid)) {
                    throw new Error('No further changes can be made to this payment')  
                } 
            }
            await models.Payment.update({
                ...updateFields
            }, {
                where: {
                    id
                }
            })
            return models.Payment.findByPk(id)
        },
        convertUSDtoSATS: async (root, { amount }, { models }) => {
            try {
                // Convert the USD amount to SATS
                const sats = await bitcoinConversion.fiatToSatoshis(amount, 'USD')
                
                return sats
        
            } catch (error) {
                throw new Error('Failed to convert USD to SATS: ', error);
            }
        },
        sendPayment: async (root, { contributors }, { models }) => {
            const results = []
            const onChainAddresses = []

            const contributorIds = contributors.map(c => c.id)
            const amounts = contributors.map(c => c.amount)

            const reflect = promise => promise.then(
                value => ({ status: 'fulfilled', value }),
                error => ({ status: 'rejected', reason: error })
            )
            
            const wallets = await models.Wallet.findAll({
                where: {
                    contributor_id: contributorIds
                }
            })

            const invoices = await Promise.all(wallets.map(async (wallet, i) => {
                if (wallet.dataValues.invoice_macaroon) {
                    const invoice = await lnd.addInvoice(wallet.dataValues.lnd_host, wallet.dataValues.lnd_port, wallet.dataValues.invoice_macaroon, amounts[i])
                    return { contributorId: wallet.dataValues.contributor_id, payment_request: invoice.payment_request }
                } else {
                    onChainAddresses.push({
                        contributorId: wallet.dataValues.contributor_id,
                        address: wallet.dataValues.onchain_address,
                        amount: amounts[i]
                    })
                    return null
                }
            }))

            if (invoices) {
                const lndInvoices = invoices.filter(invoice => invoice !== null)
    
                const payLndInvoices = async () => lndInvoices.map(async invoice => {
                    return reflect(btcPayServer.payLightningInvoice(invoice.payment_request))
                        .then(result => {
                            return result.status === 'fulfilled' ? { contributorId: invoice.contributorId, ...result.value } : { error: result.reason.message, status: result.status }
                        })
                })
                const lndInvocesResults = await Promise.all(await payLndInvoices())
                results.push(...lndInvocesResults)
            }

            if (onChainAddresses) {
                const payOnChain = async () => onChainAddresses.map(async receiver => {
                    return reflect(btcPayServer.createOnChainTransaction(receiver.address, String(receiver.amount / 100000000)))
                        .then(result => {
                            return result.status === 'fulfilled' ? { contributorId: receiver.contributorId, ...result.value } : { error: result.reason.message, status: result.status }
                        })
                })
                const onChainResults = await Promise.all(await payOnChain())
                results.push(...onChainResults)
            }

            results.map(result => {
                if (result && !result.error) {
                    models.Payment.create({
                        amount: result.paymentRequest ? result.amount / 1000 : result.amount,
                        external_uuid: result.paymentRequest ? result.paymentRequest : result.transactionHash,
                        date_incurred: moment.unix(result.createdAt ? result.createdAt : result.timestamp).utc().format('YYYY-MM-DD'),
                        external_uuid_type: 'bitcoin',
                        currency: 'SATS'
                    })
                }
            })

            return results
        }
    }

}
