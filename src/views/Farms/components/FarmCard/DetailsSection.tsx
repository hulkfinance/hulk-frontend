import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, Link, LinkExternal } from '@hulkfinance/hulk-uikit'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Address } from 'config/constants/types'

export interface ExpandableSectionProps {
  isTokenOnly?: boolean
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  quoteTokenAdresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const DetailText = styled(Text)`
  font-size: 20px;
  text-transform: uppercase;
  font-weight: normal;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isTokenOnly,
  bscScanAddress,
  removed,
  totalValueFormated,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
}) => {
  const TranslateString = useI18n()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <DetailText>{TranslateString(316, 'Stake')}:</DetailText>
        <StyledLinkExternal fontSize="20px" href={
          isTokenOnly ?
            `https://exchange.marshmallowdefi.com/#/swap/${tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
            :
            `https://exchange.marshmallowdefi.com/#/add/${liquidityUrlPathParts}`
        }>
          {lpLabel}
        </StyledLinkExternal>
      </Flex>
      {!removed && (
        <Flex justifyContent="space-between">
          <DetailText>{TranslateString(23, 'Total Liquidity')}:</DetailText>
          <DetailText>{totalValueFormated}</DetailText>
        </Flex>
      )}
      <Flex justifyContent="flex-start">
        <Link external href={bscScanAddress} fontSize="20px">
          {TranslateString(356, 'View on BscScan')}
        </Link>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection
