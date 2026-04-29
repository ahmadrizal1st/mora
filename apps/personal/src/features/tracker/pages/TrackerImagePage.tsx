import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Dropzone } from '@/shared/components/ui';

export default function TrackerImagePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleProcess = async () => {
    setIsProcessing(true);
    // Simulate OCR processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);

    navigate({ to: '/tracker/input' });
  };

  return (
    <BaseLayout pageTitle="Upload Receipt Image">
      <div className="container-xl py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pt-4 px-4 px-md-5 d-block">
                <h2 className="card-title h2 fw-bold text-dark mb-0">Upload Receipt</h2>
                <div className="text-secondary small mt-1">
                  Upload a photo of your receipt to scan with AI
                </div>
              </div>
              <div className="card-body p-4 p-md-5">
                <div className="mb-4">
                  <Dropzone 
                    text="Click or drag receipt image here" 
                    description="Supports JPG, PNG (Max 5MB)"
                    className="py-5"
                  />
                </div>
                
                <div className="d-grid">
                  <Button
                    text={isProcessing ? 'Scanning with AI...' : 'Start Scanning'}
                    color="success"
                    size="lg"
                    loading={isProcessing}
                    disabled={isProcessing}
                    onClick={handleProcess}
                  />
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-muted small">
                    Make sure the photo is clear and well-lit for better results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
