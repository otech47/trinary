import React from 'react'

import Section from './Section'

import {
    BUDGETING_IMAGE_URL
} from '../constants'

const BudgetingOnboarding = () => {
    return (
        <div className='BudgetingOnboarding'>
            <Section backgroundColor={'bg-light'} className={'rounded-br-[70px] pb-0 px-0'}>
                <div className='header grid grid-flow-row auto-rows-max'>
                    <div className='grid grid-cols-1 gap-2'>
                        <p className='text-3xl text-center font-bold'>
                            Budgeting
                        </p>
                        <p className='text-grey text-xl text-center font-bold'>
                            Allocate funds to your team
                        </p>
                        <p className='text-grey text-xl text-center font-bold'>
                            Negotiate compensation rates
                        </p>
                    </div>
                    <div className='grid grid-cols-1'>
                        <img src={BUDGETING_IMAGE_URL} alt='budget' className=' lg:mt-8 mx-auto' />
                    </div>
                </div>
            </Section>
        </div>
    )
}

export default BudgetingOnboarding