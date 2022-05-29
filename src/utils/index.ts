import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}
// export const inputRegex = RegExp(`^\\d*$`) // match escaped "." characters via in a non-capturing group
export const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
export const shortBalance = (balance: string, length = 6) => {
  const balanceArr = balance.split('.')
  if (balanceArr.length > 1) {
    const integerPart = balanceArr[0]
    const floatPart = balanceArr[1].length > length ? balanceArr[1].slice(0, length) : balanceArr[1]
    return `${integerPart}.${floatPart}`
  }
  return balance
}
export const addZeroForward = (string: string, needLength = 2) => {
  return `${'0'.repeat(needLength - string.length)}${string}`
}
export const shortAddress = (address: string) => {
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}