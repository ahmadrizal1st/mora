import { createContext, useContext } from 'react'
import type { Account } from '../../transaction/types/transaction.types'

export type CreditLayoutContextType = {
  openFormForType: (type: 'credit_card' | 'kta' | 'kpr' | 'paylater') => void
  openForm: (account: Account) => void
}

export const CreditLayoutContext = createContext<CreditLayoutContextType>({
  openFormForType: () => {},
  openForm: () => {},
})

export const useCreditLayoutContext = () => useContext(CreditLayoutContext)
