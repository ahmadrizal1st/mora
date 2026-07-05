import React, { useMemo } from 'react'
import { CreditScoreGauge, getCreditScoreColor } from '../components/CreditScoreGauge'
import { CreditTypeCards } from '../components/CreditTypeCards'
import { CreditCompositionChart } from '../components/CreditCompositionChart'
import { CreditStrategyChart } from '../components/CreditStrategyChart'
import { useCreditSummary } from '../hooks/useCreditSummary'
import { useCredits } from '../hooks/useCredits'


export function CreditOverviewPage() {
  const {
    totalOutstanding,
    totalMonthlyBurden,
    activeCount,
    utilizationPct,
    creditScore,
    scoreTrend,
    isLoading,
  } = useCreditSummary()
  const { data: credits = [] } = useCredits()

  const getScoreInfo = (sc: number) => {
    if (sc >= 740) return { color: 'success', label: 'Sangat Baik' }
    if (sc >= 670) return { color: 'primary', label: 'Baik' }
    if (sc >= 580) return { color: 'warning', label: 'Cukup' }
    return { color: 'danger', label: 'Perlu Pantau' }
  }
  const { color: scoreColorName, label: scoreLabel } = getScoreInfo(creditScore)
  const exactScoreColor = getCreditScoreColor(creditScore)
  const gradientColor = exactScoreColor.replace('rgb', 'rgba').replace(')', ', 0.15)')

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat ringkasan kredit...</div>
  }

  return (
    <div className="d-flex flex-column gap-3">
      <CreditCompositionChart />
      <CreditStrategyChart />
      <CreditTypeCards />
    </div>
  )
}
