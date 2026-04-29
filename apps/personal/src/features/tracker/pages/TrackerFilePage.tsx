import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Dropzone } from '@/shared/components/ui';

export default function TrackerFilePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleProcess = async () => {
    setIsProcessing(true);
    // Simulate document processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsProcessing(false);

    navigate({ to: '/tracker/input' });
  };

  return (
    <BaseLayout pageTitle="Upload Document">
      <div className="container-xl py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pt-4 px-4 px-md-5 d-block">
                <h2 className="card-title h2 fw-bold text-dark mb-0">Upload Invoice/Statement</h2>
                <div className="text-secondary small mt-1">
                  Import PDF or Word documents to extract transaction data
                </div>
              </div>
              <div className="card-body p-4 p-md-5">
                <div className="mb-4">
                  <Dropzone 
                    text="Click or drag PDF/DOC file here" 
                    description="Supports PDF, DOCX (Max 10MB)"
                    className="py-5"
                  />
                </div>
                
                <div className="d-grid">
                  <Button
                    text={isProcessing ? 'Processing Document...' : 'Import Data'}
                    color="danger"
                    size="lg"
                    loading={isProcessing}
                    disabled={isProcessing}
                    onClick={handleProcess}
                  />
                </div>
                
                <div className="mt-4 p-3 bg-light rounded-2 small text-secondary">
                  <div className="fw-bold mb-1">Supported Files:</div>
                  <ul className="mb-0 ps-3">
                    <li>Digital PDF Invoices</li>
                    <li>Bank E-Statements</li>
                    <li>Excel/CSV exports</li>
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
