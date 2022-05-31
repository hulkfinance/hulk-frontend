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
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.busd,
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
    pid: 2,
    v1pid: 1,
    lpSymbol: 'HULK-HULK',
    defaultApr: '10',
    depositFeeBP: 0,
    lpAddresses: {
      97: '0x5558a1784d200D0fD22e0ba21a15921bf05b72D6',
      56: '',
    },
    token: serializedTokens.hulktoken,
    quoteToken: serializedTokens.hulktoken,
  },
  // {
  //   pid: 0,
  //   v1pid: 0,
  //   lpSymbol: 'CAKE',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  //   },
  //   token: serializedTokens.syrup,
  //   quoteToken: serializedTokens.wbnb,
  // },
  // {
  //   pid: 2,
  //   v1pid: 251,
  //   lpSymbol: 'CAKE-BNB LP',
  //   lpAddresses: {
  //     97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
  //     56: '',
  //   },
  //   token: serializedTokens.hulktoken,
  //   quoteToken: serializedTokens.wbnb,
  // },

].filter((f) => !!f.lpAddresses[defaultChainId])

export default farms
