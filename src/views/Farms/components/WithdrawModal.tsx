import BigNumber from 'bignumber.js'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Button, Modal, Toast, toastTypes } from '@hulkfinance/hulk-uikit'
import useI18n from '../../../hooks/useI18n'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import ModalActions from '../../../components/ModalActions'
import useCatchTxError from '../../../hooks/useCatchTxError'
import { ToastContext } from '../../../contexts/ToastContext'
import { getBscScanLink } from '../../../utils'
import { defaultChainId } from '../../../config'
import PercentButtons from '../../../components/Input/PercentButtons'

interface WithdrawModalProps {
  max: BigNumber
  onConfirm: any
  onDismiss?: () => void
  tokenName?: string
  decimals: number
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, decimals, onDismiss, max, tokenName = '' }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, decimals, decimals)
  }, [decimals, max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])
  const handleSelectPercent = useCallback((percent: number) => {
    setVal(getFullDisplayBalance(max.multipliedBy(percent).div(100), decimals, decimals))
  }, [decimals, max])
  const {fetchWithCatchTxError} = useCatchTxError()
  const { addToast } = useContext(ToastContext)
  const onWithdraw = useCallback(async () => {
    setPendingTx(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onConfirm(val)
    })
    if (receipt?.status) {
      const toast: Toast = {
        id: `id-${Date.now()}`,
        title: `Withdraw`,
        description: `You withdraw ${val} ${tokenName}!`,
        type: toastTypes.SUCCESS,
      }
      toast.action = {
        text: 'View transaction',
        url: getBscScanLink(receipt.transactionHash, 'transaction', defaultChainId),
      }
      addToast(toast)
    }

    if (onDismiss) {
      onDismiss()
    }
    setPendingTx(false)
  }, [addToast, fetchWithCatchTxError, onConfirm, onDismiss, tokenName, val])

  return (
    <Modal title={`Withdraw ${tokenName}`} onDismiss={onDismiss}>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />
      <PercentButtons handleSelectPercent={handleSelectPercent}/>
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={onWithdraw}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default WithdrawModal
