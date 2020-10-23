const { fetchUserData } = require('../handlers/github')
const db = require('../models')

const authentication = module.exports = (() => {

    const getContributor = async ({ githubAccessToken }) => {
        const githubContributor = await fetchUserData({ auth_key: githubAccessToken })
        const contributor = await db.models.Contributor.findOne({
            where: {
                github_handle: githubContributor.id
            }
        })
        return {
            contributor,
            githubContributor
        }
    }

    //TODO: This has to chenge a little when we implement the Rates table
    const createContributor = async ({ name, id, githubUrl }) => {
        await db.models.Contributor.create({
            name,
            github_id: id,
            github_handle: githubUrl,
            weekly_rate: null,
            hourly_rate: null,
            monthly_rate: null
        })
    }

    return {
        createContributor,
        getContributor
    }

})()
