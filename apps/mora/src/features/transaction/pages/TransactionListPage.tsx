import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Button, CardTitle, Badge, Pagination, Spinner } from '@/shared/components/ui';

import { useTransactions, useTransactionSummary, useDeleteTransaction } from '../hooks/useTransactions';
import type { TransactionFilters } from '../types/transaction.types';
import { TransactionFiltersComponent } from '../components/TransactionFilters';

export const TransactionListPage: React.FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    per_page: 15,
  });

  const { data: response, isLoading: isLoadingTx } = useTransactions(filters);
  const { data: summary, isLoading: isLoadingSummary } = useTransactionSummary({
    date_from: filters.date_from,
    date_to: filters.date_to,
    account_id: filters.account_id,
  });

  const deleteMutation = useDeleteTransaction();

  const handleClearFilters = () => {
    setFilters({ page: 1, per_page: 15 });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString: string, type: 'date' | 'time' = 'date') => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      if (type === 'time') {
        return new Intl.DateTimeFormat('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(date);
      }
      
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return '-';
    }
  };

  return (
    <BaseLayout pageTitle="Daftar Transaksi">
      <div className="container-xl">
        <div className="row row-cards mb-3">
          {/* Summary Cards */}
          <div className="col-sm-6 col-md-3">
            <div className="card card-sm border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <span className="bg-success text-white avatar"><Icon icon="trending-up" /></span>
                  </div>
                  <div className="col">
                    <div className="font-weight-medium text-secondary">Total Pemasukan</div>
                    <div className="h2 mb-0 fw-bold">{isLoadingSummary ? '...' : formatCurrency(summary?.total_income || 0)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card card-sm border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <span className="bg-danger text-white avatar"><Icon icon="trending-down" /></span>
                  </div>
                  <div className="col">
                    <div className="font-weight-medium text-secondary">Total Pengeluaran</div>
                    <div className="h2 mb-0 fw-bold">{isLoadingSummary ? '...' : formatCurrency(summary?.total_expense || 0)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card card-sm border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <span className="bg-primary text-white avatar"><Icon icon="wallet" /></span>
                  </div>
                  <div className="col">
                    <div className="font-weight-medium text-secondary">Saldo Bersih</div>
                    <div className="h2 mb-0 fw-bold">{isLoadingSummary ? '...' : formatCurrency(summary?.net_balance || 0)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card card-sm border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <span className="bg-info text-white avatar"><Icon icon="receipt" /></span>
                  </div>
                  <div className="col">
                    <div className="font-weight-medium text-secondary">Jumlah Transaksi</div>
                    <div className="h2 mb-0 fw-bold">{isLoadingSummary ? '...' : summary?.transaction_count || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TransactionFiltersComponent 
          filters={filters} 
          onChange={setFilters} 
          onClear={handleClearFilters}
        />

        <div className="card border-0 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <CardTitle>Semua Transaksi</CardTitle>
            <Link to="/tracker/input" className="btn btn-primary">
              <Icon icon="plus" size={18} className="me-1" />
              Transaksi Baru
            </Link>
          </div>
          
          <div className="table-responsive">
            <table className="table table-vcenter card-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan / Merchant</th>
                  <th>Kategori</th>
                  <th>Akun</th>
                  <th className="text-end">Nominal</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingTx ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <Spinner /> Memuat data...
                    </td>
                  </tr>
                ) : response?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      Tidak ada transaksi ditemukan.
                    </td>
                  </tr>
                ) : response?.data?.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className="fw-medium">{formatDate(tx.tx_date)}</div>
                      <div className="text-secondary small">{formatDate(tx.created_at, 'time')}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{tx.merchant || (tx.type === 'transfer' ? 'Transfer Dana' : 'Umum')}</div>
                      {tx.notes && <div className="text-secondary small text-truncate" style={{ maxWidth: '200px' }}>{tx.notes}</div>}
                    </td>
                    <td>
                      {tx.category ? (
                        <Badge color={tx.category.color} outline>
                          {tx.category.icon && <Icon icon={tx.category.icon} size={14} className="me-1" />}
                          {tx.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="status-dot status-blue me-2 " style={{ backgroundColor: tx.account?.color }}></span>
                        {tx.account?.name}
                        {tx.type === 'transfer' && tx.to_account && (
                          <>
                            <Icon icon="arrow-right" size={14} className="mx-1 text-muted" />
                            {tx.to_account.name}
                          </>
                        )}
                      </div>
                    </td>
                    <td className={`text-end fw-bold ${tx.type === 'income' ? 'text-success' : tx.type === 'expense' ? 'text-danger' : 'text-primary'}`}>
                      {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                      {formatCurrency(tx.amount_raw)}
                    </td>
                    <td className="text-center">
                      <div className="btn-list justify-content-center">
                          <Link
                            to="/tracker/input"
                            search={{ id: tx.id }}
                            className="btn btn-ghost-primary btn-icon"
                          >
                            <Icon icon="edit" size={18} />
                          </Link>
                        <Button
                          ghost
                          color="danger"
                          className="btn-icon"
                          onClick={() => handleDelete(tx.id)}
                          loading={deleteMutation.isPending && deleteMutation.variables === tx.id}
                        >
                          <Icon icon="trash" size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {response && response.last_page > 1 && (
            <div className="card-footer d-flex align-items-center border-0">
              <p className="m-0 text-secondary">
                Menampilkan <span>{response.from}</span> sampai <span>{response.to}</span> dari <span>{response.total}</span> data
              </p>
              <div className="ms-auto">
                <Pagination
                  activeItem={filters.page || 1}
                  count={response.last_page}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};
