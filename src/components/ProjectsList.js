import React from 'react'
import { gql, useQuery } from '@apollo/client';
import Grid from '@material-ui/core/Grid'
import { orderBy } from 'lodash'

import ProjectTile from './ProjectTile'

import { GET_POJECTS } from '../operations/queries/ProjectQueries'

const ProjectsList = ({
    history
}) => {

    const { loading, error, data } = useQuery(GET_POJECTS);

    if (loading) {
        return (
            <Grid item xs={12}>
                Loading...
            </Grid>
        )
    }
    if (error) return `Error! ${error.message}`;

    const projects = orderBy(data.getProjects, ['is_active'], ['desc'])

    return (

        projects.map(p => {
            return (
                <Grid item xs={12} lg={4}>
                    <ProjectTile
                        project={p}
                        history={history}
                    />
                </Grid>
            )
        })
    )
}

export default ProjectsList
