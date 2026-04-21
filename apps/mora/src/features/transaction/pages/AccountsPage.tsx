import React, { useState } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Button, CardTitle, Modal, ModalHeader, Spinner, Chart, DropdownGrouping } from '@/shared/components/ui';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '../hooks/useAccounts';
import { AccountForm, type AccountFormValues } from '../components/AccountForm';
import { type Account } from '../types/transaction.types';
import { AccountCard } from '../components/AccountCard';
import { formatCurrency } from '@/shared/utils/currencyUtils';

export const AccountsPage: React.FC = () => {
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const { data: response, isLoading } = useAccounts({ group_by: groupBy });
  const accounts = response?.data || [];

  // Build chart series from each account's embedded history
  const chartSeries = accounts
    .filter((acc) => acc.history?.balance?.length)
    .map((acc) => ({
      name: acc.name,
      color: acc.color,
      data: acc.history!.balance,
    }));
  const chartLabels = accounts[0]?.history?.labels || [];
  
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
      const message = error && typeof error === 'object' && 'response' in error 
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
      const message = error && typeof error === 'object' && 'response' in error 
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
      const message = error && typeof error === 'object' && 'response' in error 
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
    <BaseLayout pageTitle="Kelola Akun & Saldo">
      <div className="container-xl">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle>Daftar Akun Keuangan</CardTitle>
          <div className="d-flex gap-2">
            <Button color="primary" onClick={() => { setEditingAccount(undefined); setIsModalOpen(true); }}>
              <Icon icon="plus" size={18} className="me-1" />
              Tambah Akun
            </Button>
          </div>
        </div>

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
            ) : accounts.map((account) => (
              <div key={account.id} className="col-sm-6 col-lg-4">
                <AccountCard 
                  account={account} 
                  onEdit={(acc) => openEdit(acc)} 
                />
              </div>
            ))}
          </div>
        )}

        {chartSeries.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h3 className="card-title h2 mb-1 fw-bold">Tren Kekayaan Bersih</h3>
                      <div className="text-secondary small">Perbandingan saldo antar akun Anda</div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <DropdownGrouping value={groupBy} onChange={setGroupBy} />
                      <div className="text-end d-none d-sm-block">
                        <div className="text-secondary small fw-medium">Total Kekayaan</div>
                        <div className="h2 fw-bold mb-0 text-primary">
                          {formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance_raw, 0))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ minHeight: '300px' }}>
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
                        legend: true,
                        legendOptions: {
                          position: 'bottom',
                          markers: {
                            radius: 12,
                          }
                        },
                        grid: {
                          strokeDashArray: 4,
                          padding: { top: 20, right: 20, bottom: 0, left: 10 }
                        },
                        xaxis: {
                          tooltip: { enabled: false },
                          axisBorder: { show: false },
                          tickAmount: 8,
                          labels: {
                            formatter: (val: string) => {
                                if (!val) return '';
                                // Week format: "2026-W17"
                                if (val.includes('-W')) return val.split('-')[1];
                                // Month format: "2026-04"
                                if (/^\d{4}-\d{2}$/.test(val)) {
                                  const [y, m] = val.split('-');
                                  const date = new Date(Number(y), Number(m) - 1, 1);
                                  return date.toLocaleDateString('id-ID', { month: 'short' });
                                }
                                // Day format: "2026-04-22"
                                const date = new Date(val);
                                if (isNaN(date.getTime())) return val;
                                return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                            }
                          }
                        },
                        yaxis: {
                          labels: {
                            formatter: (val: number) => {
                              const absVal = Math.abs(val);
                              const sign = val < 0 ? '-' : '';
                              if (absVal >= 1000000) return sign + (absVal / 1000000).toFixed(1) + 'jt';
                              if (absVal >= 1000) return sign + (absVal / 1000).toFixed(0) + 'rb';
                              return val.toString();
                            }
                          }
                        },
                        extend: JSON.stringify({
                          tooltip: {
                            container: 'body',
                            shared: true,
                            intersect: false,
                            y: {
                                formatter: (val: number) => formatCurrency(val)
                            }
                          }
                        })
                      }}
                      height={24}
                    />
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
                : (editingAccount ? 'Edit Akun' : 'Tambah Akun Baru')
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
                  Akun ini memiliki <strong>{(editingAccount?.transactions_count || 0) + (editingAccount?.incoming_transfers_count || 0)}</strong> transaksi yang bergantung padanya.
                </div>
                
                {(editingAccount?.transactions_count || 0) + (editingAccount?.incoming_transfers_count || 0) > 0 && (
                  <div className="bg-danger-lt p-3 rounded text-start border border-danger-subtle mb-3">
                    <div className="small text-danger fw-bold mb-1">SISTEM MEMBLOKIR PENGHAPUSAN:</div>
                    <div className="small">Anda tidak dapat menghapus akun yang masih memiliki data transaksi. Silakan hapus atau pindahkan transaksi terkait terlebih dahulu.</div>
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
                    disabled={(editingAccount?.transactions_count || 0) + (editingAccount?.incoming_transfers_count || 0) > 0}
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
