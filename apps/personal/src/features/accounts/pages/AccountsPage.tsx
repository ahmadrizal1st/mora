import { useState, useMemo, useEffect } from 'react'
import dayjs from 'dayjs'
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
import { Modal, ModalHeader } from '@/shared/components/ui/Modal'
import { AddAccountModal } from '../components/AddAccountModal'
import { useAccounts, useAccountSummary, useAccountAnalytics, useDeleteAccount } from '../../transaction/hooks/useAccounts'
import { getAccountVisualMeta } from '@/shared/utils/accountVisuals'
import { formatCurrency } from '@/shared/utils/currencyUtils'

export function AccountsPage() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [cur, setCur] = useState(0)
  const [range, setRange] = useState('W')
  const [groupBy, setGroupBy] = useState('day')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  
  const deleteAccount = useDeleteAccount()

  const handleSetRange = (r: string) => {
    setRange(r)
    if (r === 'W') setGroupBy('day')
    else if (r === 'M') setGroupBy('week')
    else if (r === 'Y') setGroupBy('month')
  }

  const dateParams = useMemo(() => {
    const today = dayjs()
    if (range === 'W') {
      return { date_from: today.startOf('week').format('YYYY-MM-DD'), date_to: today.endOf('week').format('YYYY-MM-DD') }
    } else if (range === 'M') {
      return { date_from: today.startOf('month').format('YYYY-MM-DD'), date_to: today.endOf('month').format('YYYY-MM-DD') }
    } else if (range === 'Y') {
      return { date_from: today.startOf('year').format('YYYY-MM-DD'), date_to: today.endOf('year').format('YYYY-MM-DD') }
    }
    return {}
  }, [range])

  const { data: accountsResponse } = useAccounts({ group_by: groupBy, ...dateParams })
  const { data: summaryData } = useAccountSummary()
  
  const accounts = accountsResponse?.data || []
  
  const selectedAcc = accounts[cur]
  const { data: analyticsData } = useAccountAnalytics(selectedAcc?.id)

  const accData = useMemo(() => {
    if (!selectedAcc) return null
    
    const inc = selectedAcc.history?.income?.reduce((a, b) => a + b, 0) || 0
    const exp = selectedAcc.history?.expense?.reduce((a, b) => a + b, 0) || 0
    const chg = inc - exp
    
    const visualMeta = getAccountVisualMeta(selectedAcc.account_type, selectedAcc.color, selectedAcc.logo)
    
    const tx = (analyticsData?.recent_transactions || []).map((t: any) => ({
      ico: t.category?.icon || 'box',
      color: t.category?.color || '#000000',
      n: t.merchant || 'Transaksi',
      c: t.category?.name || 'Uncategorized',
      a: t.type === 'expense' ? `-${formatCurrency(t.amount)}` : `+${formatCurrency(t.amount)}`,
      d: dayjs(t.tx_date).format('D MMM, HH:mm'),
      p: t.type === 'income'
    }))
    const totalExp = analyticsData?.stats?.total_expense || 1
    const rawCats = analyticsData?.expenses_by_category || []
    
    const cats = rawCats.map((c: any) => {
      const amount = Number(c.total)
      return {
        n: c.category?.name || 'Uncategorized',
        v: formatCurrency(amount),
        pct: Math.round((amount / totalExp) * 100),
        color: c.category?.color || 'gray',
        ico: c.category?.icon || 'box'
      }
    })

    return {
      id: selectedAcc.id,
      name: selectedAcc.name,
      num: selectedAcc.id.substring(0, 8),
      type: selectedAcc.account_type,
      bal: selectedAcc.balance || 0,
      inc,
      exp,
      chg: Math.abs(chg),
      chgPos: chg >= 0,
      logo: visualMeta.logo,
      color: visualMeta.color,
      tx,
      cats
    }
  }, [selectedAcc, summaryData, analyticsData])

  const cfData = useMemo(() => {
    if (!selectedAcc || !selectedAcc.history || selectedAcc.history.labels.length === 0) {
      return { lbl: [], inc: [], exp: [] }
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
      <div className="d-flex flex-column gap-4">
        <div className="d-flex align-items-stretch overflow-auto gap-3 no-scrollbar">
        {accounts.length === 0 ? (
          <div
            className="card shadow-sm border-0 flex-fill d-flex align-items-center justify-content-center"
            style={{ minHeight: '200px', background: 'var(--tblr-bg-surface-secondary, #f6f8fb)' }}
          >
            <div className="text-center py-4">
              <div className="d-flex justify-content-center text-secondary mb-3">
                <Icon icon="wallet-off" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
              </div>
              <div className="fw-bold text-body mb-1">Belum Ada Akun</div>
              <div className="text-muted small mb-3">Tambahkan akun pertama Anda</div>
            </div>
          </div>
        ) : (
          accounts.map((acc, idx) => {
            const visualMeta = getAccountVisualMeta(acc.account_type, acc.color, acc.logo)
            return (
              <AccountCard
                key={idx}
                isActive={cur === idx}
                type={acc.account_type as any}
                name={acc.name}
                balance={formatCurrency(acc.balance || 0)}
                delta={0}
                chgPos={true}
                logo={visualMeta.logo}
                color={visualMeta.color}
                onClick={() => setCur(idx)}
              />
            )
          })
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

      <div className="d-block d-lg-none">
        <AccountVisualCard
          name={accData.name}
          num={accData.num}
          type={accData.type as any}
          balance={formatCurrency(accData.bal || 0)}
          logo={accData.logo}
          color={accData.color}
          onEdit={() => { setEditData(accData); setShowAddModal(true); }}
          onDelete={() => setShowDeleteModal(true)}
        />
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-3">
          <SummaryMetricCard
            title="Saldo Terkini"
            value={formatCurrency(accData.bal || 0)}
            subtext={accData.name}
            icon="wallet"
            valueColor="primary"
          />
        </div>
        <div className="col-12 col-md-3">
          <SummaryMetricCard
            title="Total Pemasukan"
            value={formatCurrency(analyticsData?.stats?.total_income || 0)}
            subtext="Bulan Ini"
            icon="trending-up"
            valueColor="success"
          />
        </div>
        <div className="col-12 col-md-3">
          <SummaryMetricCard
            title="Total Pengeluaran"
            value={formatCurrency(analyticsData?.stats?.total_expense || 0)}
            subtext="Bulan Ini"
            icon="trending-down"
            valueColor="danger"
          />
        </div>
        <div className="col-12 col-md-3">
          <SummaryMetricCard
            title="Net Mutasi"
            value={(analyticsData?.stats?.net_balance > 0 ? "+ " : analyticsData?.stats?.net_balance < 0 ? "- " : "") + formatCurrency(Math.abs(analyticsData?.stats?.net_balance || 0))}
            subtext="Bulan Ini"
            icon="arrows-exchange"
            valueColor={analyticsData?.stats?.net_balance > 0 ? "success" : "danger"}
          />
        </div>
      </div>

      <div className="d-flex flex-column flex-lg-row gap-3 align-items-stretch">
        <div className="d-flex flex-column gap-3" style={{ flex: 1 }}>
          <div className="d-none d-lg-block">
            <AccountVisualCard
              name={accData.name}
              num={accData.num}
              type={accData.type as any}
              balance={formatCurrency(accData.bal || 0)}
              logo={accData.logo}
              color={accData.color}
              onEdit={() => { setEditData(accData); setShowAddModal(true); }}
              onDelete={() => setShowDeleteModal(true)}
            />
          </div>
          <AccountStatsCard stats={analyticsData?.stats} />
          <div className="flex-grow-1 d-flex flex-column">
            <TopMerchantsCard merchants={analyticsData?.merchants} />
          </div>
        </div>

        <div className="d-flex flex-column gap-3" style={{ flex: 2 }}>
          <CashFlowChartCard 
            balance={accData.bal} 
            range={range} 
            setRange={handleSetRange} 
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            data={cfData} 
          />
          <div className="flex-grow-1 d-flex flex-column">
            <TransactionListCard transactions={accData.tx} />
          </div>
        </div>

        <div className="d-flex flex-column gap-3" style={{ flex: 1 }}>
          <SpendingCategoryCard categories={accData.cats as any} />
          <div className="flex-grow-1 d-flex flex-column">
            <RecentInsightsCard insights={analyticsData?.insights} />
          </div>
        </div>
      </div>
    </div>

      <AddAccountModal show={showAddModal} onClose={() => { setShowAddModal(false); setEditData(null); }} initialData={editData} />

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="sm">
        <ModalHeader onClose={() => setShowDeleteModal(false)}>
          <div className="d-flex align-items-center gap-2">
            <Icon icon="alert-triangle" className="text-danger" size="md" />
            Hapus Akun
          </div>
        </ModalHeader>
        <div className="modal-body text-center py-4">
          <p className="mb-0 fs-3">
            Hapus <strong>{accData.name}</strong>?
          </p>
          <div className="text-secondary small mt-2">
            Tindakan ini tidak dapat dibatalkan.
          </div>
        </div>
        <div className="modal-footer border-0 pt-0">
          <div className="row w-100 m-0">
            <div className="col">
              <button className="btn btn-ghost-secondary w-100" onClick={() => setShowDeleteModal(false)}>
                Batal
              </button>
            </div>
            <div className="col">
              <button 
                className="btn btn-danger w-100" 
                onClick={() => {
                  deleteAccount.mutate(accData.id, {
                    onSuccess: () => {
                      setShowDeleteModal(false)
                      setCur(0)
                    }
                  })
                }}
                disabled={deleteAccount.isPending}
              >
                {deleteAccount.isPending ? 'Loading...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </BaseLayout>
  )
}
