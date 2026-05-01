import { Modal, ModalHeader } from '@/shared/components/ui/Modal';
import { TransactionForm, type TransactionFormValues } from './TransactionForm';
import { Icon, Button } from '@/shared/components/ui';
import type { Transaction } from '../types/transaction.types';

interface TransactionModalsProps {
  isFormOpen: boolean;
  onFormClose: () => void;
  editingTransaction: Transaction | undefined;
  onFormSubmit: (data: TransactionFormValues) => Promise<void>;
  isFormLoading: boolean;
  txToDelete: string | null;
  onDeleteClose: () => void;
  onDeleteConfirm: () => Promise<void>;
  isDeleteLoading: boolean;
}

export const TransactionModals: React.FC<TransactionModalsProps> = ({
  isFormOpen,
  onFormClose,
  editingTransaction,
  onFormSubmit,
  isFormLoading,
  txToDelete,
  onDeleteClose,
  onDeleteConfirm,
  isDeleteLoading,
}) => {
  return (
    <>
      {/* Responsive Transaction Modal */}
      <Modal
        show={isFormOpen}
        scrollable
        size="lg"
      >
        <ModalHeader
          title={editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
          onClose={onFormClose}
        />
        <div className="modal-body p-4">
          <TransactionForm
            key={editingTransaction?.id || 'new'}
            initialData={editingTransaction}
            onSubmit={onFormSubmit}
            onCancel={onFormClose}
            isLoading={isFormLoading}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={!!txToDelete} onClose={onDeleteClose} size="sm">
        <ModalHeader title="Konfirmasi Penghapusan" onClose={onDeleteClose} />
        <div className="modal-body text-center py-4">
          <Icon icon="alert-triangle" size={48} className="text-danger mb-3" />
          <h3>Hapus Transaksi?</h3>
          <div className="text-secondary mb-3">
            Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi saldo akun terkait.
          </div>
          
          <div className="d-flex gap-2">
            <Button className="flex-fill" onClick={onDeleteClose}>
              Batal
            </Button>
            <Button
              color="danger"
              className="flex-fill fw-bold"
              onClick={onDeleteConfirm}
              loading={isDeleteLoading}
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
