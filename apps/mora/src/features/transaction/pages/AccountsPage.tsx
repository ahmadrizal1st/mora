import React, { useState } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Button, CardTitle, Modal, ModalHeader, Spinner } from '@/shared/components/ui';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '../hooks/useAccounts';
import { AccountForm, type AccountFormValues } from '../components/AccountForm';
import { type Account } from '../types/transaction.types';

export const AccountsPage: React.FC = () => {
  const { data: accounts = [], isLoading } = useAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);

  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  const handleCreate = async (data: AccountFormValues) => {
    try {
      await createMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const handleUpdate = async (data: AccountFormValues) => {
    if (!editingAccount) return;
    try {
      await updateMutation.mutateAsync({ id: editingAccount.id, data });
      setIsModalOpen(false);
      setEditingAccount(undefined);
    } catch (error) {
      console.error('Failed to update account:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus akun ini? Akun hanya bisa dihapus jika belum memiliki transaksi.')) {
      try {
        await deleteMutation.mutateAsync(id);
    } catch (error: unknown) {
        const message = error && typeof error === 'object' && 'response' in error 
          ? (error as { response: { data: { message: string } } }).response?.data?.message 
          : 'Gagal menghapus akun.';
        alert(message);
      }
    }
  };

  const openEdit = (account: Account) => {
    setEditingAccount(account);
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
            <Button color="primary" onClick={() => { setEditingAccount(undefined); setIsModalOpen(true); }}>
            <Icon icon="plus" size={18} className="me-1" />
            Tambah Akun
          </Button>
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
                <div className="card shadow-sm border-0" style={{ borderLeft: `5px solid ${account.color}` }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <div className="text-secondary small text-uppercase fw-bold">{account.type}</div>
                        <h3 className="card-title h2 mb-0">{account.name}</h3>
                      </div>
                      <span className="bg-primary-lt avatar">
                        <Icon icon={account.type === 'bank' ? 'building-bank' : account.type === 'cash' ? 'wallet' : 'credit-card'} />
                      </span>
                    </div>
                    <div className="text-h2 fw-bold mb-3">
                      {formatCurrency(account.balance_raw, account.currency?.code)}
                    </div>
                    {account.is_credit && (
                      <div className="mb-3">
                        <div className="progress progress-xs">
                          <div className="progress-bar bg-info" style={{ width: '45%' }}></div>
                        </div>
                        <div className="d-flex justify-content-between small mt-1">
                          <span className="text-secondary">Limit: {formatCurrency(account.credit_limit, account.currency?.code)}</span>
                          <span className="text-info fw-bold">Sisa: {formatCurrency(account.credit_limit - account.balance_raw, account.currency?.code)}</span>
                        </div>
                      </div>
                    )}
                    <div className="d-flex gap-2">
                      <Button outline color="primary" size="sm" className="flex-fill" onClick={() => openEdit(account)}>
                        Edit
                      </Button>
                      <Button 
                        outline 
                        color="danger" 
                        size="sm" 
                        className="btn-icon" 
                        onClick={() => handleDelete(account.id)}
                        loading={deleteMutation.isPending && deleteMutation.variables === account.id}
                      >
                        <Icon icon="trash" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal show={isModalOpen}>
          <ModalHeader 
            title={editingAccount ? 'Edit Akun' : 'Tambah Akun Baru'} 
            onClose={() => { setIsModalOpen(false); setEditingAccount(undefined); }} 
          />
          <div className="modal-body">
            <AccountForm
              initialData={editingAccount}
              onSubmit={editingAccount ? handleUpdate : handleCreate}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </Modal>
      </div>
    </BaseLayout>
  );
};
