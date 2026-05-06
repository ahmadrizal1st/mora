import { type FC } from 'react';
import { useTransactionModalStore } from '../store/useTransactionModalStore';
import { useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '../hooks/useTransactions';
import { RadialTransactionMenu } from './RadialTransactionMenu';
import { TransactionModals } from './TransactionModals';
import type { TransactionFormValues } from './TransactionForm';
import { getApiErrorMessage } from '@/shared/utils/errorUtils';

export const GlobalTransactionModals: FC = () => {
  const { 
    closeForm, 
    editingTransaction, 
    openForm,
    txToDelete,
    setTxToDelete
  } = useTransactionModalStore();

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleFormSubmit = async (data: TransactionFormValues) => {
    try {
      if (editingTransaction) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateMutation.mutateAsync({ id: editingTransaction.id, data: data as any });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createMutation.mutateAsync({ ...data, input_method: 'manual' } as any);
      }
      closeForm();
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Gagal menyimpan transaksi.'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!txToDelete) return;
    try {
      await deleteMutation.mutateAsync(txToDelete);
      setTxToDelete(null);
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Gagal menghapus transaksi.'));
    }
  };

  return (
    <>
      <RadialTransactionMenu />

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
  );
};
