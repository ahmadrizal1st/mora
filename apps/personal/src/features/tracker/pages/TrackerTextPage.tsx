import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, AutosizeTextarea, Icon } from '@/shared/components/ui';
import { useProcessText } from '../hooks/useTracker';

export default function TrackerTextPage() {
  const [text, setText] = useState('');
  const processTextMutation = useProcessText();
  const navigate = useNavigate();

  const handleProcess = async () => {
    if (!text.trim()) return;

    try {
      await processTextMutation.mutateAsync({ text, docType: 'expense' });
      navigate({ to: '/transactions' });
    } catch (error) {
      console.error('Failed to process text:', error);
    }
  };

  return (
    <BaseLayout
      pageTitle="Track via Text"
      pageDescription="AI akan otomatis mendeteksi tipe transaksi (Pemasukan/Pengeluaran) dari teks yang Anda masukkan."
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h3 className="card-title">Paste Transaction Text</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Transaction Details</label>
                <AutosizeTextarea
                  placeholder="Example: Bayar bakso 25rb di malang kemarin"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  className="form-control"
                  style={{ minHeight: '150px' }}
                />
                <small className="form-hint mt-2">
                  Tips: Masukkan jumlah, kategori, dan tanggal jika memungkinkan untuk akurasi lebih baik.
                </small>
              </div>

              {processTextMutation.isError && (
                <div className="alert alert-danger" role="alert">
                  <div className="d-flex">
                    <div>
                      <Icon icon="alert-circle" className="alert-icon" />
                    </div>
                    <div>
                      Gagal memproses teks transaksi. Silakan coba lagi.
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer text-end">
              <div className="d-flex align-items-center justify-content-between">
                <div className="text-secondary small">
                  <Icon icon="info-circle" size={14} className="me-1" />
                  Multiple lines supported
                </div>
                <div className="btn-list">
                  <Button
                    text="Clear"
                    variant="link"
                    color="secondary"
                    onClick={() => setText('')}
                    disabled={!text || processTextMutation.isPending}
                  />
                  <Button
                    text={processTextMutation.isPending ? 'Processing...' : 'Extract Transaction'}
                    color="primary"
                    loading={processTextMutation.isPending}
                    disabled={!text.trim() || processTextMutation.isPending}
                    onClick={handleProcess}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4 bg-primary-lt border-0">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <Icon icon="sparkles" size={24} className="text-primary me-3" />
                <div>
                  <div className="fw-bold text-primary">Magic Extraction</div>
                  <div className="text-secondary small">
                    AI kami akan mencoba mengenali nama merchant, kategori, dan jumlah secara otomatis.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
