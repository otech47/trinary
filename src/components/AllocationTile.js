import React, { useState } from 'react'
import {
    Box,
    Card,
    Grid,
    Typography
} from '@material-ui/core'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import { overflow, textOverflow } from '@material-ui/system/display'
import accounting from 'accounting-js'
import moment from 'moment'

import AllocationOverview from './AllocationOverview'
import {
    formatAmount,
    selectCurrencyInformation
} from '../scripts/selectors'
import { grey, orange, red, setlifeBlue } from '../styles/colors.scss'

const AllocationTile = (props) => {

    const {
        allocation
    } = props

    const [openAllocationOverview, setOpenAllocationOverview] = useState(false)

    const currencyInformation = selectCurrencyInformation({
        currency: allocation.rate.currency
    })
    const paymentAmount = formatAmount({
        amount: allocation.amount / 100,
        currencyInformation: currencyInformation
    })
    const futureAllocation = moment.utc(allocation.start_date, 'x').isAfter(moment(), 'days')
    const weeksOfdDifference = moment.utc(allocation.end_date, 'x').diff(moment(), 'weeks')

    return (
        <Box
            p={2}
            boxShadow={3}
            borderRadius='borderRadius'
            className='AllocationTile'
        >
            <Grid container alignItems='center' onClick={() => setOpenAllocationOverview(true)}>
                <Grid item xs={4} md={1}>
                    <AccountBalanceWalletIcon color='primary'/>
                </Grid>
                <Grid item xs={8} md={5}>
                    <Typography variant={'h6'}>
                        {`${paymentAmount}`}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box overflow='hidden'>
                        <Typography variant='subtitle1' color='secondary'>
                            <strong>
                                {`${allocation.project.name}`}
                            </strong>
                        </Typography>
                    </Box>
                    <Typography variant='caption' color='secondary'>
                        {`${allocation.project.client.name}`}
                    </Typography>
                </Grid>
                <Box my={[2, 5]}/>
                <Grid item xs={6}>
                    <Box
                        color={
                            `${!allocation.date_paid
                                ? `${grey}`
                                : futureAllocation
                                    ? `${orange}`
                                    : `${setlifeBlue}`
                            }`
                        }
                    >
                        <Typography
                            variant='subtitle1'
                        >
                            {`Start:`}
                            <br/>
                            <strong>
                                {`${moment(allocation.start_date, 'x').format('MM/DD/YYYY')}`}
                            </strong>
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        color={
                            `${!allocation.date_paid
                                ? `${grey}`
                                : weeksOfdDifference == 2
                                    ? `${red}`
                                    : futureAllocation
                                        ? `${orange}`
                                        : `${setlifeBlue}`
                            }`
                        }
                    >
                        <Typography
                            variant='subtitle1'
                        >
                            {`End:`}
                            <br/>
                            <strong>
                                {`${moment(allocation.end_date, 'x').format('MM/DD/YYYY')}`}
                            </strong>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <AllocationOverview
                allocationInfo={allocation}
                onClose={() => setOpenAllocationOverview(false)}
                onOpen={openAllocationOverview}
            />
        </Box>

    )
}

export default AllocationTile
