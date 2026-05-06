import { create } from 'zustand';
import type { Transaction } from '../types/transaction.types';

interface TransactionModalState {
  isMethodModalOpen: boolean;
  isFormOpen: boolean;
  editingTransaction: Transaction | undefined;
  txToDelete: string | null;
  openMethodModal: () => void;
  closeMethodModal: () => void;
  openForm: (transaction?: Transaction) => void;
  closeForm: () => void;
  setTxToDelete: (id: string | null) => void;
}

export const useTransactionModalStore = create<TransactionModalState>((set) => ({
  isMethodModalOpen: false,
  isFormOpen: false,
  editingTransaction: undefined,
  txToDelete: null,
  openMethodModal: () => set({ isMethodModalOpen: true }),
  closeMethodModal: () => set({ isMethodModalOpen: false }),
  openForm: (transaction) => set({ isFormOpen: true, editingTransaction: transaction, isMethodModalOpen: false }),
  closeForm: () => set({ isFormOpen: false, editingTransaction: undefined }),
  setTxToDelete: (id) => set({ txToDelete: id }),
}));
