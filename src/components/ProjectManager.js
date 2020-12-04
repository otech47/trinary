import React from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { gql, useQuery } from '@apollo/client';

import { GET_ACTIVE_PROJECTS_COUNT } from '../operations/queries/ProjectQueries'

const GET_PROJECT = gql`
    query Project($id: Int!){
        getProjectById(id: $id){
            id,
            name,
            client{
                id,
                name
            }
        }
    }
`

const ProjectManager = ({
    history
}) => {
    const { data, loading, error } = useQuery(GET_PROJECT, {
        variables: {
            id: 1
        }
    })

    if (loading) return 'Loading...'
    if (error) return error

    return (
        <Box
            mb={3}
            mx={1}
            className='ProjectManager'
        >
            
        </Box>

    )
}

export default ProjectManager
