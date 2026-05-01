import { useState, useEffect, useMemo, type FC, type MouseEvent } from 'react';
import { Link } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Pagination, DropdownGrouping } from '@/shared/components/ui';
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
import { type TransactionFormValues } from '../components/TransactionForm';
import { TransactionSummaryCards } from '../components/TransactionSummaryCards';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModals } from '../components/TransactionModals';

export const TransactionListPage: FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    per_page: 15,
  });

  // Modal & Responsive State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [txToDelete, setTxToDelete] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
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
  const deleteMutation = useDeleteTransaction();

  const handleAdd = (e: MouseEvent) => {
    if (!isMobile) {
      e.preventDefault();
      setEditingTransaction(undefined);
      setIsModalOpen(true);
    }
  };

  const handleEdit = (tx: Transaction, e: MouseEvent) => {
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

  const chartData = useMemo(() => {
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
      incomeSeries: [{ name: 'Pemasukan', data: historyData.income }],
      incomeLabels: historyData.income_labels,
      expenseSeries: [{ name: 'Pengeluaran', data: historyData.expense }],
      expenseLabels: historyData.expense_labels,
      countSeries: [{ name: 'Transaksi', data: historyData.count }],
      countLabels: historyData.count_labels,
      comparisonSeries: [
        { name: 'Pemasukan', data: historyData.income, color: 'primary' },
        { name: 'Pengeluaran', data: historyData.expense, color: 'secondary' }
      ],
      comparisonLabels: historyData.income_labels
    };
  }, [historyData]);

  const handleClearFilters = () => {
    setFilters({ page: 1, per_page: 15 });
  };

  const handleSort = (column: string) => {
    setFilters(prev => {
      const isSameCol = prev.sort_by === column;
      const newDir = isSameCol ? (prev.sort_dir === 'desc' ? 'asc' : 'desc') : 'desc';
      return { ...prev, sort_by: column, sort_dir: newDir, page: 1 };
    });
  };

  const getSortIcon = (column: string) => {
    if (filters.sort_by !== column) return <Icon icon="selector" size={12} className="ms-1 opacity-40" />;
    return filters.sort_dir === 'asc'
      ? <Icon icon="chevron-up" size={12} className="ms-1 text-primary" />
      : <Icon icon="chevron-down" size={12} className="ms-1 text-primary" />;
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
        return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
      }
      return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
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
        <TransactionSummaryCards
          summary={summary}
          isLoading={isLoadingSummary}
          chartData={chartData}
          formatCurrency={formatCurrency}
        />

        <TransactionFiltersComponent
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
        />

        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h3 className="card-title">Semua Transaksi</h3>
            <div className="card-actions">
              <Link to="/tracker/input" className="btn btn-primary d-none d-sm-inline-block" onClick={handleAdd}>
                <Icon icon="plus" size={18} className="me-1" />
                Tambah Transaksi
              </Link>
              <Link to="/tracker/input" className="btn btn-primary btn-icon d-sm-none" aria-label="Tambah Transaksi">
                <Icon icon="plus" size={18} />
              </Link>
            </div>
          </div>

          <TransactionTable
            transactions={response?.data}
            isLoading={isLoadingTx}
            onEdit={handleEdit}
            onDelete={(id) => setTxToDelete(id)}
            onSort={handleSort}
            getSortIcon={getSortIcon}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            deletePendingId={deleteMutation.isPending ? deleteMutation.variables : null}
          />

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

      <TransactionModals
        isFormOpen={isModalOpen}
        onFormClose={() => setIsModalOpen(false)}
        editingTransaction={editingTransaction}
        onFormSubmit={handleFormSubmit}
        isFormLoading={createMutation.isPending || updateMutation.isPending}
        txToDelete={txToDelete}
        onDeleteClose={() => setTxToDelete(null)}
        onDeleteConfirm={confirmDelete}
        isDeleteLoading={deleteMutation.isPending}
      />
    </BaseLayout>
  );
};
