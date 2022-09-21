import { serializeTokens } from './tokens'
import { SerializedPoolConfig } from './types'
import {defaultChainId} from "../index";

const serializedTokens = serializeTokens()

const farms: SerializedPoolConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 3,
    v1pid: 1,
    lpSymbol: 'HULK (15)',
    defaultApr: '10',
    depositFeeBP: 0,
    lpAddresses: {
      97: '0x5558a1784d200D0fD22e0ba21a15921bf05b72D6',
      56: '',
    },
    token: serializedTokens.hulktoken,
    quoteToken: serializedTokens.hulktoken,
  },
  {
    pid: 9,
    v1pid: 2,
    lpSymbol: 'HULK (30)',
    defaultApr: '10',
    depositFeeBP: 0,
    lpAddresses: {
      97: '0x5558a1784d200D0fD22e0ba21a15921bf05b72D6',
      56: '',
    },
    token: serializedTokens.hulktoken,
    quoteToken: serializedTokens.hulktoken,
  },
  {
    pid: 10,
    v1pid: 3,
    lpSymbol: 'HULK (45)',
    defaultApr: '10',
    depositFeeBP: 0,
    lpAddresses: {
      97: '0x5558a1784d200D0fD22e0ba21a15921bf05b72D6',
      56: '',
    },
    token: serializedTokens.hulktoken,
    quoteToken: serializedTokens.hulktoken,
  },
  {
    pid: 4,
    v1pid: 4,
    lpSymbol: 'HULK (90)',
    defaultApr: '10',
    depositFeeBP: 0,
    lpAddresses: {
      97: '0x5558a1784d200D0fD22e0ba21a15921bf05b72D6',
      56: '',
    },
    token: serializedTokens.hulktoken,
    quoteToken: serializedTokens.hulktoken,
  },

].filter((f) => !!f.lpAddresses[defaultChainId])

export default farms
