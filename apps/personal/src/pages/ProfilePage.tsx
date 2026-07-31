import BaseLayout from '@/shared/layouts/BaseLayout'
import { Avatar, Button, Icon, Timeline, TimelineItem } from '@/shared/components/ui'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAccountSummary, useAccounts } from '@/features/transaction/hooks/useAccounts'
import { useGoals } from '@/features/planning/hooks/usePlanning'
import { useGamificationStats } from '@/features/gamification/hooks/useGamification'
import { useTransactions } from '@/features/transaction/hooks/useTransactions'
import type { Transaction, AccountResponse } from '@/features/transaction/types/transaction.types'

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: accountSummary } = useAccountSummary()
  const { data: accounts } = useAccounts()
  const { data: goals } = useGoals()
  const { data: gamificationStats } = useGamificationStats()
  const { data: transactionsData } = useTransactions({ per_page: 5, sort_by: 'tx_date', sort_dir: 'desc' })

  const person = {
    full_name: user?.name || 'User',
    email: user?.email || '',
    photo: user?.avatar || undefined,
  }

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return 'Rp 0'
    return `Rp ${val.toLocaleString('id-ID')}`
  }

  const totalBalance = accountSummary?.total_balance ?? 0
  const totalAccounts = Array.isArray(accounts) ? accounts.length : (accounts as AccountResponse | undefined)?.data?.length ?? 0
  const activeGoalsCount = goals?.goals?.length ?? 0
  const streakDays = gamificationStats?.current_streak ?? 0

  const recentTransactions = transactionsData?.data || []

  return (
    <BaseLayout flush noContainer bodyClass="p-0">
      <div className="page-header pt-0 m-0 border-0">
        <div className="d-flex justify-content-between align-items-center d-md-none mt-0 mb-3 px-3 pt-3">
          <Button icon="plus" iconOnly ghost size="md" className="p-0 text-secondary" />
          <Button icon="menu-2" iconOnly ghost size="md" className="p-0 text-secondary" />
        </div>
        <div className="container-xl">
          <div className="row g-3 align-items-center flex-column flex-md-row text-center text-md-start">
            <div className="col-auto">
              <Avatar person={person} size="xl" shape="rounded" />
            </div>
            <div className="col">
              <h1 className="fw-bold m-0">{person.full_name}</h1>
              <div className="my-2 text-secondary">
                Membentuk masa depan finansial yang sehat melalui alokasi aset cerdas dan anggaran disiplin.
              </div>
              <div className="list-inline list-inline-dots text-secondary justify-content-center justify-content-md-start">
                <div className="list-inline-item">
                  <Icon icon="shield-check" className="text-success" /> Akun Terverifikasi
                </div>
                <div className="list-inline-item">
                  <Icon icon="mail" />{' '}
                  <a href={`mailto:${person.email}`} className="text-reset">
                    {person.email}
                  </a>
                </div>
                <div className="list-inline-item d-none d-sm-inline-block">
                  <Icon icon="flame" className="text-danger" /> {streakDays} Hari Beruntun
                </div>
              </div>
            </div>
            <div className="col-auto ms-md-auto w-100 w-md-auto">
              <div className="btn-list justify-content-center justify-content-md-start">
                <Button
                  to="/settings"
                  icon="edit"
                  color="primary"
                  text="Edit Profil"
                  className="flex-fill flex-md-grow-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row g-3">
            <div className="col-lg-8">
              <h3 className="mb-3">Aktivitas & Transaksi Terakhir</h3>
              <Timeline>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx: Transaction) => (
                    <TimelineItem
                      key={tx.id}
                      time={new Date(tx.tx_date || tx.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      title={tx.merchant || tx.notes || tx.category?.name || 'Transaksi'}
                      description={`${tx.type === 'expense' ? '-' : '+'}${formatCurrency(Number(tx.amount))} • ${tx.account?.name || 'Rekening'}`}
                      icon={tx.type === 'expense' ? 'arrow-up-right' : 'arrow-down-left'}
                      iconBg={tx.type === 'expense' ? 'danger' : 'success'}
                    />
                  ))
                ) : (
                  <TimelineItem
                    time="Hari ini"
                    title="Belum Ada Transaksi"
                    description="Catat transaksi pertama Anda di menu Tracker atau Cashflow."
                    icon="info-circle"
                    iconBg="secondary"
                  />
                )}
              </Timeline>
            </div>

            <div className="col-lg-4">
              <div className="row row-cards">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="card-title">Informasi Keuangan Real-time</div>

                      <div className="mb-2">
                        <Icon icon="building-bank" className="me-2 text-secondary" />
                        Rekening Terhubung: <strong>{totalAccounts} Akun</strong>
                      </div>
                      <div className="mb-2">
                        <Icon icon="wallet" className="me-2 text-secondary" />
                        Total Saldo: <strong>{formatCurrency(totalBalance)}</strong>
                      </div>
                      <div className="mb-2">
                        <Icon icon="coin" className="me-2 text-secondary" />
                        Mata Uang Utama: <strong>IDR (Rupiah)</strong>
                      </div>
                      <div className="mb-2">
                        <Icon icon="flame" className="me-2 text-danger" />
                        Streak Aktif: <strong>{streakDays} Hari</strong>
                      </div>
                      <div>
                        <Icon icon="target" className="me-2 text-secondary" />
                        Goal Finansial Aktif: <strong>{activeGoalsCount} Target</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h2 className="card-title">Ikhtisar Keuangan</h2>
                      <div>
                        <p
                          className="text-secondary"
                          style={{ fontSize: '13px', lineHeight: '1.6' }}
                        >
                          Profil keuangan Anda dianalisis secara otomatis berdasarkan aktivitas
                          transaksi, perencanaan anggaran bulanan, dan kedisiplinan pencatatan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
