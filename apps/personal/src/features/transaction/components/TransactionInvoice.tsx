import React, { useState } from 'react';
import { 
  IconReceipt, IconCalendarEvent, IconCategory, IconWallet, 
  IconBuildingStore, IconArrowLeft, IconDownload, IconShare, IconPencil,
} from '@tabler/icons-react';
import type { Transaction } from '../types/transaction.types';

export interface TransactionInvoiceProps {
  transaction: Transaction;
  onClose: () => void;
  onEdit?: (transaction: Transaction) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string, format?: 'date' | 'time' | 'full') => string;
}

export const TransactionInvoice = ({
  transaction,
  onClose,
  onEdit,
  formatCurrency,
  formatDate,
}: TransactionInvoiceProps) => {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const amountStr = formatCurrency(transaction.amount);
  const txFullDate = formatDate(transaction.tx_date, 'full');
  
  const merchantName = (transaction.dynamic_fields?.merchant_name as string) || transaction.merchant || (transaction.type === 'transfer' ? 'Transfer Dana' : 'Umum');
  const referenceNo = (transaction.dynamic_fields?.ref_no as string) || `REF-${transaction.id.substring(0, 8).toUpperCase()}`;

  const notes = transaction.notes || '';
  const isLongNotes = notes.length > 80;
  const displayNotes = isNotesExpanded || !isLongNotes ? notes : notes.slice(0, 80) + '...';

  return (
    <div className="d-flex flex-column text-body p-3 py-lg-5 px-lg-3 align-items-center invoice-container-desktop" style={{ backgroundColor: '#ff7a00', minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <div className="position-relative d-flex align-items-center justify-content-between pt-2 pb-4 w-100" style={{ maxWidth: 600 }}>
        <button className="bg-transparent text-white d-flex align-items-center justify-content-center p-0" onClick={onClose} style={{ width: 44, height: 44, borderRadius: 14, border: '1.5px solid rgba(255, 255, 255, 0.4)' }}>
          <IconArrowLeft color="white" stroke={2.5} />
        </button>
        <h1 className="position-absolute start-50 translate-middle-x text-white fw-semibold m-0 text-nowrap" style={{ fontSize: 18 }}>Detail Transaksi</h1>
        <div className="d-flex align-items-center">
          {onEdit && (
            <button className="bg-transparent text-white d-flex align-items-center justify-content-center p-0 me-2" onClick={() => onEdit(transaction)} style={{ width: 44, height: 44, borderRadius: 14, border: '1.5px solid rgba(255, 255, 255, 0.4)' }}>
              <IconPencil color="white" size={20} stroke={2.5} />
            </button>
          )}
          <button className="bg-transparent text-white d-flex align-items-center justify-content-center p-0" style={{ width: 44, height: 44, borderRadius: 14, border: '1.5px solid rgba(255, 255, 255, 0.4)' }}>
            <IconShare color="white" size={24} stroke={2.5} />
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="position-relative d-flex flex-column flex-grow-1 mt-5 w-100" style={{ maxWidth: 600, filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.1))' }}>
        {/* Top Floating Icon */}
        <div className="position-absolute start-50 translate-middle-x rounded-circle d-flex align-items-center justify-content-center z-2" style={{ top: -45, width: 90, height: 90, backgroundColor: '#ff7a00', boxShadow: '0 0 0 10px white' }}>
          <div>
            <img src="/static/illustrations/icons/approve.png" alt="Verified" className="rounded-circle" style={{ width: 100, height: 100, objectFit: 'contain' }} />
          </div>
        </div>

        <div className="d-flex flex-column flex-grow-1">
          <div className="bg-white px-4" style={{ paddingTop: 64, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <h2 className="text-center fw-bold text-dark mb-2" style={{ fontSize: 22 }}>Transaksi Berhasil</h2>
            <p className="text-center text-secondary mb-3" style={{ fontSize: 14 }}>Detail transaksi Anda telah dicatat.</p>

            <div className="d-flex align-items-center my-3">
              <div className="flex-grow-1" style={{ borderTop: '1px dashed #ffce9e' }}></div>
            </div>

            <div className="d-flex flex-column gap-2">
              <InfoItem icon={<IconReceipt size={20} color="#ff7a00" />} label="No. Referensi" value={referenceNo} />
              <InfoItem icon={<IconCalendarEvent size={20} color="#ff7a00" />} label="Tanggal" value={txFullDate} />
              <InfoItem icon={<IconCategory size={20} color="#ff7a00" />} label="Kategori" value={transaction.category?.name || 'Umum'} />
              <InfoItem icon={<IconWallet size={20} color="#ff7a00" />} label="Metode" value={transaction.type === 'income' ? 'Pemasukan' : transaction.type === 'expense' ? 'Pengeluaran' : 'Transfer'} />
            </div>
          </div>

          {/* Semicircle Cutouts and Divider */}
          <div className="d-flex align-items-center px-4" style={{ paddingBottom: 16, paddingTop: 16, backgroundImage: 'radial-gradient(circle at 0px 50%, transparent 12px, white 12.5px), radial-gradient(circle at 100% 50%, transparent 12px, white 12.5px)', backgroundPosition: 'left center, right center', backgroundSize: '51% 100%, 51% 100%', backgroundRepeat: 'no-repeat', backgroundColor: 'transparent' }}>
            <div className="flex-grow-1" style={{ borderTop: '1px dashed #ffce9e' }}></div>
          </div>

          <div className="bg-white px-4 pb-2 flex-grow-1">
            <div className="mb-3">
              <h3 className="fw-bolder text-dark mb-3" style={{ fontSize: 15 }}>Informasi Pembayaran</h3>
              <div className="d-flex align-items-start gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44, background: '#fff0e0' }}>
                  <IconBuildingStore size={24} color="#ff7a00" />
                </div>
                <div>
                  <strong className="d-block fw-bold text-dark mb-1" style={{ fontSize: 14 }}>{merchantName}</strong>
                  <p className="text-secondary m-0" style={{ fontSize: 12, lineHeight: 1.4 }}>Sumber Dana: {transaction.account?.name || '-'}</p>
                  {notes && (
                    <div className="mt-1">
                      <p className="text-secondary m-0" style={{ fontSize: 12, lineHeight: 1.4 }}>
                        Catatan: {displayNotes}
                      </p>
                      {isLongNotes && (
                        <button 
                          className="btn btn-link p-0 text-decoration-none mt-1 border-0 bg-transparent fw-semibold" 
                          style={{ fontSize: 12, color: '#ff7a00' }}
                          onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                        >
                          {isNotesExpanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <table className="w-100" style={{ borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th className="fw-semibold text-muted py-2 px-2 text-start" style={{ backgroundColor: '#fff5ec', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>Item</th>
                    <th className="fw-semibold text-muted py-2 px-2 text-center" style={{ backgroundColor: '#fff5ec' }}>Qty</th>
                    <th className="fw-semibold text-muted py-2 px-2 text-end" style={{ backgroundColor: '#fff5ec', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-dark fw-medium py-3 px-2 text-start" style={{ borderBottom: '1px solid white' }}>{merchantName}</td>
                    <td className="text-dark fw-medium py-3 px-2 text-center" style={{ borderBottom: '1px solid white' }}>1</td>
                    <td className="text-dark fw-medium py-3 px-2 text-end" style={{ borderBottom: '1px solid white' }}>{amountStr}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-3" style={{ paddingLeft: '30%' }}>
              <div className="d-flex justify-content-between mb-2 text-secondary" style={{ fontSize: 13 }}>
                <span>Subtotal</span>
                <span className="fw-semibold text-dark">{amountStr}</span>
              </div>
              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1" style={{ borderTop: '1px solid #ffce9e' }}></div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="fw-bolder text-dark" style={{ fontSize: 14 }}>Total Transaksi</span>
                <span className="fw-bolder" style={{ fontSize: 20, color: '#ff7a00' }}>{amountStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zigzag Bottom Edge */}
        <div className="w-100" style={{ height: 16, backgroundColor: 'transparent', backgroundImage: 'radial-gradient(circle at 50% 100%, transparent 12px, white 12.5px)', backgroundSize: '40px 16px', backgroundPosition: 'bottom', backgroundRepeat: 'repeat-x' }}></div>
      </div>

      {/* Bottom Button */}
      <div className="mt-4 w-100" style={{ maxWidth: 600 }}>
        <button className="btn w-100 d-flex align-items-center justify-content-center gap-2 text-white fw-semibold shadow-sm" style={{ background: '#ff7a00', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12, padding: 16, fontSize: 16 }}>
          <IconDownload size={20} stroke={2.5} />
          <span>Unduh PDF</span>
        </button>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="d-flex align-items-center">
    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3" style={{ width: 40, height: 40, background: '#fff0e0' }}>
      {icon}
    </div>
    <span className="text-secondary flex-grow-1" style={{ fontSize: 13 }}>{label}</span>
    <span className="text-body fw-medium mx-2">:</span>
    <span className="fw-bold text-dark" style={{ fontSize: 13, flex: 1.5, wordBreak: 'break-all' }}>{value}</span>
  </div>
);