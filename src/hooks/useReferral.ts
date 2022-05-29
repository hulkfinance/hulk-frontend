import {useCallback, useEffect, useMemo, useState} from "react";
import useBlock from './useBlock'
import { storageReferralKey } from '../config/constants'


export default function useReferral() {
    const [affiliateAddress, setAffiliateAddress] = useState<string>('');
    const blockNumber = useBlock()

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
        return {onSaveAffiliateAddress}
    }, [onSaveAffiliateAddress])

}