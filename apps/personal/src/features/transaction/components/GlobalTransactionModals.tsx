import { type FC, useState } from 'react'
import { useTransactionModalStore } from '../store/useTransactionModalStore'
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '../hooks/useTransactions'
import { TransactionModals } from './TransactionModals'
import { ChatbotModal } from '../../tracker/components/ChatbotModal'
import type { TransactionFormValues } from './TransactionForm'
import type { CreateTransactionDTO, UpdateTransactionDTO } from '../types/transaction.types'
import { getApiErrorMessage } from '@/shared/utils/errorUtils'

export const GlobalTransactionModals: FC = () => {
  const { closeForm, editingTransaction, txToDelete, setTxToDelete, isChatbotModalOpen, closeChatbotModal } = useTransactionModalStore()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const handleFormSubmit = async (data: TransactionFormValues) => {
    setErrorMsg(null)
    try {
      if (editingTransaction?.id) {
        await updateMutation.mutateAsync({
          id: editingTransaction.id,
          data: data as unknown as UpdateTransactionDTO,
        })
      } else {
        await createMutation.mutateAsync({
          ...data,
          input_method: 'manual',
        } as unknown as CreateTransactionDTO)
      }
      closeForm()
    } catch (error: unknown) {
      setErrorMsg(getApiErrorMessage(error, 'Gagal menyimpan transaksi.'))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!txToDelete) return
    setErrorMsg(null)
    try {
      await deleteMutation.mutateAsync(txToDelete)
      setTxToDelete(null)
    } catch (error: unknown) {
      setErrorMsg(getApiErrorMessage(error, 'Gagal menghapus transaksi.'))
    }
  }

  return (
    <>
      <ChatbotModal isOpen={isChatbotModalOpen} onClose={closeChatbotModal} />

      <TransactionModals
        isFormOpen={useTransactionModalStore.getState().isFormOpen}
        onFormClose={() => {
          setErrorMsg(null)
          closeForm()
        }}
        editingTransaction={editingTransaction}
        onFormSubmit={handleFormSubmit}
        isFormLoading={createMutation.isPending || updateMutation.isPending}
        txToDelete={txToDelete}
        onDeleteClose={() => {
          setErrorMsg(null)
          setTxToDelete(null)
        }}
        onDeleteConfirm={handleDeleteConfirm}
        onRequestDelete={(id) => setTxToDelete(id)}
        isDeleteLoading={deleteMutation.isPending}
        errorMsg={errorMsg}
      />
    </>
  )
}
