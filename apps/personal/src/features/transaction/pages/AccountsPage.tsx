import React, { useState, useMemo } from 'react'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { Icon, Button, Modal, ModalHeader, Spinner } from '@/shared/components/ui'
import { ErrorAlert } from '@/shared/components/ui/ErrorAlert'
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from '../hooks/useAccounts'
import { AccountForm, type AccountFormValues } from '../components/AccountForm'
import { type Account } from '../types/transaction.types'
import { AccountCard } from '../components/AccountCard'
import { AccountsSummaryChart } from '../components/AccountsSummaryChart'
import { getApiErrorMessage } from '@/shared/utils/errorUtils'

export const AccountsPage: React.FC = () => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { data: response, isLoading } = useAccounts({
    group_by: groupBy,
    filter: { is_archived: showArchived ? '1' : '0' },
  })

  const groupedAccounts = useMemo(() => {
    const groups: Record<string, Account[]> = {}
    const accs = response?.data ?? []
    accs.forEach((acc) => {
      const type = acc.account_type || 'other'
      if (!groups[type]) groups[type] = []
      groups[type].push(acc)
    })
    return groups
  }, [response?.data])

  const typeLabels: Record<string, string> = {
    bank: 'Rekening Bank',
    'e-wallet': 'E-Wallet & Digital',
    cash: 'Tunai / Dompet',
    investment: 'Investasi',
    credit: 'Kartu Kredit',
    saving: 'Tabungan',
    loan: 'Pinjaman',
    other: 'Lainnya',
  }

  const accounts: Account[] = useMemo(() => response?.data ?? [], [response?.data])

  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string> | null>(null)

  const accountsWithHistory = useMemo(
    () => accounts.filter((acc) => acc.history?.balance?.length),
    [accounts]
  )

  const effectiveSelected = useMemo(() => {
    if (selectedAccountIds === null) return new Set(accountsWithHistory.map((a) => a.id))
    return selectedAccountIds
  }, [selectedAccountIds, accountsWithHistory])

  const toggleAccount = (id: string) => {
    const current = effectiveSelected
    const next = new Set(current)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    if (next.size === accountsWithHistory.length) {
      setSelectedAccountIds(null)
    } else {
      setSelectedAccountIds(next)
    }
  }

  const chartSeries = useMemo(
    () =>
      accountsWithHistory
        .filter((acc) => effectiveSelected.has(acc.id))
        .map((acc) => ({
          name: acc.name,
          color: acc.color,
          data: acc.history!.balance,
        })),
    [accountsWithHistory, effectiveSelected]
  )

  const chartLabels = accounts[0]?.history?.labels || []

  const totalWealth = useMemo(
    () =>
      accounts
        .filter((acc: Account) => effectiveSelected.has(acc.id))
        .reduce((sum: number, acc: Account) => sum + (acc.balance ?? 0), 0),
    [accounts, effectiveSelected]
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalView, setModalView] = useState<'form' | 'delete-confirm'>('form')
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined)

  const createMutation = useCreateAccount()
  const updateMutation = useUpdateAccount()
  const deleteMutation = useDeleteAccount()

  const handleCreate = async (data: AccountFormValues) => {
    setErrorMsg(null)
    try {
      await createMutation.mutateAsync({ ...data, is_archived: data.is_archived ?? false })
      setIsModalOpen(false)
    } catch (error: unknown) {
      setErrorMsg(getApiErrorMessage(error, 'Gagal membuat akun baru.'))
    }
  }

  const handleUpdate = async (data: AccountFormValues) => {
    if (!editingAccount) return
    setErrorMsg(null)
    try {
      await updateMutation.mutateAsync({ id: editingAccount.id, data })
      setIsModalOpen(false)
      setEditingAccount(undefined)
    } catch (error: unknown) {
      setErrorMsg(getApiErrorMessage(error, 'Gagal memperbarui akun.'))
    }
  }

  const handleDelete = async (id: string) => {
    setErrorMsg(null)
    try {
      await deleteMutation.mutateAsync(id)
      setIsModalOpen(false)
      setEditingAccount(undefined)
    } catch (error: unknown) {
      setErrorMsg(getApiErrorMessage(error, 'Gagal menghapus akun.'))
    }
  }

  const openEdit = (account: Account) => {
    setEditingAccount(account)
    setModalView('form')
    setIsModalOpen(true)
  }

  return (
    <BaseLayout
      pageTitle={showArchived ? 'Arsip Akun' : 'Kelola Akun & Saldo'}
      pageActions={
        <div className="d-flex gap-2">
          <Button
            color={showArchived ? 'warning' : 'ghost-secondary'}
            onClick={() => setShowArchived(!showArchived)}
            className="px-3"
            title={showArchived ? 'Lihat Akun Aktif' : 'Lihat Arsip'}
          >
            <Icon icon={showArchived ? 'archive-off' : 'archive'} size={18} />
          </Button>
          <Button
            color="ghost-secondary"
            onClick={() => setIsBalanceHidden(!isBalanceHidden)}
            className="px-3"
            title={isBalanceHidden ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
          >
            <Icon icon={isBalanceHidden ? 'eye-off' : 'eye'} size={18} />
          </Button>
          {!showArchived && (
            <Button
              color="primary"
              onClick={() => {
                setEditingAccount(undefined)
                setIsModalOpen(true)
              }}
              className="px-4 fw-bold"
            >
              <Icon icon="plus" size={18} className="me-1" />
              Tambah Akun
            </Button>
          )}
        </div>
      }
    >
      <div className="container-xl">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner /> Memuat daftar akun...
          </div>
        ) : (
          <div className="mb-5">
            {accounts.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <Icon icon="wallet" size={48} className="mb-3 opacity-20" />
                <p>Belum ada akun. Klik "Tambah Akun" untuk memulai.</p>
              </div>
            ) : (
              Object.entries(groupedAccounts).map(([type, typeAccounts]) => (
                <div key={type} className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <h2 className="h4 mb-0 fw-bold">{typeLabels[type] || type}</h2>
                    <div className="ms-2 badge bg-blue-lt">{typeAccounts.length}</div>
                    <hr className="flex-fill ms-3 opacity-10" />
                  </div>
                  <div className="row g-4">
                    {typeAccounts.map((account) => (
                      <div key={account.id} className="col-sm-6 col-lg-4">
                        <AccountCard
                          account={account}
                          onEdit={(acc) => openEdit(acc)}
                          isBalanceHidden={isBalanceHidden}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div
          className="card shadow-sm border-0 mb-4 overflow-hidden"
          style={{ borderRadius: '1rem' }}
        >
          <div className="card-body p-0">
            <AccountsSummaryChart
              accountsWithHistory={accountsWithHistory}
              effectiveSelected={effectiveSelected}
              toggleAccount={toggleAccount}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
              totalWealth={totalWealth}
              chartSeries={chartSeries}
              chartLabels={chartLabels}
              isBalanceHidden={isBalanceHidden}
            />
          </div>
        </div>

        <Modal show={isModalOpen} size={modalView === 'delete-confirm' ? 'sm' : undefined}>
          <ModalHeader
            title={
              modalView === 'delete-confirm'
                ? 'Konfirmasi Penghapusan'
                : editingAccount
                  ? 'Edit Akun'
                  : 'Tambah Akun Baru'
            }
            onClose={() => {
              setIsModalOpen(false)
              setEditingAccount(undefined)
              setModalView('form')
            }}
          />
          <div className="modal-body">
            {errorMsg && (
              <div className="mb-3">
                <ErrorAlert message={errorMsg} />
              </div>
            )}
            {modalView === 'form' ? (
              <AccountForm
                initialData={editingAccount}
                onSubmit={editingAccount ? handleUpdate : handleCreate}
                onDelete={() => setModalView('delete-confirm')}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            ) : (
              <div className="text-center py-2">
                <Icon icon="alert-triangle" size={48} className="text-danger mb-3" />
                <h3 className="mb-2">Hapus Akun "{editingAccount?.name}"?</h3>
                <div className="text-secondary mb-3">
                  Akun ini memiliki{' '}
                  <strong>
                    {(editingAccount?.transactions_count || 0) +
                      (editingAccount?.incoming_transfers_count || 0)}
                  </strong>{' '}
                  transaksi yang bergantung padanya.
                </div>

                {(editingAccount?.transactions_count || 0) +
                  (editingAccount?.incoming_transfers_count || 0) >
                  0 && (
                  <div className="bg-danger-lt p-3 rounded text-start border border-danger-subtle mb-3">
                    <div className="small text-danger fw-bold mb-1">
                      SISTEM MEMBLOKIR PENGHAPUSAN:
                    </div>
                    <div className="small">
                      Anda tidak dapat menghapus akun yang masih memiliki data transaksi. Silakan
                      hapus atau pindahkan transaksi terkait terlebih dahulu.
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <Button className="flex-fill" onClick={() => setModalView('form')}>
                    Kembali
                  </Button>
                  <Button
                    color="danger"
                    className="flex-fill fw-bold"
                    onClick={() => editingAccount && handleDelete(editingAccount.id)}
                    disabled={
                      (editingAccount?.transactions_count || 0) +
                        (editingAccount?.incoming_transfers_count || 0) >
                      0
                    }
                    loading={deleteMutation.isPending}
                  >
                    Ya, Hapus
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </BaseLayout>
  )
}
