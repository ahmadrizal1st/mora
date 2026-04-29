import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Badge, Pagination, Spinner, DropdownGrouping, Button } from '@/shared/components/ui';
import { MetricAreaChartCard, ComparisonChartCard, SummaryChartCard } from '@/shared/components/cards/charts';

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
  const [txToDelete, setTxToDelete] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const { data: response, isLoading: isLoadingTx } = useTransactions(filters);
  const { data: summary, isLoading: isLoadingSummary } = useTransactionSummary({
    date_from: filters.date_from,
    date_to: filters.date_to,
    account_id: filters.account_id,
    group_by: groupBy,
  });

  const { data: historyData } = useTransactionHistory({
    date_from: filters.date_from,
    date_to: filters.date_to,
    account_id: filters.account_id,
    group_by: groupBy,
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
      countLabels: historyData.count_labels,
      comparisonSeries: [
        {
          name: 'Pemasukan',
          data: historyData.income,
          color: 'primary'
        },
        {
          name: 'Pengeluaran',
          data: historyData.expense,
          color: 'secondary'
        }
      ],
      comparisonLabels: historyData.income_labels
    };
  }, [historyData]);

  const deleteMutation = useDeleteTransaction();

  const handleClearFilters = () => {
    setFilters({ page: 1, per_page: 15 });
  };

  const handleSort = (column: string) => {
    setFilters(prev => {
      // If same column → toggle; new column → always start desc
      const isSameCol = prev.sort_by === column;
      const newDir = isSameCol
        ? (prev.sort_dir === 'desc' ? 'asc' : 'desc')
        : 'desc';
      return { ...prev, sort_by: column, sort_dir: newDir, page: 1 };
    });
  };

  const getSortIcon = (column: string) => {
    if (filters.sort_by !== column) return <Icon icon="selector" size={12} className="ms-1 opacity-40" />;
    return filters.sort_dir === 'asc'
      ? <Icon icon="chevron-up" size={12} className="ms-1 text-primary" />
      : <Icon icon="chevron-down" size={12} className="ms-1 text-primary" />;
  };

  const handleDelete = (id: number) => {
    setTxToDelete(id);
  };

  const confirmDelete = async () => {
    if (!txToDelete) return;
    try {
      await deleteMutation.mutateAsync(txToDelete);
      setTxToDelete(null);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
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
    } catch {
      return '-';
    }
  };

  return (
    <BaseLayout
      pageTitle="Daftar Transaksi"
      pageActions={<DropdownGrouping defaultValue={groupBy} onChange={setGroupBy} />}
    >
      <div className="container-xl">
        <div className="row row-cards g-2 g-lg-3 mb-3">
          {/* Summary Cards */}
          <div className="col-6 col-md-6 col-lg-3">
            <MetricAreaChartCard
              title="Total Pemasukan"
              value={isLoadingSummary ? '...' : formatCurrency(summary?.total_income || 0)}
              trendValue={summary?.income_trend || 0}
              color="success"
              chartId="income-chart"
              series={chartData.incomeSeries}
              categories={chartData.incomeLabels}
              style={{ height: '140px' }}
            />
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <MetricAreaChartCard
              title="Total Pengeluaran"
              value={isLoadingSummary ? '...' : formatCurrency(summary?.total_expense || 0)}
              trendValue={summary?.expense_trend || 0}
              color="danger"
              chartId="expense-chart"
              series={chartData.expenseSeries}
              categories={chartData.expenseLabels}
              style={{ height: '140px' }}
            />
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <ComparisonChartCard
              title="Saldo Bersih"
              value={isLoadingSummary ? '...' : formatCurrency(summary?.net_balance || 0)}
              trendValue={summary?.balance_trend || 0}
              series={chartData.comparisonSeries}
              categories={chartData.comparisonLabels}
              style={{ height: '140px' }}
            />
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <SummaryChartCard
              title="Jumlah Transaksi"
              value={isLoadingSummary ? '...' : (summary?.transaction_count || 0).toString()}
              trendValue={summary?.count_trend || 0}
              chartId="tx-count-chart"
              series={chartData.countSeries}
              categories={chartData.countLabels}
              style={{ height: '140px' }}
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
            <table className="table table-vcenter table-hover card-table" style={{ tableLayout: 'fixed', width: '100%', minWidth: '1100px' }}>
              <thead className="bg-light">
                <tr>
                  <th className="text-secondary opacity-7 fw-bold cursor-pointer" style={{ width: '100px' }} onClick={() => handleSort('tx_date')}>
                    <div className="d-flex align-items-center">Tanggal {getSortIcon('tx_date')}</div>
                  </th>
                  <th className="text-secondary opacity-7 fw-bold cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('merchant')}>
                    <div className="d-flex align-items-center">Keterangan / Merchant {getSortIcon('merchant')}</div>
                  </th>
                  <th className="text-secondary opacity-7 fw-bold" style={{ width: '220px' }}>Tag</th>
                  <th className="text-secondary opacity-7 fw-bold cursor-pointer" style={{ width: '160px' }} onClick={() => handleSort('category')}>
                    <div className="d-flex align-items-center">Kategori {getSortIcon('category')}</div>
                  </th>
                  <th className="text-secondary opacity-7 fw-bold cursor-pointer" style={{ width: '140px' }} onClick={() => handleSort('account')}>
                    <div className="d-flex align-items-center">Akun {getSortIcon('account')}</div>
                  </th>
                  <th className="text-secondary opacity-7 fw-bold" style={{ width: '100px' }}>Status</th>
                  <th className="text-secondary opacity-7 fw-bold text-end cursor-pointer" style={{ width: '110px' }} onClick={() => handleSort('nominal')}>
                    <div className="d-flex align-items-center justify-content-end">Nominal {getSortIcon('nominal')}</div>
                  </th>
                  <th className="text-secondary opacity-7 fw-bold text-center" style={{ width: '80px' }}>Aksi</th>
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
                        <span className="fw-medium text-dark text-truncate" style={{ maxWidth: '120px' }}>{tx.merchant || (tx.type === 'transfer' ? 'Transfer Dana' : 'Umum')}</span>
                        {tx.notes && <span className="text-secondary small text-truncate" style={{ maxWidth: '120px' }}>{tx.notes}</span>}
                      </div>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '180px' }}>
                        {tx.tags?.map(tag => (
                          <span
                            key={tag.id}
                            className="badge badge-outline text-nowrap"
                            style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderColor: `${tag.color}40`,
                              color: tag.color,
                              backgroundColor: `${tag.color}08`,
                              textAlign: 'center',
                              width: 'fit-content'
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      {(!tx.tags || tx.tags.length === 0) && <span className="text-muted small">-</span>}
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
        scrollable
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

      <Modal show={!!txToDelete} onClose={() => setTxToDelete(null)} size="sm">
        <ModalHeader title="Konfirmasi Penghapusan" onClose={() => setTxToDelete(null)} />
        <div className="modal-body text-center py-4">
          <Icon icon="alert-triangle" size={48} className="text-danger mb-3" />
          <h3>Hapus Transaksi?</h3>
          <div className="text-secondary mb-3">
            Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi saldo akun terkait.
          </div>
          
          <div className="d-flex gap-2">
            <Button className="flex-fill" onClick={() => setTxToDelete(null)}>
              Batal
            </Button>
            <Button
              color="danger"
              className="flex-fill fw-bold"
              onClick={confirmDelete}
              loading={deleteMutation.isPending}
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </BaseLayout>
  );
};
