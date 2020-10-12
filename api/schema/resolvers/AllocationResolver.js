const moment = require('moment')

module.exports = {

    Allocation: {
        payment: (allocation, args, { models }) => {
            return models.Payment.findByPk(allocation.payment_id)
        },
        project: (allocation, args, { models }) => {
            return models.Project.findByPk(allocation.project_id)
        },
        contributor: (allocation, args, { models }) => {
            return models.Contributor.findByPk(allocation.contributor_id)

        }
    },
    Query: {
        getAllocationById: (root, { id }, { models }) => {
            return models.Allocation.findByPk(id)
        },
        getAllocations: (root, args, { models }) => {
            return models.Allocation.findAll()
        }
    },
    Mutation: {
        createAllocation: (root, {
            id,
            createFields,
            date_paid,
            start_date,
            end_date
        }, { models }) => {
            const datePaid = moment(date_paid, 'YYYY-MM-DD', true).utc()
            const startDate = moment(startDate, 'YYYY-MM-DD', true).utc()
            const endDate = moment(endDate, 'YYYY-MM-DD', true).utc()
            if ((!datePaid.isValid()) || (!startDate.isValid()) || (!endDate.isValid())) {
                throw new UserInputError('Date format invalid');
            }
            return models.Allocation.create({
                date_paid: datePaid,
                start_date: startDate,
                end_date: endDate,
                ...createFields
            })
        },
        deleteAllocationById: (root, { id }, { models }) => {
            return models.Allocation.destroy({ where: { id } })
        },
        updateAllocationById: (root, {
            id,
            updateFields,
            date_paid,
            start_date,
            end_date
        }, { models }) => {

            if (date_paid) date_paid = moment(date_paid, 'YYYY-MM-DD', true).utc()
            if (start_date) start_date = moment(date_paid, 'YYYY-MM-DD', true).utc()
            if (end_date) end_date = moment(end_date, 'YYYY-MM-DD', true).utc()
            if ((date_paid && !date_paid.isValid()) || (start_date && !start_date.isValid()) || (end_date && !end_date.isValid())) {
                throw new UserInputError('Date format invalid');
            }
            return models.Allocation.update({
                ...updateFields,
                date_paid,
                start_date,
                end_date
            }, {
                where: {
                    id
                }
            })
        }
    }
}
