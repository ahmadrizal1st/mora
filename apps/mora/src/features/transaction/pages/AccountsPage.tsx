import React, { useState } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Button, CardTitle, Modal, ModalHeader, Spinner, Chart, DropdownGrouping } from '@/shared/components/ui';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '../hooks/useAccounts';
import { AccountForm, type AccountFormValues } from '../components/AccountForm';
import { type Account } from '../types/transaction.types';

export const AccountsPage: React.FC = () => {
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const { data: response, isLoading } = useAccounts({ group_by: groupBy });
  const accounts = response?.data || [];
  const summaryHistory = response?.summary_history || [];
  const labels = response?.labels || [];
  
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

  const formatCurrency = (amount: number, currencyCode = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <BaseLayout pageTitle="Kelola Akun & Saldo">
      <div className="container-xl">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle>Daftar Akun Keuangan</CardTitle>
          <div className="d-flex gap-2">
            <DropdownGrouping value={groupBy} onChange={setGroupBy} />
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
          <div className="row row-cards">
            {accounts.length === 0 ? (
              <div className="col-12 text-center py-5 text-muted">
                Belum ada akun. Klik "Tambah Akun" untuk memulai.
              </div>
            ) : accounts.map((account) => (
              <div key={account.id} className="col-md-4">
                <div 
                  className="card shadow-sm border-0 h-100 cursor-pointer" 
                  style={{ borderTop: `4px solid ${account.color}` }}
                  onClick={() => openEdit(account)}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span 
                          className="badge mb-1 fw-bold" 
                          style={{ backgroundColor: `${account.color}15`, color: account.color, fontSize: '10px' }}
                        >
                          {account.type.replace('-', ' ').toUpperCase()}
                        </span>
                        <h3 className="card-title h3 mb-0 fw-bold">{account.name}</h3>
                      </div>
                      <div 
                        className="avatar avatar-md rounded-3 border-0 bg-transparent"
                        style={{ color: account.color, backgroundColor: `${account.color}10` }}
                      >
                        <Icon icon={account.type === 'bank' ? 'building-bank' : account.type === 'cash' ? 'wallet' : account.type === 'e-wallet' ? 'device-mobile' : 'credit-card'} size={20} />
                      </div>
                    </div>

                    <div className="mt-2 mb-2">
                      <div className="text-secondary small fw-medium">Saldo Saat Ini</div>
                      <div className="h1 fw-bold mb-0" style={{ fontSize: '1.5rem', color: '#1d273b' }}>
                        {formatCurrency(account.balance_raw, account.currency?.code)}
                      </div>
                    </div>

                    {account.is_credit && (
                      <div className="mt-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-secondary">Limit: {formatCurrency(account.credit_limit, account.currency?.code)}</span>
                          <span className="text-muted fw-bold">{(account.balance_raw / account.credit_limit * 100).toFixed(0)}%</span>
                        </div>
                        <div className="progress progress-xs">
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${Math.min(100, (account.balance_raw / account.credit_limit * 100))}%`,
                              backgroundColor: account.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div style={{ height: '40px', margin: '0 -1.25rem -1.25rem -1.25rem' }} className="mt-auto overflow-hidden rounded-bottom">
                      <Chart
                        chartId={`account-sparkline-${account.id}`}
                        chartData={{
                          type: 'area',
                          sparkline: true,
                          series: [{
                            name: 'Saldo',
                            data: account.balance_history || [0, 0, 0],
                            color: account.color
                          }],
                          strokeWidth: [1.5],
                        }}
                        height={2.5}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {summaryHistory.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h3 className="card-title h2 mb-1 fw-bold">Tren Kekayaan Bersih</h3>
                      <div className="text-secondary small">Total saldo seluruh akun Anda dari waktu ke waktu</div>
                    </div>
                    <div className="text-end">
                      <div className="text-secondary small fw-medium">Total Saat Ini</div>
                      <div className="h2 fw-bold mb-0 text-primary">
                        {formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance_raw, 0))}
                      </div>
                    </div>
                  </div>
                  <div style={{ minHeight: '240px' }}>
                    <Chart
                      chartId="total-wealth-trend"
                      chartData={{
                        type: 'area',
                        series: [{
                          name: 'Total Kekayaan',
                          data: summaryHistory,
                          color: '#206bc4'
                        }],
                        categories: labels,
                        strokeWidth: [2.5],
                        animations: true,
                        datalabels: false,
                        grid: {
                          strokeDashArray: 4,
                          padding: { top: 0, right: 0, bottom: 0, left: 10 }
                        },
                        xaxis: {
                          tooltip: { enabled: false },
                          axisBorder: { show: false },
                        }
                      }}
                      height={15}
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
