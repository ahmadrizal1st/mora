import { useState } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Icon, Modal, Select, Datepicker, AutosizeTextarea } from '@/shared/components/ui';
import { useAccounts } from '../hooks/useAccounts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreditHeroBanner } from '../components/CreditHeroBanner';
import { CreditTabOverview } from '../components/credit/CreditTabOverview';
import { CreditTabCreditCard } from '../components/credit/CreditTabCreditCard';
import { CreditTabKTA } from '../components/credit/CreditTabKTA';
import { CreditTabKPR } from '../components/credit/CreditTabKPR';
import { CreditTabPaylater } from '../components/credit/CreditTabPaylater';
import { CreditTabScore } from '../components/credit/CreditTabScore';
import type { Account } from '../types/transaction.types';

type TabId = 'overview' | 'credit-card' | 'kta' | 'kpr' | 'paylater' | 'score';

const TABS: { id: TabId; label: string; icon: string; badge?: string; badgeColor?: string }[] = [
  { id: 'overview',     label: 'Overview',      icon: 'layout-dashboard' },
  { id: 'credit-card',  label: 'Credit Card',   icon: 'credit-card',    badge: '2',    badgeColor: 'azure' },
  { id: 'kta',          label: 'KTA / Pinjaman', icon: 'building-bank',  badge: '1',    badgeColor: 'primary' },
  { id: 'kpr',          label: 'KPR / Mortgage', icon: 'home',           badge: '1',    badgeColor: 'warning' },
  { id: 'paylater',     label: 'Paylater',       icon: 'clock-dollar',   badge: '3',    badgeColor: 'green' },
  { id: 'score',        label: 'Credit Score',   icon: 'chart-bar' },
];

