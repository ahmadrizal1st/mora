import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, AutosizeTextarea } from '@/shared/components/ui';
import { useProcessText } from '../hooks/useTracker';

export default function TrackerTextPage() {
  const [text, setText] = useState('');
  const processTextMutation = useProcessText();
  const navigate = useNavigate();

  const handleProcess = async () => {
    if (!text.trim()) return;

    try {
      await processTextMutation.mutateAsync({ text });
      
      // Navigate to transactions or show success
      // Since it's processed asynchronously, we might just navigate to a pending state
      // or to the transaction list where it will appear.
      navigate({ to: '/transactions' });
    } catch (error) {
      console.error('Failed to process text:', error);
      alert('Gagal memproses teks transaksi');
    }
  };

  return (
    <BaseLayout pageTitle="Track via Text">
      <div className="container-xl py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pt-4 px-4 px-md-5 d-block">
                <h2 className="card-title h2 fw-bold text-dark mb-0">Paste Transaction Text</h2>
                <div className="text-secondary small mt-1">
                  Paste SMS, bank notifications, or typed details to extract data
                </div>
              </div>
              <div className="card-body p-4 p-md-5">
                <div className="mb-4">
                  <label className="form-label fw-semibold">Transaction Details</label>
                  <AutosizeTextarea
                    placeholder="Example: Bayar bakso 25rb di malang kemarin"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                    className="form-control-lg"
                    style={{ minHeight: '150px' }}
                  />
                </div>
                
                <div className="d-grid">
                  <Button
                    text={processTextMutation.isPending ? 'Processing...' : 'Extract Transaction'}
                    color="primary"
                    size="lg"
                    loading={processTextMutation.isPending}
                    disabled={!text.trim() || processTextMutation.isPending}
                    onClick={handleProcess}
                  />
                </div>
                
                <div className="mt-4 p-3 bg-light rounded-2 small text-secondary">
                  <div className="fw-bold mb-1">Tips:</div>
                  <ul className="mb-0 ps-3">
                    <li>Include amount, category, and date if possible</li>
                    <li>You can paste multiple lines</li>
                    <li>AI will try to extract the merchant name automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
