import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { BigNumber } from '@ethersproject/bignumber'
import { Toast, toastTypes } from '@hulkfinance/hulk-uikit'
import { fromWei, toWei } from 'web3-utils'
import { useHulkContract, useHulkPreContract, useHulkSwapContract } from './useContract'
import { getHulkSwapAddress } from '../utils/addressHelpers'
import useBlock from './useBlock'
import { useIfoApprove } from './useApprove'
import { ToastContext } from '../contexts/ToastContext'
import { escapeRegExp, inputRegex, shortBalance } from '../utils'

const BN_0 = BigNumber.from('0')

export default function useHulkSwap() {
  const {account} = useWallet()
  const { addToast } = useContext(ToastContext)
  const hulkSwapContract = useHulkSwapContract()
  const hulkPreContract = useHulkPreContract()
  const hulkContract = useHulkContract()
  const [pending, setPending] = useState<boolean>(false)
  const [pendingApprove, setPendingApprove] = useState<boolean>(false)
  const onHulkPreApprove = useIfoApprove(hulkPreContract, getHulkSwapAddress())
  const [amount, setAmount] = useState<string>('')
  const [amountOut, setAmountOut] = useState<string>('')

  const [hulkBalance, setHulkBalance] = useState<BigNumber>(BN_0)
  const [hulkPreBalance, setHulkPreBalance] = useState<BigNumber>(BN_0)
  const [allowance, setAllowance] = useState<BigNumber>(BN_0)
  const block = useBlock()

  const getData = useCallback(() => {
    if (account) {
      if (hulkPreContract) {
        hulkPreContract.methods.balanceOf(account).call()
          .then((res: string) => {
            setHulkPreBalance(BigNumber.from(res))
          })
          .catch((e: any) => console.log(e))
        hulkPreContract.methods.allowance(account, getHulkSwapAddress()).call()
          .then((res: string) => {
            setAllowance(BigNumber.from(res))
          })
          .catch((e: any) => console.log(e))
      }
      if (hulkContract) {
        hulkContract.methods.balanceOf(account).call()
          .then((res: string) => {
            setHulkBalance(BigNumber.from(res))
          })
          .catch((e: any) => console.log(e))
      }
    }
  }, [account, hulkContract, hulkPreContract])

  useEffect(() => {
    getData()
  }, [getData, block])

  const onChangeAmountIn = useCallback( async (value: string) => {
    let nextUserInput = value.replace(/,/g, '.')
    const maxBalance = fromWei(hulkPreBalance.toString())
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      nextUserInput = parseFloat(nextUserInput) > parseFloat(maxBalance) ? maxBalance.toString() : nextUserInput
      setAmount(nextUserInput)
      setAmountOut(nextUserInput)
    }
  }, [hulkPreBalance])

  const onChangeAmountOut = useCallback( async (value: string) => {
    let nextUserInput = value.replace(/,/g, '.')
    const maxBalance = fromWei(hulkPreBalance.toString())
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      nextUserInput = parseFloat(nextUserInput) > parseFloat(maxBalance) ? maxBalance.toString() : nextUserInput
      setAmountOut(nextUserInput)
      setAmount(nextUserInput)
    }
  }, [hulkPreBalance])

  const onSwap = useCallback(async () => {
    if (hulkSwapContract) {
      const now = Date.now()
      const toast: Toast = {
        id: `id-${now}`,
        title: `SWap token: Success`,
        description: `Confirm! You Swap ${amount} HULKPre to ${amountOut} HULK!`,
        type: toastTypes.SUCCESS,
      }
      setPending(true)
      const trx = await hulkSwapContract.methods
        .swap(toWei(amount))
        .send({ from: account })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
        .catch((e: any) => {
          toast.title = 'Swap token: Failed'
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
  }, [hulkSwapContract, amount, amountOut, account, addToast, getData])

  const onApprove = useCallback( async () => {
    if (account) {
      setPendingApprove(true)
      try {
        await onHulkPreApprove()
      } catch (e) {
        console.log(e)
      }
      setPendingApprove(false)
      getData()
    }
  }, [account, getData, onHulkPreApprove])

  return useMemo(() => {
    return {
      allowance,
      hulkBalance,
      hulkPreBalance,
      onApprove,
      pending,
      pendingApprove,
      onSwap,
      onChangeAmountIn,
      onChangeAmountOut,
      amount,
      amountOut
    }
  }, [
    allowance,
    hulkBalance,
    hulkPreBalance,
    onApprove,
    pending,
    pendingApprove,
    onSwap,
    onChangeAmountIn,
    onChangeAmountOut,
    amount,
    amountOut
  ])
}