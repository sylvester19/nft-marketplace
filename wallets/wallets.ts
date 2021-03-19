import { AbstractConnector } from '@web3-react/abstract-connector';
import Metamask from 'components/assets/wallets/metamask';
import WalletConnect from 'components/assets/wallets/walletconnect';
import React from 'react';
import { injected, walletConnect } from './connectors';


export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  icon: React.FC<{ className: string }> | null
  description: string
  mobile: boolean
  desktop: boolean
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    icon: null,
    description: 'Injected web3 provider.',
    mobile: false,
    desktop: false,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    icon: Metamask,
    description: 'Easy-to-use browser extension.',
    mobile: false,
    desktop: true,
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    name: 'WalletConnect',
    icon: WalletConnect,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    mobile: true,
    desktop: true,
  },
};