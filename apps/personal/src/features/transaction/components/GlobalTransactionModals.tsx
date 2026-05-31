import { type FC } from 'react'
import { useTransactionModalStore } from '../store/useTransactionModalStore'
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '../hooks/useTransactions'
import { DesktopRadialMenu } from './DesktopRadialMenu'
import { MobileRadialMenu } from './MobileRadialMenu'
import { TransactionModals } from './TransactionModals'
import type { TransactionFormValues } from './TransactionForm'
import { getApiErrorMessage } from '@/shared/utils/errorUtils'

export const GlobalTransactionModals: FC = () => {
  const { closeForm, editingTransaction, txToDelete, setTxToDelete } = useTransactionModalStore()

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
      <DesktopRadialMenu />
      <MobileRadialMenu />

      <TransactionModals
        isFormOpen={useTransactionModalStore.getState().isFormOpen}
        onFormClose={closeForm}
        editingTransaction={editingTransaction}
        onFormSubmit={handleFormSubmit}
        isFormLoading={createMutation.isPending || updateMutation.isPending}
        txToDelete={txToDelete}
        onDeleteClose={() => setTxToDelete(null)}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleteLoading={deleteMutation.isPending}
      />
    </>
  )
}
