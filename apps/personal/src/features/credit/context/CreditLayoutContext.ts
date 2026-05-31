import { createContext, useContext } from 'react'

export type CreditLayoutContextType = {
  openFormForType: (type: 'credit_card' | 'kta' | 'kpr' | 'paylater') => void
}

export const CreditLayoutContext = createContext<CreditLayoutContextType>({
  openFormForType: () => {},
})

export const useCreditLayoutContext = () => useContext(CreditLayoutContext)
