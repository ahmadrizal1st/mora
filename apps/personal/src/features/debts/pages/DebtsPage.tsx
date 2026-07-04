import { useMemo, useRef } from 'react'
import { Icon } from '@/shared/components/ui/Icon'

import BaseLayout from '@/shared/layouts/BaseLayout'
import { DebtSummaryCards } from '../components/dashboard/DebtSummaryCards'
import { DebtTrendChart } from '../components/dashboard/DebtTrendChart'
import { DebtHealthScore } from '../components/dashboard/DebtHealthScore'
import { DebtDataTable, DebtDataTableRef } from '../components/dashboard/DebtDataTable'
import { DebtRemindersWidget } from '../components/dashboard/DebtRemindersWidget'
import { useDebts } from '../hooks/useDebts'

export function DebtsPage() {
  const debtTableRef = useRef<DebtDataTableRef>(null)
  const { data: debts = [], isLoading } = useDebts()

  const handleAdd = () => {
    debtTableRef.current?.openCreate()
  }

  const summary = useMemo(() => {
    const activeDebts = debts.filter((d: any) => d.type === 'Utang' && d.status !== 'Lunas')
    const activeReceivables = debts.filter((d: any) => d.type === 'Piutang' && d.status !== 'Lunas')

    const totalDebtAmount = activeDebts.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)
    const totalReceivableAmount = activeReceivables.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)

    // Calculate trends based on new debts added this month vs last month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const isThisMonth = (dateString: string) => {
      const d = new Date(dateString)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }

    const isLastMonth = (dateString: string) => {
      const d = new Date(dateString)
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    }

    const piutangThisMonth = debts.filter((d: any) => d.type === 'Piutang' && isThisMonth(d.createdAt)).reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)
    const piutangLastMonth = debts.filter((d: any) => d.type === 'Piutang' && isLastMonth(d.createdAt)).reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)
    const trendPiutang = piutangLastMonth === 0 ? (piutangThisMonth > 0 ? 100 : 0) : ((piutangThisMonth - piutangLastMonth) / piutangLastMonth) * 100

    const utangThisMonth = debts.filter((d: any) => d.type === 'Utang' && isThisMonth(d.createdAt)).reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)
    const utangLastMonth = debts.filter((d: any) => d.type === 'Utang' && isLastMonth(d.createdAt)).reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)
    const trendUtang = utangLastMonth === 0 ? (utangThisMonth > 0 ? 100 : 0) : ((utangThisMonth - utangLastMonth) / utangLastMonth) * 100

    const cashflowThisMonth = piutangThisMonth - utangThisMonth
    const cashflowLastMonth = piutangLastMonth - utangLastMonth
    const trendCashflow = cashflowLastMonth === 0 ? (cashflowThisMonth > 0 ? 100 : (cashflowThisMonth < 0 ? -100 : 0)) : ((cashflowThisMonth - cashflowLastMonth) / Math.abs(cashflowLastMonth)) * 100

    // Calculate overdue (Jatuh Tempo)
    const overdueDebts = activeDebts.filter((d: any) => new Date(d.dueDate) < new Date() || d.status === 'Jatuh Tempo')
    const overdueCount = overdueDebts.length
    const overdueAmount = overdueDebts.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)

    return {
      totalDebt: totalDebtAmount,
      totalReceivable: totalReceivableAmount,
      activeDebtCount: activeDebts.length,
      activeReceivableCount: activeReceivables.length,
      netCashflow: totalReceivableAmount - totalDebtAmount,
      overdueCount,
      overdueAmount,
      trendPiutang,
      trendUtang,
      trendCashflow,
    }
  }, [debts])

  return (
    <BaseLayout 
      pageTitle="Utang & Piutang"
      pageDescription="Kelola seluruh utang dan piutang Anda dengan mudah"
      containerFlushMobile={true}
      flush={true}
      bodyClass="px-0 bg-light"
    >
      <div className="d-flex flex-column gap-3">
        
        {/* Top Summary Cards */}
        <div>
          <DebtSummaryCards 
            totalPiutang={summary.totalReceivable}
            totalUtang={summary.totalDebt}
            jatuhTempoCount={summary.overdueCount}
            jatuhTempoAmount={summary.overdueAmount}
            arusKasBersih={summary.netCashflow}
            trendPiutang={summary.trendPiutang}
            trendUtang={summary.trendUtang}
            trendCashflow={summary.trendCashflow}
          />
        </div>

        {/* Main Content Area (Widgets + Sidebar) */}
        <div className="d-flex flex-wrap gap-3">
          
          {/* Top Widgets Row */}
          <div className="d-flex flex-wrap gap-3 flex-grow-1" style={{ flexBasis: '60%' }}>
            <div className="flex-grow-1" style={{ flexBasis: '55%', minWidth: '300px' }}>
              <DebtTrendChart debts={debts} onAdd={handleAdd} />
            </div>
            <div className="flex-grow-1" style={{ flexBasis: '40%', minWidth: '250px' }}>
              <DebtHealthScore debts={debts} onAdd={handleAdd} />
            </div>
          </div>

          {/* Sidebar Widget (Aligned with top row) */}
          <div className="flex-grow-1" style={{ flexBasis: '30%', minWidth: '300px' }}>
            <DebtRemindersWidget debts={debts} onAdd={handleAdd} />
          </div>

        </div>

        {/* Data Table (Full Width) */}
        <div>
          <DebtDataTable ref={debtTableRef} records={debts} isLoading={isLoading} />
        </div>

      </div>
      
      {/* Floating Action Button (Mobile) */}
      <button
        className="btn btn-primary rounded-circle position-fixed shadow-lg d-md-none d-flex align-items-center justify-content-center p-0"
        style={{
          bottom: 32,
          right: 32,
          width: 64,
          height: 64,
          zIndex: 1020,
          backgroundColor: '#ff7000',
          borderColor: '#ff7000',
        }}
        aria-label="Tambah Baru"
        onClick={handleAdd}
      >
        <Icon icon="plus" size={32} stroke={3} />
      </button>
    </BaseLayout>
  )
}
