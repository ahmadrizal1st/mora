import React, { useMemo } from 'react';
import type { TransactionFilters, TransactionType } from '../types/transaction.types';
import { useCategories, useStatuses, useTags } from '../hooks/useLookups';
import { useAccounts } from '../hooks/useAccounts';
import { Icon, Button, Select, Datepicker } from '@/shared/components/ui';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
  onClear
}) => {
  const { data: response } = useAccounts();
  const accounts = useMemo(() => response?.data || [], [response?.data]);
  const { data: categories = [] } = useCategories();
  const { data: statuses = [] } = useStatuses();
  const { data: tags = [] } = useTags();

  const handleFilterChange = <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const accountOptions = useMemo(() => [
    { value: '', label: 'Semua Akun' },
    ...accounts.map(a => ({ value: a.id, label: a.name }))
  ], [accounts]);

  const categoryOptions = useMemo(() => [
    { value: '', label: 'Semua Kategori' },
    ...categories.map(c => ({ value: c.id, label: c.name, color: c.color }))
  ], [categories]);

  const statusOptions = useMemo(() => [
    { value: '', label: 'Semua Status' },
    ...statuses.map(s => ({ value: s.id, label: s.name }))
  ], [statuses]);

  const tagOptions = useMemo(() => 
    tags.map(t => ({ value: t.id, label: t.name, color: t.color }))
  , [tags]);

  const typeOptions = [
    { value: '', label: 'Semua Tipe' },
    { value: 'income', label: 'Pemasukan' },
    { value: 'expense', label: 'Pengeluaran' },
  ];

  const perPageOptions = [
    { value: 10, label: '10 Baris' },
    { value: 15, label: '15 Baris' },
    { value: 25, label: '25 Baris' },
    { value: 50, label: '50 Baris' },
    { value: 100, label: '100 Baris' },
  ];

  return (
    <div className="transaction-filters-container card mb-3 border-0 shadow-sm">
      <div className="card-body p-3 p-md-4">
        <div className="row g-3">
          <style>{`
            @media (max-width: 768px) {
              .transaction-filters-container {
                box-shadow: none !important;
                margin-bottom: 0 !important;
              }
              .transaction-filters-container .card-body {
                padding: 8px !important;
              }
            }
          `}</style>
          <div className="col-md-12 col-lg-3">
            <label className="form-label">Cari Transaksi</label>
            <div className="input-icon">
              <span className="input-icon-addon">
                <span className="text-secondary">
                  <Icon icon="search" size={18} />
                </span>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Ketik kata kunci..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4 col-lg-2">
            <label className="form-label">Tipe</label>
            <Select
              options={typeOptions}
              value={filters.type || ''}
              onChange={(val) => handleFilterChange('type', (val || undefined) as TransactionType | undefined)}
              placeholder="Semua Tipe"
              showSearch={false}
            />
          </div>

          <div className="col-md-4 col-lg-2">
            <label className="form-label">Akun</label>
            <Select
              options={accountOptions}
              value={filters.account_id || ''}
              onChange={(val) => handleFilterChange('account_id', val ? String(val) : undefined)}
              placeholder="Semua Akun"
            />
          </div>

          <div className="col-md-4 col-lg-2">
            <label className="form-label">Kat.</label>
            <Select
              options={categoryOptions}
              value={filters.category_id || ''}
              onChange={(val) => handleFilterChange('category_id', val ? String(val) : undefined)}
              placeholder="Semua"
            />
          </div>

          <div className="col-md-4 col-lg-3">
            <label className="form-label">Tags</label>
            <Select
              multiple
              options={tagOptions}
              value={filters.tag_ids || []}
              onChange={(vals) => handleFilterChange('tag_ids', Array.isArray(vals) ? vals.map(String) : [])}
              placeholder="Filter by tags..."
            />
          </div>

          <div className="col-md-8 col-lg-5">
            <label className="form-label">Rentang Tanggal</label>
            <div className="row g-2">
              <div className="col">
                <Datepicker
                  value={filters.date_from || ''}
                  onChange={(val) => handleFilterChange('date_from', val)}
                  placeholder="Mulai"
                />
              </div>
              <div className="col-auto align-self-center text-muted">-</div>
              <div className="col">
                <Datepicker
                  value={filters.date_to || ''}
                  onChange={(val) => handleFilterChange('date_to', val)}
                  placeholder="Sampai"
                />
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-2">
            <label className="form-label">Status</label>
            <Select
              options={statusOptions}
              value={filters.status_id || ''}
              onChange={(val) => handleFilterChange('status_id', val ? String(val) : undefined)}
              placeholder="Semua Status"
              showSearch={false}
            />
          </div>
          
          <div className="col-md-4 col-lg-2">
            <label className="form-label">Baris</label>
            <Select
              options={perPageOptions}
              value={filters.per_page || 15}
              onChange={(val) => handleFilterChange('per_page', Number(val))}
              showSearch={false}
            />
          </div>

          <div className="col-md-4 col-lg-3 d-flex align-items-end">
            <Button
              element="button"
              onClick={onClear}
              white
              block
              icon="rotate-clockwise"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
