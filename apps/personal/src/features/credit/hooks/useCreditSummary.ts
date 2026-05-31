import { useMemo } from 'react'
import { useCredits } from './useCredits'

interface CreditSummary {
  totalLimit: number
  totalOutstanding: number
  totalMonthlyBurden: number
  utilizationPct: number
  activeCount: number
  nextDue: Date | null
  nextDueAmount: number
  creditScore: number
  scoreTrend: number
  isLoading: boolean
  isError: boolean
}

export const useCreditSummary = (): CreditSummary => {
  const { data: credits = [], isLoading, isError } = useCredits()

  const summary = useMemo(() => {
    let totalLimit = 0
    let totalOutstanding = 0
    let totalMonthlyBurden = 0
    let activeCount = credits.length

    let nextDue: Date | null = null
    let nextDueAmount = 0

    credits.forEach((acc) => {
      const credit = acc.credit
      if (credit) {
        totalLimit += credit.limit || 0
        totalOutstanding += credit.total_amount || 0
        totalMonthlyBurden += credit.installment_amount || 0

        if (credit.due_date) {
          const dueDate = new Date(credit.due_date)

          const now = new Date()
          if (dueDate >= now) {
            if (!nextDue || dueDate < nextDue) {
              nextDue = dueDate
              nextDueAmount = credit.installment_amount || 0
            }
          }
        }
      }
    })

    const utilizationPct = totalLimit > 0 ? (totalOutstanding / totalLimit) * 100 : 0

    return {
      totalLimit,
      totalOutstanding,
      totalMonthlyBurden,
      utilizationPct,
      activeCount,
      nextDue,
      nextDueAmount,

      creditScore: 742,
      scoreTrend: 8,
    }
  }, [credits])

  return {
    ...summary,
    isLoading,
    isError,
  }
}
