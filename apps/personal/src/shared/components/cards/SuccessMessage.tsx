// src/components/cards/SuccessMessage.tsx
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

interface SuccessMessageProps {
  title?: string;
  message?: string;
  onContinue?: () => void;
}

export function SuccessMessageCard({
  title = 'Success!',
  message = 'Your changes have been saved successfully.',
  onContinue,
}: SuccessMessageProps) {
  return (
    <div className="card card-gradient card-gradient-success">
      <div className="card-body p-5 text-center">
        <div className="mb-3">
          <Icon icon="circle-check" className="icon-lg" color="success" />
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="text-secondary">{message}</p>
        <div className="btn-list btn-list-center justify-content-center mt-5">
          <Button text="Continue" color="success" onClick={onContinue} />
        </div>
      </div>
    </div>
  );
}