import React, { useState, useMemo } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Button, Modal, ModalHeader, Spinner } from '@/shared/components/ui';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '../hooks/useAccounts';
import { AccountForm, type AccountFormValues } from '../components/AccountForm';
import { type Account } from '../types/transaction.types';
import { AccountCard } from '../components/AccountCard';
import { AccountsSummaryChart } from '../components/AccountsSummaryChart';
import { getApiErrorMessage } from '@/shared/utils/errorUtils';

export const AccountsPage: React.FC = () => {
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const { data: response, isLoading } = useAccounts({ group_by: groupBy });

  // Stabilize accounts reference for other hooks
  const accounts: Account[] = useMemo(() => response?.data ?? [], [response?.data]);

  // Account filter state: null = all selected
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string> | null>(null);

  // Accounts that have balance history
  const accountsWithHistory = useMemo(
    () => accounts.filter((acc) => acc.history?.balance?.length),
    [accounts]
  );

  // Effective selected IDs
  const effectiveSelected = useMemo(() => {
    if (selectedAccountIds === null) return new Set(accountsWithHistory.map((a) => a.id));
    return selectedAccountIds;
  }, [selectedAccountIds, accountsWithHistory]);

  const toggleAccount = (id: string) => {
    const current = effectiveSelected;
    const next = new Set(current);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    if (next.size === accountsWithHistory.length) {
      setSelectedAccountIds(null);
    } else {
      setSelectedAccountIds(next);
    }
  };

  // Filtered chart series
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
  );

  const chartLabels = accounts[0]?.history?.labels || [];

  // Total wealth of selected accounts only
  const totalWealth = useMemo(
    () =>
      accounts
        .filter((acc: Account) => effectiveSelected.has(acc.id))
        .reduce((sum: number, acc: Account) => sum + (acc.balance ?? 0), 0),
    [accounts, effectiveSelected]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'form' | 'delete-confirm'>('form');
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);

  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  const handleCreate = async (data: AccountFormValues) => {
    try {
      await createMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Gagal membuat akun baru.'));
    }
  };

  const handleUpdate = async (data: AccountFormValues) => {
    if (!editingAccount) return;
    try {
      await updateMutation.mutateAsync({ id: editingAccount.id, data });
      setIsModalOpen(false);
      setEditingAccount(undefined);
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Gagal memperbarui akun.'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      setIsModalOpen(false);
      setEditingAccount(undefined);
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Gagal menghapus akun.'));
    }
  };

  const openEdit = (account: Account) => {
    setEditingAccount(account);
    setModalView('form');
    setIsModalOpen(true);
  };

  return (
    <BaseLayout
      pageTitle="Kelola Akun & Saldo"
      pageActions={
        <Button
          color="primary"
          onClick={() => {
            setEditingAccount(undefined);
            setIsModalOpen(true);
          }}
          className="px-4 fw-bold"
        >
          <Icon icon="plus" size={18} className="me-1" />
          Tambah Akun
        </Button>
      }
    >
      <div className="container-xl">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner /> Memuat daftar akun...
          </div>
        ) : (
          <div className="row g-4 mb-4">
            {accounts.length === 0 ? (
              <div className="col-12 text-center py-5 text-muted">
                Belum ada akun. Klik "Tambah Akun" untuk memulai.
              </div>
            ) : (
              accounts.map((account) => (
                <div key={account.id} className="col-sm-6 col-lg-4">
                  <AccountCard account={account} onEdit={(acc) => openEdit(acc)} />
                </div>
              ))
            )}
          </div>
        )}

        <AccountsSummaryChart
          accountsWithHistory={accountsWithHistory}
          effectiveSelected={effectiveSelected}
          toggleAccount={toggleAccount}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          totalWealth={totalWealth}
          chartSeries={chartSeries}
          chartLabels={chartLabels}
        />

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
              setIsModalOpen(false);
              setEditingAccount(undefined);
              setModalView('form');
            }}
          />
          <div className="modal-body">
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
                      <div className="small text-danger fw-bold mb-1">SISTEM MEMBLOKIR PENGHAPUSAN:</div>
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
  );
};
