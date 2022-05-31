import React from 'react'
import BigNumber from 'bignumber.js'
import { CalculateIcon, IconButton, useModal } from '@hulkfinance/hulk-uikit'
import ApyCalculatorModal from './ApyCalculatorModal'
import { Address } from '../../../../config/constants/types'

export interface ApyButtonProps {
  lpLabel?: string
  hulkPrice: BigNumber
  apy: number
  quoteTokenAdresses?: string
  quoteTokenSymbol?: string
  tokenAddresses: string
}

const ApyButton: React.FC<ApyButtonProps> = ({
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  hulkPrice,
  apy,
}) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      lpLabel={lpLabel}
      quoteTokenAdresses={quoteTokenAdresses}
      quoteTokenSymbol={quoteTokenSymbol}
      tokenAddresses={tokenAddresses}
      hulkPrice={hulkPrice}
      apy={apy}
    />,
  )

  return (
    <IconButton onClick={onPresentApyModal} variant="text" size="sm" ml="4px">
      <CalculateIcon />
    </IconButton>
  )
}

export default ApyButton
