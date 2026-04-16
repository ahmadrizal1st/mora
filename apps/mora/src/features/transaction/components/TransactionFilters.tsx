import React from 'react';
import { type TransactionFilters } from '../types/transaction.types';
import { useCategories, useStatuses } from '../hooks/useLookups';
import { useAccounts } from '../hooks/useAccounts';
import { Icon, Button } from '@/shared/components/ui';

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
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  useStatuses(); // Still calling the hook but not storing the unused 'statuses' variable

  const handleFilterChange = <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-2">
          <div className="col-md-3">
            <div className="input-icon">
              <span className="input-icon-addon">
                <Icon icon="search" size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Cari transaksi..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            >
              <option value="">Semua Tipe</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.account_id || ''}
              onChange={(e) => handleFilterChange('account_id', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Semua Akun</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.category_id || ''}
              onChange={(e) => handleFilterChange('category_id', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3 d-flex gap-2">
            <input
              type="date"
              className="form-control"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              title="Dari Tanggal"
            />
            <input
              type="date"
              className="form-control"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              title="Ke Tanggal"
            />
            <Button
              variant="outline-secondary"
              className="btn-icon"
              title="Reset Filter"
              onClick={onClear}
            >
              <Icon icon="x" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
