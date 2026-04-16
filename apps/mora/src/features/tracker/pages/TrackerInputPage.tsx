import { useNavigate, useSearch } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Spinner, ErrorAlert } from '@/shared/components/ui';
import { TransactionForm, type TransactionFormValues } from '@/features/transaction/components/TransactionForm';
import { 
  useCreateTransaction, 
  useUpdateTransaction, 
  useTransaction 
} from '@/features/transaction/hooks/useTransactions';

export default function TrackerInputPage() {
  const search = useSearch({ from: '/tracker/input' });
  const id = search.id;
  const navigate = useNavigate();

  const { data: existingTx, isLoading: isLoadingTx, error: txError } = useTransaction(id as number);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const handleSubmit = async (data: TransactionFormValues) => {
    try {
      if (id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
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
    <BaseLayout pageTitle={id ? 'Edit Transaksi' : 'Tambah Transaksi'}>
      <div className="container-tight py-4">
        {txError && (
          <ErrorAlert 
            title="Gagal Memuat Data" 
            message="Data transaksi tidak ditemukan atau terjadi kesalahan." 
            className="mb-3"
          />
        )}
        
        <div className="card shadow-sm border-0">
          <div className="card-header">
            <h2 className="card-title h3 fw-bold text-secondary text-uppercase ls-1">
              {id ? 'Edit Transaksi' : 'Transaksi Manual'}
            </h2>
          </div>
          <div className="card-body p-3 p-md-5">
            <TransactionForm
              initialData={existingTx}
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

