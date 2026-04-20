import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Button, CardTitle, Badge, Pagination, Spinner } from '@/shared/components/ui';
import { RevenueCard, SalesCard, ActiveUsersCard } from '@/shared/components/cards/charts';

import {
  useTransactions,
  useTransactionSummary,
  useDeleteTransaction,
  useTransactionHistory,
  useCreateTransaction,
  useUpdateTransaction
} from '../hooks/useTransactions';
import type { TransactionFilters, Transaction } from '../types/transaction.types';
import { TransactionFiltersComponent } from '../components/TransactionFilters';
import { Modal, ModalHeader } from '@/shared/components/ui/Modal';
import { TransactionForm, type TransactionFormValues } from '../components/TransactionForm';

export const TransactionListPage: React.FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    per_page: 15,
  });

  // Modal & Responsive State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: response, isLoading: isLoadingTx } = useTransactions(filters);
  const { data: summary, isLoading: isLoadingSummary } = useTransactionSummary({
    date_from: filters.date_from,
    date_to: filters.date_to,
    account_id: filters.account_id,
  });

  const { data: historyData } = useTransactionHistory({
    date_from: filters.date_from,
    date_to: filters.date_to,
    account_id: filters.account_id,
  });

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const handleAdd = (e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault();
      setEditingTransaction(undefined);
      setIsModalOpen(true);
    }
  };

  const handleEdit = (tx: Transaction, e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault();
      setEditingTransaction(tx);
      setIsModalOpen(true);
    }
  };

  const handleFormSubmit = async (data: TransactionFormValues) => {
    try {
      if (editingTransaction) {
        await updateMutation.mutateAsync({ id: editingTransaction.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save transaction:', err);
    }
  };

  const chartData = React.useMemo(() => {
    if (!historyData || !historyData.income) {
      return {
        incomeSeries: [{ name: 'Pemasukan', data: [0] }],
        incomeLabels: [],
        expenseSeries: [{ name: 'Pengeluaran', data: [0] }],
        expenseLabels: [],
        countSeries: [{ name: 'Transaksi', data: [0] }],
        countLabels: []
      };
    }

    return {
      incomeSeries: [{
        name: 'Pemasukan',
        data: historyData.income
      }],
      incomeLabels: historyData.income_labels,
      expenseSeries: [{
        name: 'Pengeluaran',
        data: historyData.expense
      }],
      expenseLabels: historyData.expense_labels,
      countSeries: [{
        name: 'Transaksi',
        data: historyData.count
      }],
      countLabels: historyData.count_labels
    };
  }, [historyData]);

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
          <div className="col-sm-6 col-lg-3">
            <RevenueCard
              title="Total Pemasukan"
              value={isLoadingSummary ? '...' : formatCurrency(summary?.total_income || 0)}
              trendValue={summary?.income_trend || 0}
              color="success"
              chartId="income-chart"
              series={chartData.incomeSeries}
              categories={chartData.incomeLabels}
              style={{ height: '152px' }}
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <RevenueCard
              title="Total Pengeluaran"
              value={isLoadingSummary ? '...' : formatCurrency(summary?.total_expense || 0)}
              trendValue={summary?.expense_trend || 0}
              color="danger"
              chartId="expense-chart"
              series={chartData.expenseSeries}
              categories={chartData.expenseLabels}
              style={{ height: '152px' }}
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <SalesCard
              title="Saldo Bersih"
              value={isLoadingSummary ? '...' : formatCurrency(summary?.net_balance || 0)}
              progressColor="primary"
              progressValue={summary?.total_income ? Math.max(0, Math.min(100, (summary.net_balance / summary.total_income) * 100)) : 0}
              conversionRateLabel="Rasio Saldo/Pemasukan"
              trendValue={summary?.balance_trend || 0}
              dropdownId="balance-dropdown"
              style={{ height: '152px' }}
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <ActiveUsersCard
              title="Jumlah Transaksi"
              value={isLoadingSummary ? '...' : (summary?.transaction_count || 0).toString()}
              trendValue={summary?.count_trend || 0}
              chartId="tx-count-chart"
              series={chartData.countSeries}
              categories={chartData.countLabels}
              style={{ height: '152px' }}
            />
          </div>
        </div>

        <TransactionFiltersComponent
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
        />

        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h3 className="card-title">Semua Transaksi</h3>
            <div className="card-actions">
              <Link
                to="/tracker/input"
                className="btn btn-primary d-none d-sm-inline-block"
                onClick={handleAdd}
              >
                <Icon icon="plus" size={18} className="me-1" />
                Tambah Transaksi
              </Link>
              <Link
                to="/tracker/input"
                className="btn btn-primary btn-icon d-sm-none"
                aria-label="Tambah Transaksi"
              >
                <Icon icon="plus" size={18} />
              </Link>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-vcenter table-hover card-table">
              <thead className="bg-light">
                <tr>
                  <th className="text-secondary opacity-7 fw-bold" style={{ width: '120px' }}>Tanggal</th>
                  <th className="text-secondary opacity-7 fw-bold">Keterangan / Merchant</th>
                  <th className="text-secondary opacity-7 fw-bold" style={{ width: '140px' }}>Tag</th>
                  <th className="text-secondary opacity-7 fw-bold" style={{ width: '120px' }}>Kategori</th>
                  <th className="text-secondary opacity-7 fw-bold" style={{ width: '120px' }}>Akun</th>
                  <th className="text-secondary opacity-7 fw-bold" style={{ width: '100px' }}>Status</th>
                  <th className="text-secondary opacity-7 fw-bold text-end" style={{ width: '130px' }}>Nominal</th>
                  <th className="text-secondary opacity-7 fw-bold text-center" style={{ width: '90px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody className="table-tbody">
                {isLoadingTx ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <div className="empty">
                        <div className="empty-img"><Spinner /></div>
                        <p className="empty-title">Memuat data...</p>
                      </div>
                    </td>
                  </tr>
                ) : response?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <div className="empty">
                        <div className="empty-icon text-secondary">
                          <Icon icon="mood-sad" size={32} />
                        </div>
                        <p className="empty-title">Tidak ada transaksi ditemukan</p>
                        <p className="empty-subtitle">Coba gunakan filter lain atau buat transaksi baru.</p>
                      </div>
                    </td>
                  </tr>
                ) : response?.data?.map((tx) => (
                  <tr key={tx.id}>
                    <td className="text-nowrap">
                      <div className="fw-medium">{formatDate(tx.tx_date)}</div>
                      <div className="text-secondary small">{formatDate(tx.created_at, 'time')}</div>
                    </td>
                    <td className="td-truncate">
                      <div className="d-flex flex-column">
                        <span className="fw-medium text-dark text-truncate" style={{ maxWidth: '200px' }}>{tx.merchant || (tx.type === 'transfer' ? 'Transfer Dana' : 'Umum')}</span>
                        {tx.notes && <span className="text-secondary small text-truncate" style={{ maxWidth: '200px' }}>{tx.notes}</span>}
                      </div>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex flex-wrap gap-1">
                        {tx.tags?.map(tag => (
                          <span 
                            key={tag.id} 
                            className="badge badge-outline text-nowrap"
                            style={{ 
                              fontSize: '10px', 
                              padding: '2px 6px',
                              borderColor: `${tag.color}40`,
                              color: tag.color,
                              backgroundColor: `${tag.color}08`
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                        {(!tx.tags || tx.tags.length === 0) && <span className="text-muted small">-</span>}
                      </div>
                    </td>
                    <td className="align-middle">
                      {tx.category ? (
                        <div className="d-inline-flex align-items-center">
                          <Badge
                            outline
                            pill
                            className="px-2 py-1 fw-medium"
                            style={{ 
                              borderColor: tx.category.color, 
                              color: tx.category.color,
                              backgroundColor: `${tx.category.color}10`,
                              fontSize: '11px'
                            }}
                          >
                            {tx.category.icon && <Icon icon={tx.category.icon} size={12} className="me-1" />}
                            {tx.category.name}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted small">Tanpa Kategori</span>
                      )}
                    </td>
                    <td className="align-middle">
                      <div className="d-flex align-items-center">
                        <span className="status-dot me-2" style={{ backgroundColor: tx.account?.color || '#eee' }}></span>
                        <span className="text-truncate" style={{ maxWidth: '100px' }}>{tx.account?.name}</span>
                      </div>
                    </td>
                    <td className="align-middle">
                      {tx.status ? (
                        <span 
                          className="badge fw-medium"
                          style={{ 
                            backgroundColor: `${tx.status.color}15`,
                            color: tx.status.color,
                            fontSize: '11px'
                          }}
                        >
                          {tx.status.name}
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted">Draft</span>
                      )}
                    </td>
                    <td className={`text-end fw-bold align-middle ${tx.type === 'income' ? 'text-success' : tx.type === 'expense' ? 'text-danger' : 'text-primary'}`}>
                      <span className="text-nowrap">
                        {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                        {formatCurrency(tx.amount_raw)}
                      </span>
                    </td>
                    <td className="align-middle text-center" style={{ width: '90px' }}>
                      <div className="d-flex align-items-center justify-content-center gap-3">
                        <Link
                          to="/tracker/input"
                          search={{ id: tx.id }}
                          style={{ color: '#f76707', textDecoration: 'none', transition: 'none' }}
                          title="Edit"
                          onClick={(e) => handleEdit(tx, e)}
                        >
                          <Icon icon="edit" size={20} />
                        </Link>
                        <span
                          style={{ color: '#d63939', cursor: 'pointer', transition: 'none' }}
                          title="Hapus"
                          onClick={() => handleDelete(tx.id)}
                        >
                          {deleteMutation.isPending && deleteMutation.variables === tx.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <Icon icon="trash" size={20} />
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {response && response.last_page > 1 && (
            <div className="card-footer d-flex flex-column flex-md-row align-items-center justify-content-between bg-transparent border-top-0 py-3 gap-3">
              <div className="text-secondary small d-flex align-items-center">
                Menampilkan&nbsp;<strong>{response.from}</strong>&nbsp;–&nbsp;<strong>{response.to}</strong>&nbsp;dari&nbsp;<strong>{response.total}</strong>&nbsp;transaksi
              </div>
              <div className="pagination-wrapper">
                <Pagination
                  activeItem={filters.page || 1}
                  count={response.last_page}
                  className="m-0"
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Transaction Modal */}
      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <ModalHeader
          title={editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
          onClose={() => setIsModalOpen(false)}
        />
        <div className="modal-body p-4">
          <TransactionForm
            key={editingTransaction?.id || 'new'}
            initialData={editingTransaction}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </Modal>
    </BaseLayout>
  );
};
