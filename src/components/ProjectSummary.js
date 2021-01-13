import React, { useState } from 'react'
import {
    Box,
    Button,
    CardActions,
    Grid,
    Icon,
    Typography
} from '@material-ui/core'
import { find } from 'lodash'

import ProjectEditDialog from './ProjectEditDialog'
import { CURRENCIES } from '../constants'

const ProjectSummary = (props) => {

    const { project } = props
    const { projectId } = props
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const handleEditOpen = () => {
        setOpenEditDialog(true)
    }
    const handleEditClose = (value) => {
        setOpenEditDialog(false)
    }

    const selectCurrencySymbol = (c, currency) => {
        return find(CURRENCIES, c => {
            return c.name == project.client.currency
        })['symbol']
    }

    return (
        <Box
            p={3}
            borderRadius='borderRadius'
            bgcolor='primary.light_blue'
            fontWeight='fontWeightBold'
        >
            <Grid container justify='center' spacing={2}>
                <Grid item xs={12} sm={10}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={2}>
                                    <Icon className='fas fa-address-card' color='primary'/>
                                </Grid>
                                <Grid xs={10} align='left'>
                                    {`Client - ${project.client.name}`}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={2}>
                                    <Icon className='fas fa-wallet' color='primary'/>
                                </Grid>
                                <Grid xs={10} align='left'>
                                    {`Expected budget - ${selectCurrencySymbol(project.client.currency)}${project.expected_budget}`}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={2}>
                                    <Icon className='fas fa-money-bill-wave-alt' color='primary'/>
                                </Grid>
                                <Grid xs={10} align='left'>
                                    {`Total paid - $${project.totalPaid}`}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={2}
                    align='left'
                >
                    <Box>
                        <Button onClick={handleEditOpen} color='primary' bgcolor='primary'>
                            {'Edit'.toUpperCase()}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <ProjectEditDialog
                project={project}
                open={openEditDialog}
                onClose={handleEditClose}
            />
        </Box>
    )
}

export default ProjectSummary
