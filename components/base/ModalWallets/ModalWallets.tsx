/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from "react";

import Fortmatic from "components/assets/wallets/fortmatic";
import WalletLink from "components/assets/wallets/walletlink";
import Key from "components/assets/key";
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { isMobile } from 'react-device-detect';

import Close from "components/assets/close";
import { SUPPORTED_WALLETS, WalletInfo } from "wallets/wallets";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { injected } from "wallets/connectors";
import usePrevious from "hooks/usePrevious";
import style from "./ModalWallets.module.scss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

export interface ModalWalletsProps {
  setModalExpand: (expand: boolean) => void
}

const ModalWallets: React.FC<ModalWalletsProps> = ({ setModalExpand }) => {
  const { account, connector, activate /* , error, active */ } = useWeb3React();

  const previousAccount = usePrevious(account);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount) {
      setModalExpand(false);
      console.log('Connection complete; account number:', account);
    }
  }, [account, previousAccount]);

  const tryActivation = 
    async (connectorToActivate: AbstractConnector | undefined) => {
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connectorToActivate instanceof WalletConnectConnector &&
       connectorToActivate.walletConnectProvider?.wc?.uri) {
      // eslint-disable-next-line no-param-reassign
      connectorToActivate.walletConnectProvider = undefined;
    }

    if (connectorToActivate) {
      activate(connectorToActivate).catch(activationError => {
        if (activationError instanceof UnsupportedChainIdError) {
          activate(connectorToActivate); // a little janky...can't use setError because the connector isn't set
        } else {
          // TODO handle error
          console.log('activation error : ', activationError);
        }
      });
    }
  };  

  const getWalletsList = () => Object.keys(SUPPORTED_WALLETS).map(walletKey => {
    const wallet: WalletInfo = SUPPORTED_WALLETS[walletKey];
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;

    // mobile options
    if (isMobile) {
      if(!wallet.mobile)
        return null;
    } 
    // desktop options
    if(!wallet.desktop)
      return null;
    // if this wallet has an injected connector
    if (wallet.connector === injected) {
      // and there is no injected provider in window
      if (!(window.web3 || window.ethereum)) {
        // if this wallet is metamask, suggest to install it
        if (wallet.name === 'MetaMask') {
          return (
            <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
              <div className={style.WalletItem} key={`${walletKey}-option`} >
                {wallet.icon && wallet.icon({ className: style.WalletSVG })}
                Install Metamask
              </div>
            </a>
          );
        }
        // if it's not metamask, display nothing
        return null;
      }
      // if there is an injected provider, but it's not metamask, display nothing
      if (wallet.name === 'MetaMask' && !isMetamask) {
        return null;
      }
      // if injected provider is metamask, don't display generic
      if (wallet.name === 'Injected' && isMetamask) {
        return null;
      }
    }
    return (
      <div className={style.WalletItem} key={`${walletKey}-option`} onClick={() => {
          if (wallet.connector !== connector) tryActivation(wallet.connector);
        }} >
        {wallet.icon ? wallet.icon({ className: style.WalletSVG }) : null}
        {wallet.name}
      </div>
    );
  });

  return(
  <div id="modalWallet" className={style.Background}>
    <div className={style.Container}>
      <Close onClick={() => setModalExpand(false)} className={style.Close} />
      <div className={style.Title}>Connect your wallet</div>
      <div className={style.Subtitle}>
        Connect with one of the available wallet
      </div>
      <div className={style.Wallets}>
        {getWalletsList()}
        <div className={style.WalletItem}>
          <Fortmatic className={style.WalletSVG} />
          Fortmatic
        </div>
        <div className={style.WalletItem}>
          <WalletLink className={style.WalletSVG} />
          WalletLink
        </div>
      </div>
      <div className={style.Secret}>
        <Key className={style.KeySVG} />
        <span className={style.Text}>
          We do not own your private keys and cannot access your funds without
          your confirmation.
        </span>
      </div>
    </div>
  </div>
);};

export default ModalWallets;
