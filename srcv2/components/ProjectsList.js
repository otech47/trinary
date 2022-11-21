import React from 'react'
import {
    Icon
} from '@material-ui/core'
import { useQuery } from '@apollo/client'

import ProjectTile from './ProjectTile'

import { sessionUser } from '../reactivities/variables'

import { GET_CONTRIBUTOR_PROJECTS } from '../operations/queries/ContributorQueries'

const ProjectsList = () => {

    const {
        data: dataContributorProjects,
        loading: loadingContributorProjects,
        error: errorContributorProjects
    } = useQuery(GET_CONTRIBUTOR_PROJECTS, {
        variables: {
            id: Number(sessionUser().id)
        }
    })

    const renderProjects = () => {
        return dataContributorProjects.getContributorById.projects.map(project => {
            return (
                <ProjectTile project={project}/>
            )
        })
    }

    return (
        <div className='ProjectsList'>
            <div className='grid grid-flow-row auto-rows-max'>
                <div className='gap-2 flex mb-4 mt-8'>
                    <Icon className='fas fa-tasks'/>
                    <p>
                        My projects
                    </p> 
                </div>
                {loadingContributorProjects &&
                    `Loading...`
                }
                {dataContributorProjects &&
                    <div className='projects-list bg-white p-4 rounded-lg'>
                        {renderProjects()}
                    </div>
                }
            </div>
        </div>
    )
}

export default ProjectsList