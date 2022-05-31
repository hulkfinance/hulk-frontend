const roundToTwoDp = (number: number) => Math.round(number * 100) / 100

export const calculateHulkEarnedPerThousandDollars = ({ numberOfDays, farmApy, hulkPrice }: any) => {
  // Everything here is worked out relative to a year, with the asset compounding daily
  const timesCompounded = 365
  //   We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
  const apyAsDecimal = farmApy / 100
  const daysAsDecimalOfYear = numberOfDays / timesCompounded
  //   Calculate the starting CAKE balance with a dollar balance of $1000.
  const principal = !hulkPrice.isZero() ? 1000 / hulkPrice.toNumber() : 0

  // This is a translation of the typical mathematical compounding APY formula. Details here: https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
  const finalAmount = principal * (1 + apyAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear)

  // To get the cake earned, deduct the amount after compounding (finalAmount) from the starting CAKE balance (principal)
  const interestEarned = finalAmount - principal
  return roundToTwoDp(interestEarned)
}

export const apyModalRoi = ({ amountEarned, amountInvested }: any) => {
  const percentage = amountInvested > 0 ? (amountEarned / amountInvested) * 100 : 0
  return percentage.toFixed(2)
}
