import { Web3ReactProvider } from "@web3-react/core";
import React from "react";

import "style/base.scss";
import { getLibrary } from "wallets/utils";

interface Props {
  Component: any;
  pageProps: any;
}

const App: React.FC<Props> = ({ Component, pageProps }) => (
    <>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </>
  );

export default App;
