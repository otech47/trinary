import React, { useState } from 'react'

import Step from './Step'

import {
    MUUN_ICON_URL,
    WALLET_OF_SATOSHI_ICON_URL,
    ZEUS_ICON_URL
} from '../constants'

const WalletSimpleSetupOnboarding = () => {

    const [onboardingScreenIndex, setOnboardingScreenIndex] = useState(0)

    const renderSecond = () => {
        const renderWallets = () => {
            const WALLETS = [
                {
                    name: 'Wallet of Satoshi',
                    walletWeb: 'https://www.walletofsatoshi.com/',
                    icon: WALLET_OF_SATOSHI_ICON_URL
                },
                {
                    name: 'Muun',
                    walletWeb: 'https://muun.com/',
                    icon: MUUN_ICON_URL
                },
                {
                    name: 'Zeus',
                    walletWeb: 'https://zeusln.app/about',
                    icon: ZEUS_ICON_URL
                },
            ]
            return WALLETS.map(wallet => {
                return (
                    <a href={wallet.walletWeb} target='_blank' rel='noreferrer'>
                        <img
                            src={wallet.icon}
                            alt={wallet.name}
                            className='h-14 mx-auto mt-8'
                        />
                    </a>
                )
            })
        }
        return (
            <div>
                <div className='w-10 h-10 rounded-full bg-setlife text-white flex items-center justify-center mx-auto'>
                    <p className='font-bold text-lg'>1</p>
                </div>
                <p className='text-2xl text-left font-bold text-center mt-4'>Download a Wallet of Preference</p>
                <div>
                    <div>
                        {renderWallets()}
                    </div>
                </div>
            </div>
        )
    }

    const renderFirst = () => {
        const SETUP_STEPS = [
            {
                text: 'Download a wallet'
            },
            {
                text: 'Create a BTC address'
            },
            {
                text: 'Complete your security backup'
            },
            {
                text: 'Receive payments'
            }
        ]
        const renderSetupSteps = () => {
            return SETUP_STEPS.map((step, idx) => {
                return (
                    <Step number={idx + 1} title={step.text}/>
                )
            })
        }
        return (
            <div>
                <p className='text-2xl text-left font-bold'>Simple Option</p>
                <div className='mt-4'>
                    <p>
                        To receive payments in Trinary you need a BTC address to link the account
                    </p>
                </div>
                {renderSetupSteps()}
            </div>
        )
    }

    const renderOnboardingScreens = () => {
        const onboardingScreenRenders = [renderFirst(), renderSecond()]
        return onboardingScreenRenders[onboardingScreenIndex]
    }

    return (
        <div>
            {renderOnboardingScreens()}
            <div className='grid absolute bottom-10 left-8 right-8'>
                <button
                    type='button'
                    className={`rounded-full py-2 w-full text-white font-bold bg-setlife`}
                    onClick={() => setOnboardingScreenIndex(onboardingScreenIndex + 1)}
                >
                    Continue
                </button>
            </div>
        </div>
    )
}

export default WalletSimpleSetupOnboarding