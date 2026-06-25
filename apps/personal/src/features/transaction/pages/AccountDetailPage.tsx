import React, { useMemo } from 'react'
import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { Icon, Button, Spinner, Badge } from '@/shared/components/ui'
import { useAccount, useAccounts } from '../hooks/useAccounts'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { TransactionTable } from '../components/TransactionTable'
import { Chart } from '@/shared/components/ui/Chart'
import type { Transaction } from '../types/transaction.types'

export const AccountDetailPage: React.FC = () => {
  const { accountId } = useParams({ from: '/accounts/$accountId' })
  const search = useSearch({ from: '/accounts/$accountId' })
  const navigate = useNavigate()

  const { data: account, isLoading: isAccountLoading } = useAccount(accountId)
  const { data: accountsResponse } = useAccounts()
  const accounts = accountsResponse?.data ?? []

  const { data: transactionsResponse, isLoading: isTransactionsLoading } = useTransactions({
    account_id: accountId,
    search: search.search,
    sort_by: search.sort,
    page: search.page,
    per_page: search.per_page,
  })

  const handleAccountChange = (newId: string) => {
    navigate({ to: '/accounts/$accountId', params: { accountId: newId }, search: search })
  }

  const contrastColor = useMemo(() => {
    if (!account?.color) return '#ffffff'
    const r = parseInt(account.color.slice(1, 3), 16)
    const g = parseInt(account.color.slice(3, 5), 16)
    const b = parseInt(account.color.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 180 ? '#1d273b' : '#ffffff'
  }, [account?.color])

  const formatDate = (dateString: string, type: 'date' | 'time' = 'date') => {
    try {
      if (!dateString) return '-'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '-'
      if (type === 'time') {
        return new Intl.DateTimeFormat('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(date)
      }
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date)
    } catch {
      return '-'
    }
  }

  const chartData = useMemo(() => {
    if (!account?.history) return null
    return {
      type: 'area',
      series: [
        {
          name: 'Saldo',
          data: account.history.balance || [],
          color: account.color || '#206bc4',
        },
      ],
      categories: account.history.labels || [],
      height: 300,
      extend: {
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [0, 100],
          },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'dd MMM',
          },
        },
        tooltip: {
          x: { format: 'dd MMM yyyy' },
          y: { formatter: (val: number) => formatCurrency(val) },
        },
      },
    }
  }, [account])

  if (isAccountLoading) {
    return (
      <BaseLayout pageTitle="Memuat Akun...">
        <div className="container-xl py-5 text-center">
          <Spinner size="lg" />
          <p className="mt-3 text-muted">Mengambil data akun...</p>
        </div>
      </BaseLayout>
    )
  }

  if (!account) {
    return (
      <BaseLayout pageTitle="Akun Tidak Ditemukan">
        <div className="container-xl py-5 text-center">
          <Icon icon="alert-circle" size={48} className="text-danger mb-3" />
          <h2>Ups! Akun tidak ditemukan.</h2>
          <Button onClick={() => navigate({ to: '/accounts' })} className="mt-3">
            Kembali ke Daftar Akun
          </Button>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout
      pageTitle={account.name}
      pageActions={
        <div className="d-flex gap-2 align-items-center">
          <div className="dropdown">
            <button
              className="btn btn-ghost-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              <Icon icon="wallet" size={18} className="me-2" />
              Ganti Akun
            </button>
            <div
              className="dropdown-menu dropdown-menu-end shadow-lg border-0"
              style={{ borderRadius: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}
            >
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  className={`dropdown-item d-flex align-items-center ${acc.id === accountId ? 'active' : ''}`}
                  onClick={() => handleAccountChange(acc.id)}
                >
                  <span className="status-dot me-2" style={{ backgroundColor: acc.color }}></span>
                  {acc.name}
                </button>
              ))}
            </div>
          </div>
          <Button variant="outline-secondary" onClick={() => navigate({ to: '/accounts' })}>
            <Icon icon="arrow-left" size={18} className="me-1" /> Kembali
          </Button>
        </div>
      }
    >
      <div className="container-xl">
        <div
          className="card border-0 shadow-lg mb-4 overflow-hidden"
          style={{
            borderRadius: '1.5rem',
            background: `linear-gradient(135deg, ${account.color}, ${account.color}dd)`,
            color: contrastColor,
          }}
        >
          <div className="card-body p-4 p-md-5 position-relative">
            <div
              className="position-absolute top-0 end-0 mt-n4 me-n4 opacity-10"
              style={{ transform: 'rotate(-15deg)' }}
            >
              <Icon icon="building-bank" size={240} />
            </div>

            <div className="row align-items-center position-relative">
              <div className="col">
                <div className="d-flex align-items-center mb-2">
                  <Badge
                    className="me-2 text-uppercase fw-bold"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: contrastColor }}
                  >
                    {account.account_type.replace('-', ' ')}
                  </Badge>
                  {account.is_archived && (
                    <Badge color="dark" className="fw-bold">
                      TERARSIP
                    </Badge>
                  )}
                </div>
                <h1 className="display-5 fw-bold mb-1" style={{ letterSpacing: '-1px' }}>
                  {account.name}
                </h1>
                <p className="opacity-75 mb-0 fs-3">
                  {account.provider?.name || 'Tanpa Provider'} • {account.currency?.code || 'IDR'}
                </p>
              </div>
              <div className="col-auto text-end">
                <div className="opacity-75 mb-1 fw-medium">Saldo Saat Ini</div>
                <div className="h1 fw-bold mb-0" style={{ fontSize: '2.5rem' }}>
                  {formatCurrency(account.balance ?? 0, account.currency?.code)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
              <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h3 className="card-title fw-bold">Riwayat Saldo</h3>
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-outline-secondary">1M</button>
                  <button className="btn btn-outline-secondary active">3M</button>
                  <button className="btn btn-outline-secondary">1Y</button>
                </div>
              </div>
              <div className="card-body p-0">
                {chartData ? (
                  <Chart chartId="account-detail-balance" chartData={{ ...chartData, type: 'area' as const }} height={300} />
                ) : (
                  <div className="text-center py-5 text-muted">
                    <Icon icon="chart-area" size={48} className="opacity-20 mb-3" />
                    <p>Tidak ada data riwayat untuk ditampilkan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="row g-4 h-100">
              <div className="col-12 col-md-6 col-lg-12">
                <div
                  className="card border-0 shadow-sm h-50 mb-4"
                  style={{ borderRadius: '1.25rem' }}
                >
                  <div className="card-body d-flex flex-column justify-content-center p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div
                        className="d-flex align-items-center justify-content-center bg-green text-white"
                        style={{ borderRadius: '10px', width: '32px', height: '32px' }}
                      >
                        <Icon icon="trending-up" size="sm" className="text-white" />
                      </div>
                      <div
                        className="subheader text-muted m-0 fw-bold"
                        style={{ letterSpacing: '0.05em', fontSize: '10px' }}
                      >
                        PEMASUKAN BULAN INI
                      </div>
                    </div>
                    <div
                      className="h2 fw-bold mb-0 text-success"
                      style={{ letterSpacing: '-0.5px' }}
                    >
                      {formatCurrency(account.history?.income?.reduce((a, b) => a + b, 0) || 0)}
                    </div>
                  </div>
                </div>
                <div className="card border-0 shadow-sm h-50" style={{ borderRadius: '1.25rem' }}>
                  <div className="card-body d-flex flex-column justify-content-center p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div
                        className="d-flex align-items-center justify-content-center bg-red text-white"
                        style={{ borderRadius: '10px', width: '32px', height: '32px' }}
                      >
                        <Icon icon="trending-down" size="sm" className="text-white" />
                      </div>
                      <div
                        className="subheader text-muted m-0 fw-bold"
                        style={{ letterSpacing: '0.05em', fontSize: '10px' }}
                      >
                        PENGELUARAN BULAN INI
                      </div>
                    </div>
                    <div
                      className="h2 fw-bold mb-0 text-danger"
                      style={{ letterSpacing: '-0.5px' }}
                    >
                      {formatCurrency(account.history?.expense?.reduce((a, b) => a + b, 0) || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '1.25rem' }}>
          <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h3 className="card-title fw-bold">Daftar Transaksi</h3>
            <div className="input-icon">
              <span className="input-icon-addon">
                <Icon icon="search" size={16} />
              </span>
              <input
                type="text"
                className="form-control form-control-rounded"
                placeholder="Cari transaksi..."
                value={search.search || ''}
                onChange={(e) => navigate({ to: '/accounts/$accountId', params: { accountId }, search: (prev: any) => ({ ...prev, search: e.target.value }) })}
              />
            </div>
          </div>
          <div className="card-body p-0">
            <TransactionTable
              transactions={transactionsResponse?.data as Transaction[]}
              isLoading={isTransactionsLoading}
              onEdit={(tx) => navigate({ to: '/tracker/input', search: { id: tx.id } })}
              onDelete={() => {}}
              onSort={(col) => navigate({ to: '/accounts/$accountId', params: { accountId }, search: (prev: any) => ({ ...prev, sort: col }) })}
              getSortIcon={() => null}
              formatCurrency={formatCurrency}
              formatDate={(d, t) => formatDate(d, t)}
            />
          </div>
          {transactionsResponse && transactionsResponse.last_page > 1 && (
            <div className="card-footer bg-transparent border-0 pb-4 px-4 d-flex justify-content-center">
              <div className="btn-group">
                {Array.from({ length: transactionsResponse.last_page }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      className={`btn btn-sm ${search.page === p ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => navigate({ to: '/accounts/$accountId', params: { accountId }, search: (prev: any) => ({ ...prev, page: p }) })}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  )
}
