import BigNumber from 'bignumber.js'
import {createSelector} from '@reduxjs/toolkit'
import {BIG_ZERO} from '../../utils/bigNumber'
import {getBalanceAmount} from '../../utils/formatBalance'
import {State, SerializedFarm, DeserializedFarm, DeserializedFarmUserData} from '../types'
import {deserializeToken} from '../user/hooks/helpers'

const deserializeFarmUserData = (farm: SerializedFarm): DeserializedFarmUserData => {
    return {
        allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
        tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
        stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
        earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
        canHarvest: farm.userData ? farm.userData.canHarvest : false,
        nextHarvestUntil: farm.userData?.nextHarvestUntil
    }
}

const deserializeFarm = (farm: SerializedFarm): DeserializedFarm => {
    const {lpAddresses, lpSymbol, pid, dual, multiplier, isCommunity, quoteTokenPriceBusd, tokenPriceBusd, defaultApr, depositFeeBP} = farm

    return {
        lpAddresses,
        defaultApr,
        depositFeeBP,
        lpSymbol,
        pid,
        dual,
        multiplier,
        isCommunity,
        quoteTokenPriceBusd,
        tokenPriceBusd,
        token: deserializeToken(farm.token),
        quoteToken: deserializeToken(farm.quoteToken),
        userData: deserializeFarmUserData(farm),
        tokenAmountTotal: farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO,
        quoteTokenAmountTotal: farm.quoteTokenAmountTotal ? new BigNumber(farm.quoteTokenAmountTotal) : BIG_ZERO,
        lpTotalInQuoteToken: farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO,
        lpTotalSupply: farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO,
        tokenPriceVsQuote: farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO,
        poolWeight: farm.poolWeight ? new BigNumber(farm.poolWeight) : BIG_ZERO,
    }
}

const selectHulkFarm = (state: State) => state.farms.data.find((f) => f.pid === 2)
const selectFarmByKey = (key: string, value: string | number) => (state: State) =>
// @ts-ignore
    state.farms.data.find((f) => f[key] === value)

export const makeFarmFromPidSelector = (pid: number) =>
    createSelector([selectFarmByKey('pid', pid)], (farm) => farm ? deserializeFarm(farm) : null)

export const makeBusdPriceFromPidSelector = (pid: number) =>
    createSelector([selectFarmByKey('pid', pid)], (farm) => {
        if (farm) {
            const deserializedFarm = deserializeFarm(farm)
            return deserializedFarm && new BigNumber(deserializedFarm.tokenPriceBusd || '')
        }
    })

export const makeUserFarmFromPidSelector = (pid: number) =>
    createSelector([selectFarmByKey('pid', pid)], (farm) => {
        if (farm) {
            const {userData} = deserializeFarm(farm)
            if (userData) {
                const {allowance, tokenBalance, stakedBalance, earnings, canHarvest, nextHarvestUntil} = userData
                return {
                    allowance,
                    tokenBalance,
                    stakedBalance,
                    earnings,
                    canHarvest,
                    nextHarvestUntil
                }
            }
        }
    })

export const priceHulkFromPidSelector = createSelector([selectHulkFarm], (hulkBnbFarm) => {
    if (hulkBnbFarm) {
        const deserializedHulkBnbFarm = deserializeFarm(hulkBnbFarm)
        const umPriceBusdAsString = deserializedHulkBnbFarm.tokenPriceBusd
        return new BigNumber(umPriceBusdAsString || '')
    }
})

export const farmFromLpSymbolSelector = (lpSymbol: string) =>
    createSelector([selectFarmByKey('lpSymbol', lpSymbol)], (farm) => farm ? deserializeFarm(farm) : null)

export const makeLpTokenPriceFromLpSymbolSelector = (lpSymbol: string) =>
    createSelector([selectFarmByKey('lpSymbol', lpSymbol)], (farm) => {
        let lpTokenPrice = BIG_ZERO
        if (farm) {
            const deserializedFarm = deserializeFarm(farm)
            if (deserializedFarm) {
                const farmTokenPriceInUsd = deserializedFarm && new BigNumber(deserializedFarm.tokenPriceBusd || '')

                if (deserializedFarm?.lpTotalSupply?.gt(0) && deserializedFarm.lpTotalInQuoteToken?.gt(0)) {
                    // Total value of base token in LP
                    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(deserializedFarm.tokenAmountTotal || '')
                    // Double it to get overall value in LP
                    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
                    // Divide total value of all tokens, by the number of LP tokens
                    const totalLpTokens = getBalanceAmount(deserializedFarm.lpTotalSupply)
                    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
                }
            }
        }
        return lpTokenPrice
    })

export const farmSelector = createSelector(
    (state: State) => state.farms,
    (farms) => {
        const deserializedFarmsData = farms.data.map(deserializeFarm)
        const {loadArchivedFarmsData, userDataLoaded, poolLength, regularHulkPerBlock} = farms
        return {
            loadArchivedFarmsData,
            userDataLoaded,
            data: deserializedFarmsData,
            poolLength,
            regularHulkPerBlock,
        }
    },
)