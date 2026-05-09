import React, { useState } from 'react';
import { Icon, Button } from '@/shared/components/ui';
import type { Transaction } from '../types/transaction.types';

interface TransactionInvoiceProps {
  transaction: Transaction;
  onClose: () => void;
  onEdit?: (tx: Transaction) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string, type?: 'date' | 'full') => string;
}

export const TransactionInvoice: React.FC<TransactionInvoiceProps> = ({
  transaction,
  onClose,
  onEdit,
  formatCurrency,
  formatDate,
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const amountStr = formatCurrency(transaction.amount);
  const merchantName = transaction.merchant || (transaction.type === 'transfer' ? 'Transfer Dana' : 'Umum');
  const txFullDate = formatDate(transaction.tx_date, 'full');
  const referenceNo = (transaction.dynamic_fields?.ref_no as string) || `REF-${transaction.id.substring(0, 8).toUpperCase()}`;

  // Resolve Category Icon
  const categoryIcon = transaction.category?.icon || 'check';

  return (
    <div className="invoice-container">
      <div className="invoice-wrapper animate-in">
        {/* Header */}
        <header className="invoice-header">
          <button className="btn-header-action" onClick={onClose} type="button">
            <Icon icon="chevron-left" size={24} />
          </button>
          {onEdit ? (
            <button className="btn-header-action" onClick={() => onEdit(transaction)} type="button">
              <Icon icon="pencil" size={20} />
            </button>
          ) : (
            <div style={{ width: '40px' }} />
          )}
        </header>

        {/* Receipt Card Content */}
        <div className="receipt-body">
          <div className="watermark-pattern" />
          
          {/* Status Header */}
          <section className="status-header text-center">
            <div className="status-icon-box mx-auto">
               <Icon icon={categoryIcon as string} size={36} color="white" stroke={2.5} />
            </div>
            <h2 className="status-text mt-4">
              {transaction.type === 'income' ? 'Transfer Berhasil' : 'Pembayaran Berhasil'}
            </h2>
            <p className="text-secondary small fw-bold opacity-75">{txFullDate}</p>
          </section>

          {/* Amount Display */}
          <section className="amount-hero-box text-center">
            <span className="amount-label">TOTAL TRANSAKSI</span>
            <h1 className="amount-value">{amountStr}</h1>
          </section>

          {/* Details Table */}
          <section className="details-card w-100">
            <div className="detail-item py-3">
              <span className="label">Penerima / Merchant</span>
              <span className="value fw-bold text-dark">{merchantName}</span>
            </div>
            
            <div className="detail-item py-3">
              <span className="label">Sumber Dana</span>
              <div className="value fw-bold text-dark d-flex align-items-center justify-content-end gap-2">
                <span className="status-dot" style={{ background: transaction.account?.color || '#fd7e14' }} />
                {transaction.account?.name}
              </div>
            </div>

            <div className="detail-item py-3 border-bottom-0">
              <span className="label">Nomor Referensi</span>
              <span className="value fw-bold text-dark font-monospace">{referenceNo}</span>
            </div>

            {/* Expanded Details */}
            <div className={`collapse-content ${showDetails ? 'show' : ''}`}>
              <div className="detail-item py-3 border-top">
                <span className="label">Kategori</span>
                <span className="value fw-bold text-dark">{transaction.category?.name || 'General'}</span>
              </div>
              <div className="detail-item py-3">
                <span className="label">Metode Transaksi</span>
                <span className="value fw-bold text-dark text-capitalize">{transaction.type}</span>
              </div>
              
              {transaction.notes && (
                <div className="notes-wrapper mt-3">
                  <div className="notes-divider">
                    <span className="small text-uppercase fw-bold opacity-30 tracking-widest">Catatan</span>
                  </div>
                  <div className="notes-content p-3 bg-light rounded-3">
                    <span className="text-dark small lh-base d-block">{transaction.notes}</span>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="btn-view-toggle mt-4" 
              onClick={() => setShowDetails(!showDetails)}
              type="button"
            >
              <span>{showDetails ? 'Sembunyikan Detail' : 'Lihat Detail Selengkapnya'}</span>
              <Icon icon={showDetails ? 'chevron-up' : 'chevron-down'} size={14} />
            </button>
          </section>

          {/* Verification Badge */}
          <div className="verification-badge mt-5">
            <Icon icon="shield-check" size={16} />
            <span>TRANSAKSI AMAN TERVERIFIKASI</span>
          </div>

          {/* Serrated Edge Decoration */}
          <div className="serrated-bottom" />
        </div>

        <footer className="invoice-footer p-4 border-top bg-surface">
          <div className="d-flex flex-column gap-3 w-100">
            <Button 
              block 
              color="primary" 
              size="lg"
              onClick={onClose}
              element="button"
            >
              Selesai
            </Button>
            <div className="d-flex gap-3">
              <Button 
                block 
                icon="share"
                size="lg"
                element="button"
              >
                Bagikan
              </Button>
              <Button 
                block 
                icon="download"
                size="lg"
                element="button"
              >
                Unduh
              </Button>
            </div>
          </div>
        </footer>

        <style>{`
        :root {
          --mora-primary: #ff6b00;
          --mora-primary-soft: #fff4ed;
          --mora-success: #22c55e;
          --mora-success-soft: #f0fdf4;
          --mora-text-dark: #1e293b;
          --mora-text-muted: #64748b;
          --mora-border: #f1f5f9;
        }

        [data-bs-theme="dark"] {
          --mora-primary-soft: rgba(255, 107, 0, 0.1);
          --mora-success-soft: rgba(34, 197, 94, 0.1);
          --mora-text-dark: #f1f5f9;
          --mora-text-muted: #94a3b8;
          --mora-border: rgba(255, 255, 255, 0.08);
        }

        .invoice-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          z-index: 9999;
          overflow-y: auto;
          overscroll-behavior: contain;
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-overflow-scrolling: touch;
          padding: 2rem 1rem; /* Desktop padding */
        }

        .invoice-wrapper {
          width: 100%;
          max-width: 480px;
          background: var(--tblr-bg-surface);
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.7);
          border-radius: 24px;
          overflow: hidden;
          margin: 0 auto;
          min-height: auto;
        }

        @media (max-width: 576px) {
          .invoice-container {
            padding: 0;
            background: var(--tblr-bg-surface); /* Responsive background on mobile */
          }
          .invoice-wrapper {
            max-width: 100%;
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
            margin: 0;
          }
          .serrated-bottom {
            display: none; /* Hide serrated edge on full-screen mobile */
          }
        }

        .invoice-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: var(--tblr-bg-surface);
          border-bottom: 1px solid var(--mora-border);
        }

        .btn-header-action {
          background: none;
          border: none;
          outline: none !important;
          box-shadow: none !important;
          color: var(--mora-primary);
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .branding-name {
          font-size: 1.1rem;
          color: var(--mora-primary);
          letter-spacing: -0.5px;
        }

        .receipt-body {
          flex: 1;
          padding: 2.5rem 1.5rem 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .watermark-pattern {
          position: absolute;
          inset: -100%;
          width: 300%;
          height: 300%;
          opacity: 0.05;
          pointer-events: none;
          background-image: url("/logo/logo-nobg-fill.png");
          background-repeat: repeat;
          background-size: 100px auto;
          filter: sepia(100%) saturate(1200%) hue-rotate(350deg) brightness(95%);
          transform: rotate(-25deg);
          transform-origin: center;
          z-index: 0;
        }

        .status-header {
          position: relative;
          z-index: 1;
          width: 100%;
        }

        .status-icon-box {
          background: var(--mora-success);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.25);
          border: 6px solid var(--mora-success-soft);
        }

        .status-text {
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--mora-text-dark);
          letter-spacing: -0.5px;
        }

        .amount-hero-box {
          position: relative;
          z-index: 1;
          background: var(--mora-primary-soft);
          border-radius: 20px;
          padding: 1.75rem;
          margin: 2rem 0;
          width: 100%;
          border: 1px solid rgba(255, 107, 0, 0.1);
        }

        .amount-label {
          display: block;
          color: var(--mora-primary);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 0.75rem;
          opacity: 0.7;
        }

        .amount-value {
          color: var(--mora-primary);
          font-weight: 900;
          font-size: 3rem;
          margin: 0;
          letter-spacing: -1.5px;
        }

        .details-card {
          position: relative;
          z-index: 1;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--mora-border);
        }

        .detail-item .label {
          color: var(--mora-text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .detail-item .value {
          color: var(--mora-text-dark);
          text-align: right;
        }

        .notes-wrapper {
          width: 100%;
        }

        .notes-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          position: relative;
        }
        .notes-divider::before, .notes-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--mora-border);
          margin: 0 1rem;
        }

        .notes-content {
          text-align: left;
          word-break: break-word;
          white-space: pre-wrap;
          background: var(--tblr-bg-surface-secondary) !important;
        }

        .btn-view-toggle {
          width: 100%;
          background: none;
          border: none;
          outline: none !important;
          box-shadow: none !important;
          color: var(--mora-primary);
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .collapse-content {
          max-height: 0;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
        }
        .collapse-content.show {
          max-height: 1200px;
          opacity: 1;
        }

        .verification-badge {
          position: relative;
          z-index: 1;
          background: var(--mora-success-soft);
          padding: 0.75rem 1.5rem;
          border-radius: 40px;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--mora-success);
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          border: 1px solid rgba(34, 197, 94, 0.1);
        }

        .serrated-bottom {
          height: 12px;
          width: 100%;
          background: var(--tblr-bg-surface);
          position: absolute;
          bottom: -12px;
          left: 0;
          background-image: radial-gradient(circle, transparent 70%, var(--tblr-bg-surface) 70%);
          background-size: 16px 16px;
          background-position: 0 -8px;
        }

        .btn-action-outline {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          border: 2px solid var(--tblr-border-color);
          background: var(--tblr-bg-surface);
          color: var(--mora-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none !important;
          transition: all 0.2s;
        }
        .btn-action-outline:hover { border-color: var(--mora-primary); color: var(--mora-primary); }

        .btn-action-primary {
          background: var(--mora-primary);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-weight: 900;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.2s;
          outline: none !important;
          box-shadow: 0 8px 20px rgba(255, 107, 0, 0.2);
        }
        .btn-action-primary:active { transform: scale(0.98); }

        .animate-in {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
    </div>
  );
};







