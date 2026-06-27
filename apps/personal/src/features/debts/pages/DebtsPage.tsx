import { useMemo } from 'react'
import { Icon } from '@/shared/components/ui/Icon'

import BaseLayout from '@/shared/layouts/BaseLayout'
import { DebtSummaryCards } from '../components/dashboard/DebtSummaryCards'
import { DebtTrendChart } from '../components/dashboard/DebtTrendChart'
import { DebtHealthScore } from '../components/dashboard/DebtHealthScore'
import { DebtDataTable } from '../components/dashboard/DebtDataTable'
import { DebtRemindersWidget } from '../components/dashboard/DebtRemindersWidget'
import { useDebts } from '../hooks/useDebts'

export function DebtsPage() {
  const { data: debts = [], isLoading } = useDebts()
  const summary = useMemo(() => {
    const activeDebts = debts.filter((d: any) => d.type === 'Utang' && d.status !== 'Lunas')
    const activeReceivables = debts.filter((d: any) => d.type === 'Piutang' && d.status !== 'Lunas')

    const totalDebtAmount = activeDebts.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)
    const totalReceivableAmount = activeReceivables.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)

    return {
      totalDebt: totalDebtAmount,
      totalReceivable: totalReceivableAmount,
      activeDebtCount: activeDebts.length,
      activeReceivableCount: activeReceivables.length,
      netCashflow: totalReceivableAmount - totalDebtAmount,
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
            jatuhTempoCount={8}
            jatuhTempoAmount={3850000}
            arusKasBersih={summary.netCashflow}
          />
        </div>

        {/* Main Content Area (Widgets + Sidebar) */}
        <div className="d-flex flex-wrap gap-3">
          
          {/* Top Widgets Row */}
          <div className="d-flex flex-wrap gap-3 flex-grow-1" style={{ flexBasis: '60%' }}>
            <div className="d-flex flex-column flex-grow-1" style={{ flexBasis: '55%', minWidth: '300px' }}>
              <DebtTrendChart />
            </div>
            <div className="d-flex flex-column flex-grow-1" style={{ flexBasis: '40%', minWidth: '250px' }}>
              <DebtHealthScore />
            </div>
          </div>

          {/* Sidebar Widget (Aligned with top row) */}
          <div className="d-flex flex-column flex-grow-1" style={{ flexBasis: '30%', minWidth: '300px' }}>
            <DebtRemindersWidget />
          </div>

        </div>

        {/* Data Table (Full Width) */}
        <div>
          <DebtDataTable />
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
      >
        <Icon icon="plus" size={32} stroke={3} />
      </button>
    </BaseLayout>
  )
}
