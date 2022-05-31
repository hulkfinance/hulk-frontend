import {useCallback, useEffect, useMemo, useState} from "react";
import { storageReferralKey } from '../config/constants'
import useBlockNumber from './useBlockNumber'


export default function useReferral() {
    const [affiliateAddress, setAffiliateAddress] = useState<string>('0x000000000000000000000000000000000000dEaD');
    const blockNumber = useBlockNumber()

    useEffect(() => {
        const checkedAddress = localStorage.getItem(storageReferralKey)
        if (checkedAddress !== null) {
            setAffiliateAddress(checkedAddress)
        }
    }, [blockNumber])

    const onSaveAffiliateAddress = useCallback((address) => {
        if (affiliateAddress === '') {
            setAffiliateAddress(address)
            localStorage.setItem(storageReferralKey, address)
        }
    }, [affiliateAddress])

    return useMemo(() => {
        return {onSaveAffiliateAddress, affiliateAddress}
    }, [onSaveAffiliateAddress, affiliateAddress])

}