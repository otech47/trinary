import { gql } from '@apollo/client';

export const GET_CLIENT_PAYMENTS = gql`
    query ClientPayments($clientId: Int!) {
        getClientPaymentsByClientId(
            clientId: $clientId
        ) {
            id
            amount
            date_incurred
            date_paid
            client {
                id
                name
                currency
            }
        }
    }
`

export const GET_PAYMENT_TOTAL_ALLOCATED = gql`
    query PaymentTotalAllocated($paymentId: Int!){
        getPaymentById(id: $paymentId){
            id
            amount
            totalAllocated
        }
    }
`

export const GET_PAYMENT_ALLOCATIONS = gql`
    query PaymentAllocations($paymentId: Int!){
        getPaymentById(id: $paymentId){
            id
            allocations {
                id
                amount
                start_date
                end_date
                payment {
                    id
                    amount
                    date_incurred
                    date_paid
                }
                contributor {
                    id
                    name
                }
                project {
                    id
                    name
                    client {
                        id
                        name
                        currency
                    }
                }
                rate {
                    id
                    hourly_rate
                    total_expected_hours
                    type
                }
            }
        }
    }
`
