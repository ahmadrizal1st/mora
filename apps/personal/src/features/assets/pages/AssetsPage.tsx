import React, { useMemo } from 'react'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { VisualStatCard } from '@/shared/components/cards/VisualStatCard'
import { NetWorthGrowthCard } from '@/shared/components/cards/NetWorthGrowthCard'
import { VisualTransactionsCard } from '@/shared/components/cards/VisualTransactionsCard'
import { AssetAllocationCard } from '@/shared/components/cards/AssetAllocationCard'
import { PortfolioTargetsCard } from '@/shared/components/cards/PortfolioTargetsCard'
import { FinanceScoreCard } from '@/shared/components/cards/FinanceScoreCard'
import { CardBalanceCard } from '@/shared/components/cards/CardBalanceCard'
import { RecentActivitiesCard } from '@/shared/components/cards/RecentActivitiesCard'
import { useAssets } from '@/features/assets/hooks/useAssets'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { Icon } from '@/shared/components/ui/Icon'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Button } from '@/shared/components/ui/Button'

export default function AssetsPage() {
  const { data: assets, isLoading } = useAssets()

  const stats = useMemo(() => {
    if (!assets) return { total: 0, growth: '+0%', monthly: 0 }
    const total = assets.reduce((sum, a) => sum + Number(a.value), 0)
    return {
      total,
      growth: '+0%',
      monthly: 0,
    }
  }, [assets])

  return (
    <BaseLayout pageTitle="Asset">
      <div className="row row-cards g-3">
        <div className="col-lg-9">
          <div className="row row-cards g-3">
            <div className="col-md-4">
              <VisualStatCard
                title="Total Aset"
                value={formatCurrency(stats.total)}
                trendPercentage={stats.growth}
                trendAbsolute=""
                icon="building-bank"
                isPositive={true}
              />
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Daftar Aset</h3>
                </div>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter text-nowrap">
                    <thead>
                      <tr>
                        <th>Nama Aset</th>
                        <th>Kategori</th>
                        <th>Nilai (Rp)</th>
                        <th>Tanggal Pembelian</th>
                        <th className="w-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets?.map((asset) => (
                        <tr key={asset.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-sm me-2 bg-primary-lt">
                                <Icon icon="building-bank" />
                              </span>
                              <div className="fw-medium">{asset.name}</div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-blue-lt">{asset.category || '-'}</span>
                          </td>
                          <td>{formatCurrency(Number(asset.value))}</td>
                          <td className="text-secondary">{asset.purchase_date || '-'}</td>
                          <td>
                            <div className="dropdown">
                              <Button className="dropdown-toggle align-text-top" data-bs-toggle="dropdown">
                                Actions
                              </Button>
                              <div className="dropdown-menu dropdown-menu-end">
                                <a className="dropdown-item" href="#">Edit</a>
                                <a className="dropdown-item text-danger" href="#">Delete</a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!assets?.length && !isLoading && (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-secondary">
                            Belum ada aset terdaftar
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-12">
              <NetWorthGrowthCard currentNetWorth={stats.total} />
            </div>
            <div className="col-12">
              <VisualTransactionsCard />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="row row-cards g-3">
            <div className="col-12">
              <AssetAllocationCard data={stats} />
            </div>
            <div className="col-12">
              <PortfolioTargetsCard data={stats} />
            </div>
            <div className="col-12">
              <FinanceScoreCard />
            </div>
            <div className="col-12">
              <CardBalanceCard />
            </div>
            <div className="col-12">
              <RecentActivitiesCard />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