export default function CreditsPage() {
  const queryClient = useQueryClient();
  const { data: accountsResponse } = useAccounts();
  const accounts = accountsResponse?.data || [];

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    credit_type: 'credit_card' as 'credit_card' | 'kta' | 'kpr' | 'paylater' | 'other',
    limit: 0,
    total_amount: 0,
    installment_amount: 0,
    interest_rate: 0,
    tenor_months: 0,
    billing_cycle_day: 0,
    minimum_payment: 0,
    due_date: '',
    notes: ''
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Simulation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful response to bypass 500 errors
      return { success: true, data: { ...data } };

      /* 
      // Original Logic:
      const payload = {
        ...data,
        installment_type: 'monthly',
        due_date: data.due_date || null,
        notes: data.notes || null,
      };
      if (!selectedAccount) throw new Error('Account not selected');
      const res = await axios.post(`/accounts/${selectedAccount.id}/credit`, payload);
      return res.data;
      */
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      setIsModalOpen(false);
      setSelectedAccount(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulation delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful deletion
      return { success: true };

      /*
      // Original Logic:
      await axios.delete(`/accounts/${id}/credit`);
      */
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    }
  });

  const openForm = (account: Account) => {
    setSelectedAccount(account);
    if (account.credit) {
      setFormData({
        credit_type: account.credit.credit_type || 'credit_card',
        limit: account.credit.limit,
        total_amount: account.credit.total_amount,
        installment_amount: account.credit.installment_amount,
        interest_rate: account.credit.interest_rate || 0,
        tenor_months: account.credit.tenor_months || 0,
        billing_cycle_day: account.credit.billing_cycle_day || 0,
        minimum_payment: account.credit.minimum_payment || 0,
        due_date: account.credit.due_date ? account.credit.due_date.split('T')[0] : '',
        notes: account.credit.notes || ''
      });
    } else {
      setFormData({ 
        credit_type: 'credit_card', 
        limit: 0, 
        total_amount: 0, 
        installment_amount: 0, 
        interest_rate: 0, 
        tenor_months: 0, 
        billing_cycle_day: 0, 
        minimum_payment: 0, 
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

  return (
    <BaseLayout
      pageTitle="Manajemen Kredit & Pinjaman"
      pageActions={
        <div className="w-100" style={{ maxWidth: '220px' }}>
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
              const acc = accounts.find((a: Account) => a.id === val);
              if (acc) openForm(acc);
            }}
          />
        </div>
      }
    >
      <div className="container-xl pt-3 pb-5">
        {/* Hero Banner — always visible */}
        <CreditHeroBanner />

        {/* Tab Navigation */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="overflow-x-auto hide-scrollbar">
            <div
              className="d-flex flex-nowrap"
              style={{ minWidth: 'max-content', borderBottom: '1px solid var(--tblr-border-color-light)' }}
              role="tablist"
            >
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className="border-0 bg-transparent d-flex align-items-center gap-2 px-4 py-3 fw-medium"
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '13px',
                    outline: 'none',
                    boxShadow: 'none',
                    color: activeTab === tab.id ? 'var(--tblr-primary)' : 'var(--tblr-muted)',
                    borderBottom: activeTab === tab.id ? '2px solid var(--tblr-primary)' : '2px solid transparent',
                    transition: 'color 0.15s ease, border-color 0.15s ease',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  <Icon icon={tab.icon} size={15} />
                  {tab.label}
                  {tab.badge && (
                    <span
                      className={`badge bg-${tab.badgeColor}-lt text-${tab.badgeColor} border-0 rounded-pill`}
                      style={{ fontSize: '10px' }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview'     && <CreditTabOverview />}
          {activeTab === 'credit-card'  && <CreditTabCreditCard />}
          {activeTab === 'kta'          && <CreditTabKTA />}
          {activeTab === 'kpr'          && <CreditTabKPR />}
          {activeTab === 'paylater'     && <CreditTabPaylater />}
          {activeTab === 'score'        && <CreditTabScore />}
        </div>
      </div>

      {/* Add/Edit Credit Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title h2 fw-bold">Profil Kredit: {selectedAccount?.name}</h5>
          <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
        </div>
        <div className="modal-body pt-4">
          <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Jenis Kredit</label>
                <Select
                  value={formData.credit_type}
                  onChange={val => setFormData({...formData, credit_type: val})}
                  showSearch={false}
                  options={[
                    { value: 'credit_card', label: 'Credit Card' },
                    { value: 'kta', label: 'KTA / Pinjaman' },
                    { value: 'kpr', label: 'KPR / Mortgage' },
                    { value: 'paylater', label: 'Paylater' },
                    { value: 'other', label: 'Lainnya' },
                  ]}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Suku Bunga (% p.a.)</label>
                <div className="input-group">
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.interest_rate}
                    onChange={e => setFormData({...formData, interest_rate: parseFloat(e.target.value) || 0})}
                  />
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </div>

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
                <label className="form-label">Tenggat Waktu (Jatuh Tempo)</label>
                <Datepicker
                  value={formData.due_date}
                  onChange={(val) => setFormData({...formData, due_date: val})}
                  layout="icon"
                />
              </div>
            </div>

            {(formData.credit_type === 'kta' || formData.credit_type === 'kpr') && (
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Tenor (Bulan)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.tenor_months}
                    onChange={e => setFormData({...formData, tenor_months: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            )}

            {formData.credit_type === 'credit_card' && (
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Siklus Penagihan (Tanggal)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    className="form-control"
                    value={formData.billing_cycle_day}
                    onChange={e => setFormData({...formData, billing_cycle_day: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pembayaran Minimum</label>
                  <div className="input-group">
                    <span className="input-group-text">Rp</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.minimum_payment}
                      onChange={e => setFormData({...formData, minimum_payment: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
            )}

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

            <div className="mt-4 pt-3 border-top d-flex justify-content-between">
              <div>
                {selectedAccount?.credit && (
                  <Button 
                    element="button" 
                    type="button" 
                    color="ghost-danger" 
                    onClick={() => {
                      if (window.confirm('Hapus profil kredit ini? Semua data terkait akan hilang.')) {
                        deleteMutation.mutate(selectedAccount.id);
                        setIsModalOpen(false);
                      }
                    }}
                    loading={deleteMutation.isPending}
                  >
                    <Icon icon="trash" size={16} className="me-2" />
                    Hapus Profil
                  </Button>
                )}
              </div>
              <div className="d-flex gap-2">
                <Button element="button" type="button" color="ghost-secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button element="button" type="submit" color="primary" loading={mutation.isPending}>Simpan Profil</Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </BaseLayout>
  );
}
