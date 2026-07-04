import { type FC } from 'react'
import { useTransactionModalStore } from '../store/useTransactionModalStore'
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '../hooks/useTransactions'
import { TransactionModals } from './TransactionModals'
import { ChatbotModal } from '../../tracker/components/ChatbotModal'
import type { TransactionFormValues } from './TransactionForm'
import { getApiErrorMessage } from '@/shared/utils/errorUtils'

export const GlobalTransactionModals: FC = () => {
  const { closeForm, editingTransaction, txToDelete, setTxToDelete, isChatbotModalOpen, closeChatbotModal } = useTransactionModalStore()

  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const handleFormSubmit = async (data: TransactionFormValues) => {
    try {
      if (editingTransaction) {
        await updateMutation.mutateAsync({ id: editingTransaction.id, data: data as any })
      } else {
        await createMutation.mutateAsync({ ...data, input_method: 'manual' } as any)
      }
      closeForm()
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Gagal menyimpan transaksi.'))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!txToDelete) return
    try {
      await deleteMutation.mutateAsync(txToDelete)
      setTxToDelete(null)
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Gagal menghapus transaksi.'))
    }
  }

  return (
    <>

      <ChatbotModal isOpen={isChatbotModalOpen} onClose={closeChatbotModal} />

      <TransactionModals
        isFormOpen={useTransactionModalStore.getState().isFormOpen}
        onFormClose={closeForm}
        editingTransaction={editingTransaction}
        onFormSubmit={handleFormSubmit}
        isFormLoading={createMutation.isPending || updateMutation.isPending}
        txToDelete={txToDelete}
        onDeleteClose={() => setTxToDelete(null)}
        onDeleteConfirm={handleDeleteConfirm}
        onRequestDelete={(id) => setTxToDelete(id)}
        isDeleteLoading={deleteMutation.isPending}
      />
    </>
  )
}
