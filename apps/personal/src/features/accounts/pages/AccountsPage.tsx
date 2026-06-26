import { useState, useMemo, useEffect } from 'react'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { SummaryMetricCard } from '../components/SummaryMetricCard'
import { AccountCard } from '../components/AccountCard'
import { CashFlowChartCard } from '../components/CashFlowChartCard'
import { TransactionListCard } from '../components/TransactionListCard'
import { SpendingCategoryCard } from '../components/SpendingCategoryCard'
import { AccountVisualCard } from '../components/AccountVisualCard'
import { RecentInsightsCard } from '../components/RecentInsightsCard'
import { TopMerchantsCard } from '../components/TopMerchantsCard'
import { AccountStatsCard } from '../components/AccountStatsCard'
import { Icon } from '@/shared/components/ui/Icon'
import { AddAccountModal } from '../components/AddAccountModal'
import { useAccounts, useAccountSummary } from '../../transaction/hooks/useAccounts'

export function AccountsPage() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data: accountsResponse } = useAccounts({ group_by: 'month' })
  const { data: summaryData } = useAccountSummary()
  
  const accounts = accountsResponse?.data || []

  const [cur, setCur] = useState(0)
  const [range, setRange] = useState('W')
  const [showAddModal, setShowAddModal] = useState(false)
  
  const selectedAcc = accounts[cur]

  const accData = useMemo(() => {
    if (!selectedAcc) return null
    
    const inc = selectedAcc.history?.income?.reduce((a, b) => a + b, 0) || 0
    const exp = selectedAcc.history?.expense?.reduce((a, b) => a + b, 0) || 0
    const chg = inc - exp
    
    // Filter summary data for this account if needed, or just use global for now
    // In a real app we'd fetch account-specific transactions/categories
    const tx = summaryData?.recent_transactions || []
    const rawCats = summaryData?.expenses_by_category || []
    
    const cats = rawCats.map((c: any) => ({
      name: c.category?.name || 'Uncategorized',
      amount: c.total,
      color: c.category?.color || '#000000',
      icon: c.category?.icon || 'box'
    }))

    return {
      name: selectedAcc.name,
      num: selectedAcc.id.substring(0, 8),
      type: selectedAcc.account_type,
      bal: selectedAcc.balance || 0,
      inc,
      exp,
      chg: Math.abs(chg),
      chgPos: chg >= 0,
      logo: 'building-bank',
      color: selectedAcc.color || '#4263eb',
      tx,
      cats
    }
  }, [selectedAcc, summaryData])

  const cfData = useMemo(() => {
    if (!selectedAcc || !selectedAcc.history) {
      return { lbl: ['M1', 'M2', 'M3', 'M4'], inc: [0, 0, 0, 0], exp: [0, 0, 0, 0] }
    }
    
    // Fallback to mock logic for chart if history is empty (since it's a demo)
    if (selectedAcc.history.labels.length === 0) {
      const s = cur * 11
      const map: Record<string, string[]> = {
        W: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        M: ['M1', 'M2', 'M3', 'M4'],
        '3M': ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        Y: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
      }
      const lbl = map[range] || map['W']
      const inc = lbl.map((_, i) => Math.round(500 + Math.abs(Math.sin((i + s) * 1.4)) * 2000))
      const exp = lbl.map((_, i) => Math.round(300 + Math.abs(Math.cos((i + s) * 1.8)) * 1200))
      return { lbl, inc, exp }
    }

    return { 
      lbl: selectedAcc.history.labels, 
      inc: selectedAcc.history.income, 
      exp: selectedAcc.history.expense 
    }
  }, [selectedAcc, cur, range])

  if (!accData) {
    return (
      <BaseLayout pageTitle="Detail Akun & Mutasi">
        <div className="d-flex align-items-center justify-content-center" style={{ height: '50vh' }}>
          <div className="text-muted">Loading accounts...</div>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout pageTitle="Detail Akun & Mutasi">
      <div className="d-flex align-items-stretch overflow-auto gap-3 pb-3 mb-4 no-scrollbar">
        {accounts.length === 0 ? (
          <div
            className="card shadow-sm border-0 flex-fill d-flex align-items-center justify-content-center"
            style={{ minHeight: '160px', background: 'var(--tblr-bg-surface-secondary, #f6f8fb)' }}
          >
            <div className="text-center py-4">
              <div className="empty-icon text-secondary mb-2">
                <Icon icon="wallet-off" size={40} stroke={1.5} opacity={0.6} />
              </div>
              <div className="fw-bold text-body mb-1">Belum Ada Akun</div>
              <div className="text-muted small">Tambahkan akun pertama Anda</div>
            </div>
          </div>
        ) : (
          accounts.map((acc, idx) => (
            <AccountCard
              key={idx}
              isActive={cur === idx}
              type={acc.account_type as any}
              name={acc.name}
              balance={acc.balance || 0}
              delta={0}
              chgPos={true}
              logo={'building-bank'}
              color={acc.color || '#4263eb'}
              onClick={() => setCur(idx)}
            />
          ))
        )}
        <div
          className="card shadow-sm cursor-pointer"
          onClick={() => setShowAddModal(true)}
          style={{
            minWidth: '220px',
            alignSelf: 'stretch',
            border: '1px dashed var(--tblr-border-color)',
            background: 'var(--tblr-bg-surface-secondary, #f6f8fb)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="card-body d-flex flex-column align-items-center justify-content-center flex-fill py-4">
            <div className="mb-2">
              <Icon icon="plus" size="lg" className="text-secondary" stroke={1.5} />
            </div>
            <div className="text-secondary fw-bold small">Tambah Akun</div>
          </div>
        </div>
      </div>

      <div className="d-block d-lg-none mb-3">
        <AccountVisualCard
          name={accData.name}
          num={accData.num}
          type={accData.type as any}
          balance={accData.bal}
          logo={accData.logo}
          color={accData.color}
        />
      </div>

      <div className="row g-2 g-md-3 mb-4">
        <div className="col-6 col-lg-3">
          <SummaryMetricCard
            title="Saldo Terkini"
            value={accData.bal}
            subtext={accData.name}
            icon="wallet"
            iconColor="primary"
          />
        </div>
        <div className="col-6 col-lg-3">
          <SummaryMetricCard
            title="Total Pemasukan"
            value={accData.inc}
            subtext="Terkini"
            icon="trending-up"
            valueColor="success"
          />
        </div>
        <div className="col-6 col-lg-3">
          <SummaryMetricCard
            title="Total Pengeluaran"
            value={accData.exp}
            subtext={`${accData.tx.length} Transaksi Terakhir`}
            icon="trending-down"
            valueColor="danger"
          />
        </div>
        <div className="col-6 col-lg-3">
          <SummaryMetricCard
            title="Net Mutasi"
            value={accData.chgPos ? `+${accData.chg}` : `-${accData.chg}`}
            subtext="Selisih In/Out"
            icon="arrows-exchange"
            valueColor={accData.chgPos ? 'success' : 'danger'}
          />
        </div>
      </div>

      <div className="row row-cards g-3">
        <div className="col-lg-3">
          <div className="row row-cards g-3">
            <div className="col-12 d-none d-lg-block">
              <AccountVisualCard
                name={accData.name}
                num={accData.num}
                type={accData.type as any}
                balance={accData.bal}
                logo={accData.logo}
                color={accData.color}
              />
            </div>
            <div className="col-12">
              <AccountStatsCard />
            </div>
            <div className="col-12">
              <TopMerchantsCard />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="row row-cards g-3">
            <div className="col-12">
              <CashFlowChartCard range={range} setRange={setRange} data={cfData} />
            </div>
            <div className="col-12">
              <TransactionListCard transactions={accData.tx} />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="row row-cards g-3">
            <div className="col-12">
              <SpendingCategoryCard categories={accData.cats as any} />
            </div>
            <div className="col-12">
              <RecentInsightsCard />
            </div>
          </div>
        </div>
      </div>

      <AddAccountModal show={showAddModal} onClose={() => setShowAddModal(false)} />
    </BaseLayout>
  )
}
