const moment = require('moment')

const budgeting = module.exports = (() => {
    const db = require('../models')
    const clientManagement = require('./clientManagement')

    const createPaymentFromStripeInvoice = async ({ stripeInvoice }) => {
        const client = await clientManagement.findClientWithExternalId({
            id: stripeInvoice.customer
        })

        if (client) {
            const dateIncurredOverride = stripeInvoice.metadata?.date_incurred
                ? moment(stripeInvoice.metadata.date_incurred, 'YYYY-MM-DD')
                : moment(stripeInvoice.created, 'X')

            const datePaidOverride = stripeInvoice.metadata?.date_paid
                ? moment(stripeInvoice.metadata.date_paid, 'YYYY-MM-DD')
                : null

            return db.models.Payment.create({
                amount: stripeInvoice.total,
                date_incurred: dateIncurredOverride,
                date_paid: datePaidOverride,
                client_id: client.id,
                external_uuid: stripeInvoice.id,
                external_uuid_type: 'STRIPE'
            })
        }
    }

    const deletePaymentByStripeInvoiceId = (params) => {
        let deletedPayment
        try {
            deletedPayment = db.models.Payment.destroy({
                where: {
                    external_uuid: params.invoiceId
                }
            })
        } catch {
            throw 'Failed deleting from database'
        }
        return deletedPayment
    }

    const getPaymentWithExternalId = (params) => {
        return db.models.Payment.findOne({
            where: {
                external_uuid: params.id
            },
            raw: true,
        })
    }

    const getPaymentWithId = (params) => {
        return db.models.Payment.findByPk(params.id, {
            raw: true
        })
    }

    const processPaymentFromStripeInvoice = async ({ stripeInvoice }) => {
        const paymentToUpdate = await db.models.Payment.findOne({
            where: {
                external_uuid: stripeInvoice.id,
                external_uuid_type: 'STRIPE'
            }
        })
        if (paymentToUpdate) {
            const datePaidOverride = stripeInvoice.metadata.date_paid || null
            const dateIncurredOverride = stripeInvoice.metadata.date_incurred || null

            if (datePaidOverride || dateIncurredOverride) {
                updatePaymentFromStripeInvoice({ stripeInvoice })
            }
        } else {
            //the payment is not in the db, proceed to store it
            createPaymentFromStripeInvoice({
                stripeInvoice
            })
        }
    }

    const updatePaymentFromStripeInvoice = async ({ stripeInvoice }) => {
        const existingPayment = await getPaymentWithExternalId({ id: stripeInvoice.id })

        if (existingPayment) {
            const updatedAttributes = {}
            const datePaidOverride = stripeInvoice.metadata?.date_paid || null
            const dateIncurredOverride = stripeInvoice.metadata?.date_incurred || null

            // Updates the date paid if the override metadata is detected
            // but if not and the invoice has been paid, set date_paid to the
            // webhook delivery timestamp if and only if date_paid has not yet
            // been set
            if (datePaidOverride) {
                updatedAttributes.date_paid = datePaidOverride
            } else if (
                stripeInvoice.paid == true &&
                existingPayment.date_paid == null
            ) {
                updatedAttributes.date_paid = moment(stripeInvoice.webhooks_delivered_at, 'X').format('YYYY-MM-DD')
            }

            if (dateIncurredOverride) {
                updatedAttributes.date_incurred = dateIncurredOverride
            }

            await db.models.Payment.update({
                ...updatedAttributes
            }, {
                where: {
                    id: existingPayment.id
                }
            })
        }
    }
    
    return {
        createPaymentFromStripeInvoice,
        deletePaymentByStripeInvoiceId,
        getPaymentWithId,
        getPaymentWithExternalId,
        processPaymentFromStripeInvoice,
        updatePaymentFromStripeInvoice,
    }
})()
