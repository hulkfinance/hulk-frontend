import React, { useEffect, Suspense, lazy, useContext, useCallback } from 'react'
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { isAddress } from "ethers/lib/utils";
import { ResetCSS, ToastContainer } from '@hulkfinance/hulk-uikit'
import BigNumber from 'bignumber.js'
import { useFetchPublicData } from 'state/hooks'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'
import { ToastContext } from './contexts/ToastContext'
import useReferral from './hooks/useReferral'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Referral = lazy(() => import('./views/Referral'))
const PreSale = lazy(() => import('./views/PreSale'))
const Farms = lazy(() => import('./views/Farms'))
// const LaunchPools = lazy(() => import('./views/LaunchPools'))
// const Lottery = lazy(() => import('./views/Lottery'))
const Pools = lazy(() => import('./views/Pools'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
// const Nft = lazy(() => import('./views/Nft'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account, connect } = useWallet()
  const {onSaveAffiliateAddress} = useReferral()
  const {toasts, removeToast} = useContext(ToastContext)
  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect('injected')
    }
  }, [account, connect])

  // useFetchPublicData()

  const saveAffiliateHandler = useCallback((search: string) => {
    if (search !== '') {
      const searchSplit = search.split('=')
      if (searchSplit.length > 1) {
        const affiliateAddress = searchSplit[1]
        if (isAddress(affiliateAddress) && affiliateAddress !== account) {
          onSaveAffiliateAddress(affiliateAddress)
        }
      }
    }
  }, [account, onSaveAffiliateAddress])

  useEffect(() => {
    if (window.location.search) {
      saveAffiliateHandler(window.location.search)
    }
  }, [saveAffiliateHandler])

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/pre-sale" exact>
              <PreSale />
            </Route>
            <Route path="/farms">
              <Farms/>
            </Route>
            <Route path="/pools">
              <Farms tokenMode/>
            </Route>
            <Route path="/launch">
              <Pools />
            </Route>
             <Route path="/referral">
              <Referral />
             </Route>
            {/* <Route path="/lottery"> */}
            {/*  <Lottery /> */}
            {/* </Route> */}
            {/* <Route path="/ifo"> */}
            {/*  <Ifos /> */}
            {/* </Route> */}
            {/* <Route path="/nft"> */}
            {/*  <Nft /> */}
            {/* </Route> */}
            {/* Redirect */}
            {/* <Route path="/staking"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* <Route path="/syrup"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
    </Router>
  )
}

export default React.memo(App)
