import { useState } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Icon, Modal, Select, Datepicker, AutosizeTextarea } from '@/shared/components/ui';
import { useAccounts } from '../hooks/useAccounts';
import axios from '@/shared/api/client';
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
      if (!selectedAccount) throw new Error('Account not selected');
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
    mutationFn: async (id: string) => {
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
      setFormData({ limit: 0, total_amount: 0, installment_amount: 0, installment_type: 'monthly', due_date: '', notes: '' });
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
                  options={[{ value: 'monthly', label: 'Bulanan' }]}
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
