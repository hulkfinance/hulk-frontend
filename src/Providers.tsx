import React from 'react'
import { ModalProvider } from '@hulkfinance/hulk-uikit'
// import bsc, { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import * as bsc from '@binance-chain/bsc-use-wallet'
import { Provider } from 'react-redux'
import getRpcUrl from 'utils/getRpcUrl'
import { LanguageContextProvider } from 'contexts/Localisation/languageContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { BlockContextProvider } from 'contexts/BlockContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import store from 'state'
import ToastProvider from './contexts/ToastContext'

const Providers: React.FC = ({ children }) => {
  const rpcUrl = getRpcUrl()
  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
  return (
    <Provider store={store}>
      <ToastProvider>
        <ThemeContextProvider>
          <LanguageContextProvider>
            <bsc.UseWalletProvider
              chainId={chainId}
              connectors={{
                walletconnect: { rpcUrl },
                bsc,
              }}
            >
              <BlockContextProvider>
                <RefreshContextProvider>
                  <ModalProvider>{children}</ModalProvider>
                </RefreshContextProvider>
              </BlockContextProvider>
            </bsc.UseWalletProvider>
          </LanguageContextProvider>
        </ThemeContextProvider>
      </ToastProvider>
    </Provider>
  )
}

export default Providers
