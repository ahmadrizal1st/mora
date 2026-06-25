import { useMemo } from 'react'
import { Icon } from '@/shared/components/ui/Icon'

import BaseLayout from '@/shared/layouts/BaseLayout'
import { DebtSummaryCards } from '../components/dashboard/DebtSummaryCards'
import { DebtTrendChart } from '../components/dashboard/DebtTrendChart'
import { DebtHealthScore } from '../components/dashboard/DebtHealthScore'
import { DebtDataTable } from '../components/dashboard/DebtDataTable'
import { DebtRemindersWidget } from '../components/dashboard/DebtRemindersWidget'
import { DebtAnalyticsWidget } from '../components/dashboard/DebtAnalyticsWidget'
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

  const pageActions = (
    <div className="btn-list">
      <button className="btn btn-outline-secondary bg-white d-none d-sm-inline-flex align-items-center fw-medium border-0 shadow-sm me-2">
        <Icon icon="download" className="me-2" size={18} />
        Ekspor Laporan
      </button>
      <button className="btn btn-primary d-none d-sm-inline-flex align-items-center fw-medium shadow-sm" style={{ backgroundColor: '#ff7000', borderColor: '#ff7000' }}>
        <Icon icon="plus" className="me-2" size={18} />
        Tambah Baru
      </button>
      
      <button className="btn btn-primary btn-icon d-sm-none" aria-label="Catat Baru" style={{ backgroundColor: '#ff7000', borderColor: '#ff7000' }}>
        <Icon icon="plus" />
      </button>
    </div>
  )

  return (
    <BaseLayout 
      pageTitle="Utang & Piutang"
      pageDescription="Kelola seluruh utang dan piutang Anda dengan mudah"
      containerFlushMobile={true}
      flush={true}
      bodyClass="px-0 bg-light"
      pageActions={pageActions}
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

          {/* Main Content (Left Col) */}
          <div className="col-12 col-lg-8">
            <div className="row g-3">
              {/* Trend Chart & Health Score */}
              <div className="col-12 col-md-7 col-xl-8">
                <DebtTrendChart />
              </div>
              <div className="col-12 col-md-5 col-xl-4">
                <DebtHealthScore />
              </div>

              {/* Data Table */}
              <div className="col-12">
                <DebtDataTable />
              </div>
            </div>
          </div>

          {/* Sidebar (Right Col) */}
          <div className="col-12 col-lg-4">
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-12">
                <DebtRemindersWidget />
              </div>
              <div className="col-12 col-md-6 col-lg-12">
                <DebtAnalyticsWidget />
              </div>
            </div>
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
