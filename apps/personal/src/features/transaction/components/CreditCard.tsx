import React from 'react';
import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';

interface CreditCardProps {
  account: any;
  onEdit: (account: any) => void;
  onDelete: (id: number) => void;
}

export const CreditCard: React.FC<CreditCardProps> = ({ account, onEdit, onDelete }) => {
  const credit = account.credit;
  const utilization = credit?.limit > 0 ? (credit.total_amount / credit.limit) * 100 : 0;
  
  // Determine if background is light or dark to set text color
  const getContrastColor = (hexColor: string) => {
    if (!hexColor) return '#ffffff';
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180 ? '#1d273b' : '#ffffff';
  };

  const textColor = getContrastColor(account.color);
  const isDarkText = textColor === '#1d273b';
  const secondaryTextColor = isDarkText ? 'rgba(29, 39, 59, 0.6)' : 'rgba(255, 255, 255, 0.7)';
  const iconBgColor = isDarkText ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.15)';
  
  const accountIcon = account.type === 'bank' ? 'building-bank' : account.type === 'cash' ? 'wallet' : account.type === 'e-wallet' ? 'device-mobile' : 'credit-card';

  return (
    <div 
      className="card h-100 shadow-sm border-0 position-relative group cursor-pointer overflow-hidden transition-all hover-shadow-lg"
      onClick={() => onEdit(account)}
      style={{ 
        backgroundColor: account.color,
        color: textColor,
        borderRadius: '1.25rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Background Decoration - Circular shape and Large Icon */}
      <div 
        className="position-absolute" 
        style={{ 
          top: '-20px', 
          right: '-20px', 
          width: '140px', 
          height: '140px', 
          backgroundColor: iconBgColor, 
          borderRadius: '50%',
          zIndex: 0
        }} 
      />
      <div 
        className="position-absolute" 
        style={{ 
          top: '10px', 
          right: '10px', 
          zIndex: 1,
          opacity: isDarkText ? 0.1 : 0.2,
          transform: 'rotate(-10deg)'
        }}
      >
        <Icon icon={accountIcon} size={90} stroke={1.5} />
      </div>

      {/* Utilization Progress Bar (Subtle Top Line) */}
      <div 
        className="position-absolute top-0 start-0 h-1" 
        style={{ 
          width: `${Math.min(utilization, 100)}%`, 
          backgroundColor: utilization > 90 ? '#d63939' : isDarkText ? 'rgba(0,0,0,0.2)' : 'rgba(255, 255, 255, 0.4)',
          transition: 'width 0.5s ease',
          zIndex: 10
        }} 
      />

      <div className="card-body p-4 d-flex flex-column position-relative" style={{ minHeight: '220px', zIndex: 2 }}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <div 
              className="fw-bold text-uppercase mb-1" 
              style={{ color: secondaryTextColor, fontSize: '10px', letterSpacing: '1px' }}
            >
              {account.type.replace('-', ' ')}
            </div>
            <h3 className="card-title h3 mb-0 fw-bold" style={{ color: textColor }}>{account.name}</h3>
          </div>
          
          <div className="d-flex align-items-center gap-2">
             <div className="d-flex gap-1 opacity-0 group-hover-opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(account); }}
                  className="btn btn-icon btn-sm rounded-circle"
                  style={{ backgroundColor: iconBgColor, color: textColor, border: 'none' }}
                  title="Edit Profil"
                >
                  <Icon icon="pencil" size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(account.id); }}
                  className="btn btn-icon btn-sm rounded-circle"
                  style={{ backgroundColor: iconBgColor, color: textColor, border: 'none' }}
                  title="Hapus Profil"
                >
                  <Icon icon="trash" size={14} />
                </button>
             </div>
          </div>
        </div>

        <div className="mt-auto mb-4">
          <div style={{ color: secondaryTextColor, fontSize: '12px', fontWeight: 500 }}>Total Pinjaman</div>
          <div className="h1 fw-bold mb-0 mt-1" style={{ fontSize: '1.85rem', letterSpacing: '-0.5px', color: textColor }}>
            {formatCurrency(credit?.total_amount || 0)}
          </div>
        </div>

        <div className="row g-2">
          <div className="col-6">
            <div style={{ color: secondaryTextColor, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Limit Kredit</div>
            <div className="fw-bold" style={{ fontSize: '13px' }}>{formatCurrency(credit?.limit || 0)}</div>
          </div>
          <div className="col-6 text-end">
             {credit?.due_date && (
                <>
                  <div style={{ color: secondaryTextColor, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jatuh Tempo</div>
                  <div className="fw-bold" style={{ fontSize: '13px' }}>
                    {new Date(credit.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </div>
                </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

