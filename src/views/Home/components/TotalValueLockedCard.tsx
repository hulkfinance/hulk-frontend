import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@hulkfinance/hulk-uikit'
import CardValue from './CardValue'
import tvlImage from '../../../assets/images/TVL.png'
import useI18n from '../../../hooks/useI18n'
import { useTotalValue } from '../../../state/farms/hooks'

const StyledTotalValueLockedCard = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`
const CardImage = styled.img`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 100%;
  max-height: 208px;
  display: none;
  @media(min-width: 768px) {
    display: block;
  }
`

const TextItem = styled(Text)`
  font-size: 20px;
  line-height: 1.2;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  justify-content: space-between;
  margin-bottom: 16px;
`

const CardHeading = styled(Heading)`
  font-size: 24px;
  font-weight: 900;
`

const TotalValueLockedCard = () => {
  const TranslateString = useI18n()
  // const data = useGetStats()
  const totalValue = useTotalValue();
  // const tvl = totalValue.toFixed(2);

  return (
    <StyledTotalValueLockedCard>
      <Card mb={40}>
        <CardBody p={40}>
          <CardHeading mb="16px">
            {TranslateString(999, 'TVL')}
          </CardHeading>
          <>
            <CardValue bold value={totalValue.toNumber()} prefix="$" decimals={2}/>
            <Text mt={16} color="primary" fontSize="20px" style={{lineHeight: 1}}>{TranslateString(999, 'Across all Farms and Pools')}</Text>
            <CardImage src={tvlImage} alt='TVL'/>
          </>
        </CardBody>
      </Card>
      <Card style={{flex: 1}}>
        <CardBody p={40}>
          <CardHeading mb="16px">
            HULK LP Worth
          </CardHeading>
          <>
            <Row>
              <TextItem>HULK-BNB</TextItem>
              <TextItem>$5.911</TextItem>
            </Row>
            <Row>
              <TextItem>HULK-BUSD</TextItem>
              <TextItem>$0.249</TextItem>
            </Row>
          </>
        </CardBody>
      </Card>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
