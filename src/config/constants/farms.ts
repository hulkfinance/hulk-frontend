import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'
import {defaultChainId} from "../index";

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'WBNB-BUSD',
    defaultApr: '10',
    depositFeeBP: 150,
    lpAddresses: {
      97: '0x384Fb8e2f3c3b2086C7aD7f1b77776DB9cbAECff',
      56: '',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 1,
    v1pid: 1,
    lpSymbol: 'HULK-BUSD LP',
    defaultApr: '10',
    depositFeeBP: 0,
    lpAddresses: {
      97: '0x8738f9Df7a429be50a4829280a4A87e153f764d8',
      56: '',
    },
    token: serializedTokens.hulktoken,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 3,
    v1pid: 1,
    lpSymbol: 'HULK-BNB LP',
    defaultApr: '10',
    depositFeeBP: 0,
    lpAddresses: {
      97: '0x71e8d29CEB4b97f870f8CB5b4359C63C9469a5b4',
      56: '',
    },
    token: serializedTokens.hulktoken,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 4,
    v1pid: 1,
    lpSymbol: 'HULK-USDT LP',
    defaultApr: '10',
    depositFeeBP: 0,
    lpAddresses: {
      97: '0xB30aC6bD9C0eB43658017341D8AdFDbCF3F1566C',
      56: '',
    },
    token: serializedTokens.hulktoken,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 5,
    v1pid: 1,
    lpSymbol: 'HULK-CAKE LP',
    defaultApr: '10',
    depositFeeBP: 0,
    lpAddresses: {
      97: '0x70d22EAa4604181c8e702B2a0948f0aa3C3A5FEa',
      56: '',
    },
    token: serializedTokens.hulktoken,
    quoteToken: serializedTokens.cake,
  },
  {
    pid: 6,
    v1pid: 1,
    lpSymbol: 'USDT-BUSD LP',
    defaultApr: '10',
    depositFeeBP: 150,
    lpAddresses: {
      97: '0x35a5889575027a39550bef89d9Ed13e78825C8AD',
      56: '',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 7,
    v1pid: 1,
    lpSymbol: 'USDC-BUSD LP',
    defaultApr: '10',
    depositFeeBP: 150,
    lpAddresses: {
      97: '0x9c9cfC5649D4D234F2f42740E40b19412ff79181',
      56: '',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.busd,
  },

].filter((f) => !!f.lpAddresses[defaultChainId])

export default farms
