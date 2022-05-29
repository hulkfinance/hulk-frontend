import React, { useState, useCallback, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@hulkfinance/hulk-uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import BigNumber from 'bignumber.js/bignumber'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { provider as ProviderType } from 'web3-core'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'
import useAllEarnings from '../../../hooks/useAllEarnings'
import { usePriceMashBusd } from '../../../state/hooks'
import { getCakeAddress } from '../../../utils/addressHelpers'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getBalanceNumber } from '../../../utils/formatBalance'
import hulkLogo from '../../../assets/images/HulkLogo.svg'
import metamaskLogo from '../../../assets/images/MetamaskIcon.svg'
import HomeFarm from '../../../assets/images/HomeFarmImage.png'
import useWeb3 from '../../../hooks/useWeb3'

const StyledFarmStakingCard = styled(Card)`
  min-height: 376px;
  position: relative;
`

const Block = styled.div`
  //margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 20px;
  line-height: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`

const Actions = styled.div`
  margin-top: 24px;
  position: relative;
`

const CardImage = styled.img`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
  display: none;
  @media(min-width: 768px) {
    display: block;
  }
`

const Token = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 32px;
`

const Metamask = styled.div`
  display: flex;
  padding: 11px 13px 11px 24px;
  background: rgba(255, 255, 255, 0.37);
  border-radius: 24px;
  margin-left: 16px;
  transition: background-color .25s ease;
  cursor: pointer;
  span {
    color: #fff;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 24px;
  }
  img {
    margin-left: 19px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`

const CardHeading = styled(Heading)`
  font-size: 28px;
  font-weight: 900;
  @media(min-width: 768px) {
    font-size: 40px;
  }
`

const FarmedStakingCard = () => {
  const token: {
    symbol: string,
    decimals: number,
    address: string,
    image?: string,
  } = useMemo(() => {
    return {
      symbol: 'HULK',
      decimals: 18,
      address: getCakeAddress(),
      // image: 'https://pbs.twimg.com/profile_images/802481220340908032/M_vde_oi_400x400.jpg',
    }
  }, [])
  const [pendingTx, setPendingTx] = useState(false)
  const { account, ethereum }: { ethereum: ProviderType, account: any } = useWallet()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()))
  const hulkPrice = usePriceMashBusd().toNumber()
  const earningsSum = farmsWithBalance.reduce((accum, farm) => {
    return accum + new BigNumber(farm.balance).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  const onAddToken = useCallback(() => {
    if (ethereum) {
      ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: token,
        },
      })
    }
  }, [ethereum, token])

  return (
    <StyledFarmStakingCard>
      <CardImage src={HomeFarm} alt='Home Farm Image'/>
      <CardBody p={40}>
        <CardHeading size="xl" mb="24px">
          {TranslateString(542, 'Farms & Staking')}
        </CardHeading>
        <Token>
          <img src={hulkLogo} alt="hulk logo" width={74} height={74} />
          <Metamask onClick={onAddToken}>
            <span>+</span>
            <img src={metamaskLogo} alt="metamask logo" width={24} height={24} />
          </Metamask>
        </Token>
        <Button
          id="buy-all"
          disabled={false}
          mb={24}
        >
          Buy HULk
        </Button>
        <Block>
          <Label>{TranslateString(544, 'HULK to Harvest')}</Label>
          <CakeHarvestBalance earningsSum={earningsSum}/>
          <Label>~${(hulkPrice * earningsSum).toFixed(2)}</Label>
        </Block>
        <Block>
          <Label>{TranslateString(546, 'HULK in Wallet')}</Label>
          <CakeWalletBalance cakeBalance={cakeBalance} />
          <Label>~${(hulkPrice * cakeBalance).toFixed(2)}</Label>
        </Block>
        <Actions>
          {account ? (
            <Button
              id="harvest-all"
              disabled={balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
              fullWidth
            >
              {pendingTx
                ? TranslateString(548, 'Collecting HULK')
                : TranslateString(999, `Harvest all (${balancesWithValue.length})`)}
            </Button>
          ) : (
            <UnlockButton fullWidth />
          )}
        </Actions>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
