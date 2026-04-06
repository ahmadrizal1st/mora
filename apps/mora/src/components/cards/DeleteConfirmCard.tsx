interface DeleteConfirmCardProps {
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function DeleteConfirmCard({
  title = 'Are you sure to delete this card?',
  message = 'If you delete this card, you will not be able to recover it.',
  onConfirm,
  onCancel,
}: DeleteConfirmCardProps) {
  return (
    <div className="card card-gradient card-gradient-danger">
      <div className="card-body p-5 text-center">
        <h3 className="card-title">{title}</h3>
        <p className="text-secondary">{message}</p>
        <div className="btn-list btn-list-center justify-content-center mt-5">
          <button className="btn btn-danger" onClick={onConfirm}>Yes, delete it</button>
          <button className="btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
