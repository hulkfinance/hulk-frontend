import React, { useContext } from 'react'
import { Menu as UikitMenu } from '@hulkfinance/hulk-uikit'
import config from './config'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import useAuth from '../../hooks/useAuth'
import { usePriceHULKBusd } from '../../state/farms/hooks'
import useTheme from '../../hooks/useTheme'
import { LanguageContext } from '../../contexts/Localisation/languageContext'
import { languages } from '../../config/localisation/languages'

const Menu = (props: any) => {
  const { account } = useActiveWeb3React()
  const {login, logout} = useAuth()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const hulkPriceUsd = usePriceHULKBusd()

  return (
    <>
      <UikitMenu
        account={account}
        login={login}
        logout={logout}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={selectedLanguage && selectedLanguage.code}
        langs={Object.keys(languages)}
        setLang={setSelectedLanguage}
        cakePriceUsd={hulkPriceUsd.toNumber()}
        links={config}
        priceLink="https://bscscan.com/token/0x787732f27d18495494cea3792ed7946bbcff8db2"
        {...props}
      />
    </>
  )
}

export default Menu
