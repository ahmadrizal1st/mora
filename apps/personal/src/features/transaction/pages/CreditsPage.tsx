import { useState } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Icon, Spinner, Modal, Select, Datepicker, AutosizeTextarea, Pagination } from '@/shared/components/ui';
import { useAccounts } from '../hooks/useAccounts';
import axios from '@/shared/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard } from '../components/CreditCard';
import type { Account } from '../types/transaction.types';

export default function CreditsPage() {
  const queryClient = useQueryClient();
  const { data: accountsResponse, isLoading: accountsLoading } = useAccounts();
  const accounts = accountsResponse?.data || [];

  // Fetch only accounts that already have credits
  const [page, setPage] = useState(1);
  const { data: creditsResponse, isLoading: creditsLoading } = useQuery({
    queryKey: ['credits', page],
    queryFn: async () => {
      const res = await axios.get('/credits', { params: { page } });
      return res.data;
    }
  });
  const creditAccounts = creditsResponse?.data || [];

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    limit: 0,
    total_amount: 0,
    installment_amount: 0,
    installment_type: 'monthly',
    due_date: '',
    notes: ''
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        due_date: data.due_date || null,
        notes: data.notes || null,
      };
      const res = await axios.post(`/accounts/${selectedAccount.id}/credit`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      setIsModalOpen(false);
      setSelectedAccount(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/accounts/${id}/credit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    }
  });

  const openForm = (account: Account) => {
    setSelectedAccount(account);
    if (account.credit) {
      setFormData({
        limit: account.credit.limit,
        total_amount: account.credit.total_amount,
        installment_amount: account.credit.installment_amount,
        installment_type: account.credit.installment_type,
        due_date: account.credit.due_date ? account.credit.due_date.split('T')[0] : '',
        notes: account.credit.notes || ''
      });
    } else {
      setFormData({
        limit: 0,
        total_amount: 0,
        installment_amount: 0,
        installment_type: 'monthly',
        due_date: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const accountOptions = accounts.map((acc: Account) => ({
    value: acc.id,
    label: acc.name,
    color: acc.color
  }));

  const isLoading = accountsLoading || creditsLoading;

  return (
    <BaseLayout 
      pageTitle="Manajemen Kredit & Pinjaman"
      pageActions={
        <div style={{ width: '220px' }}>
          <Select
            options={accountOptions}
            placeholder={
              <>
                <Icon icon="plus" size={18} className="me-1" />
                Tambah Profil Kredit
              </>
            }
            showSearch={true}
            triggerClassName="btn btn-primary w-100 fw-bold border-0 shadow-sm text-white"
            onChange={(val) => {
              const acc = accounts.find(a => a.id === Number(val));
              if (acc) openForm(acc);
            }}
          />
        </div>
      }
    >
      <div className="container-xl pt-3">
        {/* Cards Grid */}
        <div className="row g-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="col-sm-6 col-lg-4">
                      <div className="card shadow-sm border-0" style={{ height: '220px' }}>
                        <div className="card-body p-4 d-flex align-items-center justify-content-center">
                          <Spinner />
                        </div>
                      </div>
                    </div>
                  ))
                ) : creditAccounts.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <div className="card border-0 shadow-sm py-5">
                      <div className="card-body">
                        <Icon icon="credit-card" size={48} className="mb-3 opacity-20" />
                        <div className="text-muted">Belum ada profil kredit yang ditambahkan.</div>
                        <div className="mt-3 text-secondary small">Klik tombol "Tambah Profil Kredit" di pojok kanan atas untuk memulai.</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  creditAccounts.map((acc: Account) => (
                    <div key={acc.id} className="col-sm-6 col-lg-4">
                      <CreditCard 
                        account={acc} 
                        onEdit={(acc) => openForm(acc)} 
                        onDelete={(id) => {
                          if (window.confirm('Apakah Anda yakin ingin menghapus profil kredit ini?')) {
                            deleteMutation.mutate(id);
                          }
                        }}
                      />
                    </div>
                  ))
        )}
                </div>

                {/* Pagination footer */}
                {creditsResponse && creditsResponse.last_page > 1 && (
                  <div className="mt-5 d-flex flex-column flex-md-row align-items-center justify-content-between py-3 gap-3">
                    <div className="text-secondary small d-flex align-items-center">
                      Menampilkan&nbsp;<strong>{creditsResponse.from}</strong>&nbsp;–&nbsp;<strong>{creditsResponse.to}</strong>&nbsp;dari&nbsp;<strong>{creditsResponse.total}</strong>&nbsp;data
                    </div>
                    <div className="pagination-wrapper">
                      <Pagination
                        activeItem={page}
                        count={creditsResponse.last_page}
                        className="m-0"
                        onPageChange={(p) => setPage(p)}
                      />
                    </div>
                  </div>
                )}
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title h2 fw-bold">Profil Kredit: {selectedAccount?.name}</h5>
          <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
        </div>
        <div className="modal-body pt-4">
          <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Limit Kredit (Plafon)</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.limit} 
                    onChange={e => setFormData({...formData, limit: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Total Pinjaman Saat Ini</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.total_amount} 
                    onChange={e => setFormData({...formData, total_amount: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Besar Cicilan</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.installment_amount} 
                    onChange={e => setFormData({...formData, installment_amount: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Periode Cicilan</label>
                <Select
                  value={formData.installment_type}
                  onChange={val => setFormData({...formData, installment_type: val})}
                  showSearch={false}
                  options={[
                    { value: 'monthly', label: 'Bulanan' }
                  ]}
                />
              </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Tenggat Waktu (Jatuh Tempo)</label>
                <Datepicker
                  value={formData.due_date}
                  onChange={(val) => setFormData({...formData, due_date: val})}
                  layout="icon"
                />
            </div>

            <div className="mb-3">
              <label className="form-label">Catatan Tambahan</label>
              <AutosizeTextarea 
                className="form-control" 
                rows={3} 
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, notes: e.target.value})}
                placeholder="Misal: Cicilan rumah ke-12"
              />
            </div>

            <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
              <Button element="button" type="button" color="ghost-secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button element="button" type="submit" color="primary" loading={mutation.isPending}>Simpan Profil</Button>
            </div>
          </form>
        </div>
      </Modal>
    </BaseLayout>
  );
}
