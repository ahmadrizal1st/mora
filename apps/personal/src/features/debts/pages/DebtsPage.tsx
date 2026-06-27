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
      <div className="container-xl py-4">
        <div className="row row-cards g-3">
          
          {/* Top Summary Cards */}
          <div className="col-12">
            <DebtSummaryCards 
              totalPiutang={summary.totalReceivable}
              totalUtang={summary.totalDebt}
              jatuhTempoCount={8}
              jatuhTempoAmount={3850000}
              arusKasBersih={summary.netCashflow}
            />
          </div>

          {/* Top Widgets Row */}
          <div className="col-12 col-lg-8 d-flex flex-column">
            <div className="row g-3 flex-grow-1">
              <div className="col-12 col-md-7 col-xl-8 d-flex flex-column">
                <DebtTrendChart />
              </div>
              <div className="col-12 col-md-5 col-xl-4 d-flex flex-column">
                <DebtHealthScore />
              </div>
            </div>
          </div>

          {/* Sidebar Widget (Aligned with top row) */}
          <div className="col-12 col-lg-4 d-flex flex-column">
            <DebtRemindersWidget />
          </div>

          {/* Data Table (Full Width) */}
          <div className="col-12">
            <DebtDataTable />
          </div>

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
