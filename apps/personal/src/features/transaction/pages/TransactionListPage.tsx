import { useState, useEffect, useMemo, type FC, type MouseEvent } from 'react';
import { Link } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon, Pagination, DropdownGrouping, Modal } from '@/shared/components/ui';
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
import { TransactionList } from '../components/TransactionList';
import { TransactionModals } from '../components/TransactionModals';
import { TransactionInvoice } from '../components/TransactionInvoice';

export const TransactionListPage: FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    per_page: 15,
  });

  // Modal & Responsive State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  // Invoice state
  const [invoiceTransaction, setInvoiceTransaction] = useState<Transaction | undefined>(undefined);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const [viewMode, setViewMode] = useState<'table' | 'list'>('list');

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
    e.preventDefault();
    setInvoiceTransaction(tx);
    setIsInvoiceOpen(true);
  };

  const handleStartEdit = (tx: Transaction) => {
    setIsInvoiceOpen(false);
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: TransactionFormValues) => {
    try {
      if (editingTransaction) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateMutation.mutateAsync({ id: editingTransaction.id, data: data as any });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createMutation.mutateAsync({ ...data, input_method: 'manual' } as any);
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

  const formatDate = (dateString: string, type: 'date' | 'time' | 'full' = 'date') => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      const datePart = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
      const timePart = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(date);

      if (type === 'time') return timePart;
      if (type === 'full') return `${datePart} ${timePart}`;
      return datePart;
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

        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="card-header border-0 bg-transparent py-3">
            <h3 className="card-title fw-bold">Semua Transaksi</h3>
            <div className="card-actions d-flex align-items-center gap-2">
              <div className="btn-group shadow-sm rounded-2 overflow-hidden me-2">
                <button 
                  className={`btn btn-icon border-0 ${viewMode === 'list' ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setViewMode('list')}
                  title="Tampilan Daftar"
                >
                  <Icon icon="list" size={18} />
                </button>
                <button 
                  className={`btn btn-icon border-0 ${viewMode === 'table' ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setViewMode('table')}
                  title="Tampilan Tabel"
                >
                  <Icon icon="table" size={18} />
                </button>
              </div>
              <Link to="/tracker/input" className="btn btn-primary d-none d-sm-inline-block shadow-sm" onClick={handleAdd}>
                <Icon icon="plus" size={18} className="me-1" />
                Tambah Transaksi
              </Link>
              <Link to="/tracker/input" className="btn btn-primary btn-icon d-sm-none" aria-label="Tambah Transaksi">
                <Icon icon="plus" size={18} />
              </Link>
            </div>
          </div>

          <div className="card-body p-0">
            {viewMode === 'table' ? (
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
            ) : (
              <TransactionList
                transactions={response?.data}
                isLoading={isLoadingTx}
                onEdit={handleEdit}
                onDelete={(id) => setTxToDelete(id)}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                deletePendingId={deleteMutation.isPending ? deleteMutation.variables : null}
              />
            )}
          </div>

          {response && response.total > 0 && (
            <div className="card-footer d-flex flex-column flex-md-row align-items-center justify-content-between bg-transparent border-top-0 py-3 gap-3">
              <div className="text-secondary small d-flex align-items-center">
                Menampilkan&nbsp;<strong>{response.from || 0}</strong>&nbsp;–&nbsp;<strong>{response.to || 0}</strong>&nbsp;dari&nbsp;<strong>{response.total}</strong>&nbsp;transaksi
              </div>
              {response.last_page > 1 && (
                <div className="pagination-wrapper">
                  <Pagination
                    activeItem={filters.page || 1}
                    count={response.last_page}
                    className="m-0"
                    onPageChange={(page) => setFilters({ ...filters, page })}
                  />
                </div>
              )}
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

      {/* Transaction Invoice Modal */}
      <Modal
        show={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        size={isMobile ? 'fullscreen' : 'lg'}
        top={!isMobile}
        className={isMobile ? 'p-0' : ''}
      >
        {invoiceTransaction && (
          <TransactionInvoice
            transaction={invoiceTransaction}
            onClose={() => setIsInvoiceOpen(false)}
            onEdit={handleStartEdit}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        )}
      </Modal>
    </BaseLayout>
  );
};
