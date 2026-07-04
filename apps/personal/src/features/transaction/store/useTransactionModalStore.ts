import { create } from 'zustand'
import type { Transaction } from '../types/transaction.types'

interface TransactionModalState {
  scannedImage: File | null
  setScannedImage: (file: File | null) => void
  isMethodModalOpen: boolean
  isFormOpen: boolean
  isChatbotModalOpen: boolean
  editingTransaction: Transaction | undefined
  txToDelete: string | null
  openMethodModal: () => void
  closeMethodModal: () => void
  openForm: (transaction?: Transaction) => void
  closeForm: () => void
  setTxToDelete: (id: string | null) => void
  openChatbotModal: () => void
  closeChatbotModal: () => void
}

export const useTransactionModalStore = create<TransactionModalState>((set) => ({
  scannedImage: null,
  setScannedImage: (file) => set({ scannedImage: file }),
  isMethodModalOpen: false,
  isFormOpen: false,
  isChatbotModalOpen: false,
  editingTransaction: undefined,
  txToDelete: null,
  openMethodModal: () => set({ isMethodModalOpen: true }),
  closeMethodModal: () => set({ isMethodModalOpen: false }),
  openForm: (transaction) =>
    set({ isFormOpen: true, editingTransaction: transaction, isMethodModalOpen: false }),
  closeForm: () => set({ isFormOpen: false, editingTransaction: undefined }),
  setTxToDelete: (id) => set({ txToDelete: id }),
  openChatbotModal: () => set({ isChatbotModalOpen: true, isMethodModalOpen: false }),
  closeChatbotModal: () => set({ isChatbotModalOpen: false }),
}))
