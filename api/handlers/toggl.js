const TogglClient = require('toggl-api');
const {
    TOGGL
} = require('../config/credentials')

const toggl = module.exports = (() => {

    const fetchProjectData = async (params) => {
        const togglClient = new TogglClient({ apiToken: TOGGL.API_KEY })
        return new Promise((resolve, reject) => {
            togglClient.getProjectData(params.projectId, (err, projectData) => {
                if (projectData) {
                    resolve(projectData)
                }
                reject(err)
            })
        })
    }

    const fetchProjectTimeEntries = (params) => {
        const togglClient = new TogglClient({ apiToken: TOGGL.API_KEY })
        return new Promise((resolve, reject) => {
            togglClient.getTimeEntries( async (err, timeEntries) => {
                let projectTimeEntries = []
                if (timeEntries) {
                    await timeEntries.map(t => {
                        if (t.pid == params.projectId) {
                            projectTimeEntries.push(t)
                        }
                    })
                    resolve(projectTimeEntries)
                }
                reject(err)
            })
        })
    }

    const fetchTimeEntries = (params) => {
        const togglClient = new TogglClient({ apiToken: TOGGL.API_KEY })
        return new Promise((resolve, reject) => {
            togglClient.getTimeEntries((err, timeEntries) => {
                if (err) {
                    reject(err)
                }
                resolve(timeEntries)
            })
        })
    }

    const fetchWorkspacesProject = (params) => {
        const togglClient = new TogglClient({ apiToken: TOGGL.API_KEY })
        return new Promise((resolve, reject) => {
            togglClient.getWorkspaceProjects(params.wId, (err, projects) => {
                if (err) {
                    reject(err)
                }
                resolve(projects)
            })
        })
    }

    const fetchWorkspacesData = (params) => {
        const togglClient = new TogglClient({ apiToken: TOGGL.API_KEY })
        return new Promise((resolve, reject) => {
            togglClient.getWorkspaceData(params.wId, (err, workspaces) => {
                if (err) {
                    reject(err)
                }
                resolve(workspaces)
            })
        })
    }

    const fetchWorkspaceTimeEntries = (params) => {
        const togglClient = new TogglClient({ apiToken: TOGGL.API_KEY })
        const opts = {
            user_agent: '',
            workspace_id: params.wId,
            project_ids: params.pId,
            since: params.since,
            until: params.until
        }
        return new Promise( (resolve, reject) => {
            togglClient.detailedReport(opts, (err, report) => {
                if (err) {
                    reject(err)
                }
                resolve(report.data)
            })
        })
    }

    return {
        fetchProjectData,
        fetchProjectTimeEntries,
        fetchTimeEntries,
        fetchWorkspacesData,
        fetchWorkspacesProject,
        fetchWorkspaceTimeEntries
    }

})();
