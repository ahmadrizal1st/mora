import { useState } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, CardTitle, Icon, Spinner, Modal } from '@/shared/components/ui';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { useAccounts } from '../hooks/useAccounts';
import axios from '@/shared/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function CreditsPage() {
  const queryClient = useQueryClient();
  const { data: accountsResponse, isLoading: accountsLoading } = useAccounts();
  const accounts = accountsResponse?.data || [];

  // Fetch only accounts that already have credits
  const { data: creditsResponse, isLoading: creditsLoading } = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      const res = await axios.get('/credits');
      return res.data;
    }
  });
  const creditAccounts = creditsResponse?.data || [];

  const [selectedAccount, setSelectedAccount] = useState<any>(null);
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
    mutationFn: async (data: any) => {
      const res = await axios.post(`/accounts/${selectedAccount.id}/credit`, data);
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

  const openForm = (account: any) => {
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

  const isLoading = accountsLoading || creditsLoading;

  return (
    <BaseLayout pageTitle="Manajemen Kredit & Pinjaman">
      <div className="container-xl">
        <div className="row g-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-4 d-flex justify-content-between align-items-center">
                <CardTitle>Daftar Kredit Aktif</CardTitle>
                <div className="btn-group">
                  <button className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                    Tambah Profil Kredit
                  </button>
                  <div className="dropdown-menu dropdown-menu-end">
                    {accounts.map((acc: any) => (
                      <button 
                        key={acc.id} 
                        className="dropdown-item" 
                        onClick={() => openForm(acc)}
                      >
                        {acc.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-vcenter card-table">
                    <thead>
                      <tr>
                        <th>Akun</th>
                        <th>Limit / Plafon</th>
                        <th>Total Pinjaman</th>
                        <th>Cicilan</th>
                        <th>Tenggat</th>
                        <th className="w-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan={6} className="text-center py-5"><Spinner /></td></tr>
                      ) : creditAccounts.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-5 text-muted">Belum ada profil kredit yang ditambahkan.</td></tr>
                      ) : creditAccounts.map((acc: any) => (
                        <tr key={acc.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-xs me-2 rounded" style={{ backgroundColor: acc.color }}></span>
                              <span className="fw-bold">{acc.name}</span>
                            </div>
                          </td>
                          <td className="text-secondary">{formatCurrency(acc.credit?.limit)}</td>
                          <td className="fw-bold">{formatCurrency(acc.credit?.total_amount)}</td>
                          <td>
                             <div>{formatCurrency(acc.credit?.installment_amount)}</div>
                             <div className="small text-muted text-capitalize">{acc.credit?.installment_type === 'monthly' ? 'Bulanan' : 'Tahunan'}</div>
                          </td>
                          <td>
                            {acc.credit?.due_date ? (
                              <span className="badge bg-yellow-lt">
                                {new Date(acc.credit.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </span>
                            ) : '-'}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-icon btn-sm btn-ghost-primary" onClick={() => openForm(acc)}>
                                <Icon icon="pencil" size={14} />
                              </button>
                              <button className="btn btn-icon btn-sm btn-ghost-danger" onClick={() => { if(window.confirm('Hapus profil kredit ini?')) deleteMutation.mutate(acc.id) }}>
                                <Icon icon="trash" size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
                <select 
                  className="form-select" 
                  value={formData.installment_type}
                  onChange={e => setFormData({...formData, installment_type: e.target.value})}
                >
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Tenggat Waktu (Jatuh Tempo)</label>
              <input 
                type="date" 
                className="form-control" 
                value={formData.due_date}
                onChange={e => setFormData({...formData, due_date: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Catatan Tambahan</label>
              <textarea 
                className="form-control" 
                rows={3} 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="Misal: Cicilan rumah ke-12"
              ></textarea>
            </div>

            <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
              <Button color="ghost-secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="submit" color="primary" loading={mutation.isPending}>Simpan Profil</Button>
            </div>
          </form>
        </div>
      </Modal>
    </BaseLayout>
  );
}
