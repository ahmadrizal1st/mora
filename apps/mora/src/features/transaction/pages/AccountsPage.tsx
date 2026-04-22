import React, { useState, useMemo } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Button, Modal, ModalHeader, Spinner, Chart, DropdownGrouping } from '@/shared/components/ui';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '../hooks/useAccounts';
import { AccountForm, type AccountFormValues } from '../components/AccountForm';
import { type Account } from '../types/transaction.types';
import { AccountCard } from '../components/AccountCard';
import { formatCurrency } from '@/shared/utils/currencyUtils';

export const AccountsPage: React.FC = () => {
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const { data: response, isLoading } = useAccounts({ group_by: groupBy });
  const accounts = response?.data || [];

  // Account filter state: null = all selected
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<number> | null>(null);

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

  const toggleAccount = (id: number) => {
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
        .filter((acc) => effectiveSelected.has(acc.id))
        .reduce((sum, acc) => sum + (acc.balance_raw ?? 0), 0),
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
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response: { data: { message: string } } }).response?.data?.message
          : 'Gagal membuat akun baru.';
      alert(message);
    }
  };

  const handleUpdate = async (data: AccountFormValues) => {
    if (!editingAccount) return;
    try {
      await updateMutation.mutateAsync({ id: editingAccount.id, data });
      setIsModalOpen(false);
      setEditingAccount(undefined);
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response: { data: { message: string } } }).response?.data?.message
          : 'Gagal memperbarui akun.';
      alert(message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setIsModalOpen(false);
      setEditingAccount(undefined);
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response: { data: { message: string } } }).response?.data?.message
          : 'Gagal menghapus akun.';
      alert(message);
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

        {accountsWithHistory.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 className="card-title h2 mb-1 fw-bold">Tren Kekayaan Bersih</h3>
                      <div className="text-secondary small">Perbandingan saldo antar akun Anda</div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <DropdownGrouping value={groupBy} onChange={setGroupBy} />
                      <div className="text-end d-none d-sm-block">
                        <div className="text-secondary small fw-medium">Total Kekayaan</div>
                        <div className="h2 fw-bold mb-0 text-primary">
                          {formatCurrency(totalWealth)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account filter toggles */}
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {accountsWithHistory.map((acc) => {
                      const isActive = effectiveSelected.has(acc.id);
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => toggleAccount(acc.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            borderRadius: '999px',
                            border: `1.5px solid ${acc.color}`,
                            backgroundColor: isActive ? `${acc.color}18` : 'transparent',
                            color: isActive ? acc.color : '#aaa',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            opacity: isActive ? 1 : 0.5,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: isActive ? acc.color : '#aaa',
                              flexShrink: 0,
                            }}
                          />
                          {acc.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Chart */}
                  <div style={{ minHeight: '300px' }}>
                    {chartSeries.length === 0 ? (
                      <div className="text-center text-muted py-5">
                        Pilih minimal satu akun untuk ditampilkan.
                      </div>
                    ) : (
                      <Chart
                        chartId="total-wealth-trend"
                        chartData={{
                          type: 'line',
                          stacked: false,
                          series: chartSeries,
                          categories: chartLabels,
                          strokeWidth: Array(chartSeries.length).fill(3.5),
                          strokeCurve: 'smooth',
                          animations: true,
                          datalabels: false,
                          legend: false,
                          grid: {
                            strokeDashArray: 4,
                            padding: { top: 20, right: 20, bottom: 0, left: 10 },
                          },
                          xaxis: {
                            tooltip: { enabled: false },
                            axisBorder: { show: false },
                            tickAmount: 8,
                            labels: {
                              formatter: (val: string) => {
                                if (!val) return '';
                                if (val.includes('-W')) return val.split('-')[1];
                                if (/^\d{4}$/.test(val)) return val;
                                if (/^\d{4}-\d{2}$/.test(val)) {
                                  const [y, m] = val.split('-');
                                  const date = new Date(Number(y), Number(m) - 1, 1);
                                  return date.toLocaleDateString('id-ID', { month: 'short' });
                                }
                                const date = new Date(val);
                                if (isNaN(date.getTime())) return val;
                                return date.toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                });
                              },
                            },
                          },
                          yaxis: {
                            labels: {
                              formatter: (val: number) => {
                                const absVal = Math.abs(val);
                                const sign = val < 0 ? '-' : '';
                                if (absVal >= 1000000) return sign + (absVal / 1000000).toFixed(1) + 'jt';
                                if (absVal >= 1000) return sign + (absVal / 1000).toFixed(0) + 'rb';
                                return val.toString();
                              },
                            },
                          },
                          extend: {
                            tooltip: {
                              container: 'body',
                              shared: true,
                              intersect: false,
                              theme: 'dark',
                              x: {
                                show: true,
                                formatter: (_val: any, { dataPointIndex }: any) => {
                                  const label = chartLabels[dataPointIndex];
                                  if (!label) return _val;
                                  if (/^\d{4}$/.test(String(label))) return label;
                                  // Handle week format o-WW
                                  if (String(label).includes('-W')) return label; 
                                  const date = new Date(label);
                                  if (isNaN(date.getTime())) return label;
                                  return date.toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                  });
                                }
                              },
                              y: {
                                formatter: (val: number) => formatCurrency(val),
                              },
                            },
                          },
                        }}
                        height={24}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
