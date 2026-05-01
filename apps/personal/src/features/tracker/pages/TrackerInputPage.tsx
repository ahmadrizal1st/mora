import { useNavigate, useSearch } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Spinner, ErrorAlert } from '@/shared/components/ui';
import { TransactionForm, type TransactionFormValues } from '@/features/transaction/components/TransactionForm';
import { 
  useCreateTransaction, 
  useUpdateTransaction, 
  useTransaction 
} from '@/features/transaction/hooks/useTransactions';
import type { Transaction } from '@/features/transaction/types/transaction.types';

export default function TrackerInputPage() {
  const search = useSearch({ from: '/tracker/input' });
  const id = search.id;
  const navigate = useNavigate();

  const { data: existingTx, isLoading: isLoadingTx, error: txError } = useTransaction(id as string);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  // Create pre-filled data if coming from a tracker
  const preFilledData = !id ? {
    merchant: search.merchant || '',
    amount_raw: search.amount || 0,
    notes: search.text || '',
    type: 'expense' as const,
    tx_date: new Date().toISOString().split('T')[0],
  } : undefined;

  const handleSubmit = async (data: TransactionFormValues) => {
    try {
      if (id) {
        await updateMutation.mutateAsync({ id: id as string, data });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createMutation.mutateAsync({ ...data, input_method: 'manual' } as any);
      }
      navigate({ to: '/transactions' });
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  if (id && isLoadingTx) {
    return (
      <BaseLayout pageTitle={id ? 'Edit Transaksi' : 'Tambah Transaksi'}>
        <div className="container-tight py-4 text-center">
          <Spinner /> Memuat data transaksi...
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      pageTitle={id ? 'Edit Transaction' : 'Manual Entry'}
      pageDescription={id ? 'Perbarui detail transaksi Anda.' : 'Lengkapi detail transaksi di bawah ini secara manual.'}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-9 col-xl-8">
          {txError && (
            <div className="mb-3">
              <ErrorAlert 
                message="Gagal Memuat Data: Data transaksi tidak ditemukan atau terjadi kesalahan." 
              />
            </div>
          )}
          
          <div className="card shadow-sm">
            <div className="card-header">
              <h3 className="card-title">
                {id ? 'Transaction Details' : 'New Transaction'}
              </h3>
            </div>
            <div className="card-body">
              <TransactionForm
                initialData={existingTx || (preFilledData as Partial<Transaction>)}
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

