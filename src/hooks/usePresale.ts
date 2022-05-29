import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Toast, toastTypes } from '@hulkfinance/hulk-uikit'
import { fromWei, toWei } from 'web3-utils'
import { BigNumber } from '@ethersproject/bignumber'
import { useERC20, useHulkPreContract } from './useContract'
import useBlock from './useBlock'
import { escapeRegExp, inputRegex, shortBalance } from '../utils'
import useWeb3 from './useWeb3'
import { getHulkPreAddress } from '../utils/addressHelpers'
import { useIfoApprove } from './useApprove'
import { ToastContext } from '../contexts/ToastContext'

export enum ERound {
  RoundZero = 0,
  RoundOne = 1,
  RoundTwo = 2,
}

export const ERoundAvailable = {
  0: '210000000000000000000000000',
  1: '210000000000000000000000000',
  2: '210000000000000000000000000',
}

export enum ECoins {
  Zero = '0x0000000000000000000000000000000000000000',
  BUSD = '0xdB1Cc97ada0D2A0bCE7325699A9F1081C95F0ac9',
  USDT = '0xbDf2f04a77Ca7474F127208cab24260197D14a04',
}

export function useGetCurrentRound() {
  const hulkPreContract: any = useHulkPreContract()
  const [round, setRound] = useState<ERound>(ERound.RoundZero)
  const block = useBlock()

  const getData = useCallback(() => {
    if (hulkPreContract) {
      hulkPreContract.methods
        .getCurrentRound().call()
        .then((res) => {
          setRound(parseInt(res))
        })
        .catch((e: any) => {
          console.log(e)
        })
    }
  }, [hulkPreContract])

  useEffect(() => {
    getData()
  }, [getData, block])
  return round
}

export default function usePresale() {
  const BN_0 = BigNumber.from('0')
  const { addToast } = useContext(ToastContext)
  const { account } = useWallet()
  const busdToken = useERC20(ECoins.BUSD)
  const usdtToken = useERC20(ECoins.USDT)
  const onBusdApprove = useIfoApprove(busdToken, getHulkPreAddress())
  const onUsdtApprove = useIfoApprove(usdtToken, getHulkPreAddress())
  const hulkPreContract: any = useHulkPreContract()
  const round = useGetCurrentRound()
  const [availableTokens, setAvailableTokens] = useState<BigNumber>(BN_0)
  const [coin, setCoin] = useState<ECoins | string>(ECoins.Zero)
  const [balance, setBalance] = useState<BigNumber>(BN_0)
  const [allowance, setAllowance] = useState<{ busd: BigNumber, usdt: BigNumber }>({ busd: BN_0, usdt: BN_0 })
  const block = useBlock()
  const [pending, setPending] = useState<boolean>(false)
  const [pendingApprove, setPendingApprove] = useState<boolean>(false)
  const [rate, setRate] = useState<BigNumber>(BN_0)
  const [amountIn, setAmountIn] = useState<string>('')
  const [amountOut, setAmountOut] = useState<string>('')
  const [coinToTokens, setCoinToTokens] = useState<BigNumber>(BN_0)
  const [tokenToCoins, setTokenToCoins] = useState<BigNumber>(BN_0)
  const [percent, setPercent] = useState<number>(0)
  const [price, setPrice] = useState<BigNumber>(BN_0)
  const web3 = useWeb3()

  useEffect(() => {
    if (account && web3 && coin === ECoins.Zero) {
      web3.eth.getBalance(account)
        .then((res) => {
          setBalance(BigNumber.from(res))
        })
        .catch((e: any) => {
          console.log(e)
        })
    }
  }, [coin, account, web3])

  const getData = useCallback(() => {
    if (hulkPreContract) {
      hulkPreContract.methods
        .getPrice().call()
        .then((res) => {
          setPrice(BigNumber.from(res))
        })
        .catch((e: any) => {
          console.log(e)
        })
      hulkPreContract.methods
        .getAvailable().call()
        .then((res) => {
          setAvailableTokens(BigNumber.from(res))
        })
        .catch((e: any) => {
          console.log(e)
        })
    }
  }, [hulkPreContract])

  useEffect(() => {
    getData()
  }, [getData, block])

  const getDataCoins = useCallback(() => {
    if (coin !== ECoins.Zero && account) {
      const tokenContract = coin === ECoins.BUSD ? busdToken : usdtToken
      if (tokenContract) {
        tokenContract.methods
          .balanceOf(account).call()
          .then((res) => {
            setBalance(BigNumber.from(res))
          })
          .catch((e: any) => {
            console.log(e)
          })
        tokenContract.methods
          .allowance(account, getHulkPreAddress()).call()
          .then((res) => {
            setAllowance(prevState => {
              return {
                ...prevState,
                [coin === ECoins.BUSD ? 'busd' : 'usdt']: BigNumber.from(res),
              }
            })
          })
          .catch((e: any) => {
            console.log(e)
          })
      }
    }
  }, [coin, busdToken, usdtToken, account])

  useEffect(() => {
    getDataCoins()
  }, [block, getDataCoins])
  // 1_000_069_780_000
  useEffect(() => {
    if (hulkPreContract) {
      // if (amountIn !== '') {
      //   hulkPreContract.methods
      //     .coinToTokens(toWei(amountIn), coin).call()
      //     .then((res: string) => {
      //       setCoinToTokens(BigNumber.from(res))
      //     })
      //     .catch((e: any) => {
      //       console.log(e)
      //     })
      // }
      hulkPreContract.methods
        .getRate(coin).call()
        .then((res: string) => {
          setRate(BigNumber.from(res))
        })
        .catch((e: any) => {
          console.log(e)
        })
    }
  }, [amountIn, coin, hulkPreContract])


  const onChangeAmountIn = useCallback( async (value: string) => {
    let nextUserInput = value.replace(/,/g, '.')
    const maxBalance = fromWei(balance.toString())
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      nextUserInput = parseFloat(nextUserInput) > parseFloat(maxBalance) ? maxBalance.toString() : nextUserInput
      setAmountIn(shortBalance(nextUserInput, 8))
      if (hulkPreContract && nextUserInput !== '') {
        try {
          const tokens: string = await hulkPreContract.methods.coinToTokens(toWei(nextUserInput), coin).call()
          setCoinToTokens(BigNumber.from(tokens))
          setAmountOut(fromWei(tokens))
        } catch {
          setCoinToTokens(BN_0)
          setAmountOut('')
        }
      } else {
        setCoinToTokens(BN_0)
        setAmountOut('')
      }
    } else {
      setCoinToTokens(BN_0)
      setAmountOut('')
    }
  }, [balance, hulkPreContract, coin, BN_0])

  const onChangeAmountOut = useCallback( async (value: string) => {
    const nextUserInput = value.replace(/,/g, '.')
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setAmountOut(shortBalance(nextUserInput, 8))
      if (hulkPreContract && nextUserInput !== '') {
        try {
          const coins: string = await hulkPreContract.methods.tokensToCoin(toWei(nextUserInput), coin).call()
          setTokenToCoins(BigNumber.from(coins))
          setAmountIn(fromWei(coins))
        } catch {
          setTokenToCoins(BN_0)
          setAmountIn('')
        }
      } else {
        setTokenToCoins(BN_0)
        setAmountIn('')
      }
    } else {
      setTokenToCoins(BN_0)
      setAmountIn('')
    }
  }, [BN_0, coin, hulkPreContract])

  // useEffect(() => {
  //   if (coinToTokens.isZero()) {
  //     onChangeAmountOut('')
  //   } else {
  //     onChangeAmountOut(fromWei(coinToTokens.toString()))
  //   }
  // }, [coinToTokens, onChangeAmountOut])

  // useEffect(() => {
  //   if (!coinToTokens.isZero()) {
  //     if (hulkPreContract) {
  //       hulkPreContract.methods
  //         .tokensToCoin(coinToTokens.toString(), coin).call()
  //         .then((res: string) => {
  //           setTokenToCoins(BigNumber.from(res))
  //         })
  //         .catch((e: any) => {
  //           console.log(e)
  //         })
  //     }
  //   }
  // }, [coin, hulkPreContract, coinToTokens])

  const onBuyTokens = useCallback(async () => {
    if (hulkPreContract) {
      const now = Date.now()
      const toast: Toast = {
        id: `id-${now}`,
        title: `Buy token: Success`,
        description: `Confirm! You bought ${fromWei(amountOut.toString())} HULKPre!`,
        type: toastTypes.SUCCESS,
      }
      setPending(true)
      const valueBnb = toWei(amountIn.toString())
      const value = coinToTokens.toString()
      const params: { from: string, value?: string } = { from: account }
      if (coin === ECoins.Zero) params.value = valueBnb
      const trx = await hulkPreContract.methods
        .buyTokens(value, coin)
        .send({ ...params })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
        .catch((e: any) => {
          toast.title = 'Buy token: Failed'
          toast.type = toastTypes.DANGER
          toast.description = e.receipt !== undefined ? 'Something went wrong!' : e.message
        })
        .finally(() => {
          setPending(false)
          getData()
        })
      if (trx?.transactionHash) {
        toast.action = {
          text: 'View transaction',
          url: `https://testnet.bscscan.com/tx/${trx.transactionHash}`,
        }
      }
      addToast(toast)
    }
  }, [hulkPreContract, amountOut, amountIn, coinToTokens, account, coin, addToast, getData])

  useEffect(() => {
    if (!availableTokens.isZero()) {
      const availableDefault = parseFloat(fromWei(ERoundAvailable[round]))
      const availableCurrent = parseFloat(fromWei(availableTokens.toString()))
      const perc: number = 100 - ((availableCurrent / availableDefault) * 100)
      setPercent(parseFloat(perc.toFixed(3)))
    } else {
      setPercent(100)
    }
  }, [round, availableTokens])

  const onMax = useCallback(() => {
    const maxBalance = shortBalance(fromWei(balance.toString()))
    setAmountIn(maxBalance)
  }, [setAmountIn, balance])

  const onSelectCoin = useCallback((selectCoin: ECoins | string) => {
    setCoin(selectCoin)
  }, [])

  const onApprove = useCallback(() => {
    if (coin !== ECoins.Zero && account) {
      setPendingApprove(true)
      const isBusd = coin === ECoins.BUSD
      if (isBusd) {
        onBusdApprove().then(() => setPendingApprove(false))
      } else {
        onUsdtApprove().then(() => setPendingApprove(false))
      }
      getDataCoins()
    }
  }, [getDataCoins, account, coin, onBusdApprove, onUsdtApprove])

  return useMemo(() => {
    return {
      round,
      availableTokens,
      onBuyTokens,
      pending,
      onChangeAmountIn,
      balance,
      amountIn,
      onMax,
      coin,
      onSelectCoin,
      allowance,
      onApprove,
      pendingApprove,
      percent,
      tokenToCoins,
      amountOut,
      onChangeAmountOut
    }
  }, [
    round,
    availableTokens,
    onBuyTokens,
    pending,
    onChangeAmountIn,
    balance,
    amountIn,
    onMax,
    coin,
    onSelectCoin,
    allowance,
    onApprove,
    pendingApprove,
    percent,
    tokenToCoins,
    amountOut,
    onChangeAmountOut
  ])
}