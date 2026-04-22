import React from 'react';
import { Icon } from '@/shared/components/ui/Icon';
import { Chart } from '@/shared/components/ui/Chart';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import type { Account } from '../types/transaction.types';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit }) => {
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
  const chartColor = isDarkText ? 'rgba(29, 39, 59, 0.5)' : 'rgba(255, 255, 255, 0.6)';

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
          opacity: isDarkText ? 0.08 : 0.15,
          transform: 'rotate(-10deg)'
        }}
      >
        <Icon icon={accountIcon} size={90} stroke={1.5} />
      </div>

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
          <div className="d-flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(account); }}
              className="btn btn-icon btn-sm rounded-circle opacity-0 group-hover-opacity-100 transition-opacity"
              style={{ backgroundColor: iconBgColor, color: textColor, border: 'none' }}
              title="Edit Akun"
            >
              <Icon icon="pencil" size={14} />
            </button>
          </div>
        </div>

        <div className="mt-2 mb-2">
          <div style={{ color: secondaryTextColor, fontSize: '12px', fontWeight: 500 }}>Saldo Saat Ini</div>
          <div className="h1 fw-bold mb-0 mt-1" style={{ fontSize: '1.85rem', letterSpacing: '-0.5px', color: textColor }}>
            {formatCurrency(account.balance_raw ?? 0, account.currency?.code)}
          </div>
        </div>

        <div style={{ height: '70px', margin: '0 -1.5rem -1.5rem -1.5rem' }} className="mt-auto rounded-bottom overflow-hidden">
          <Chart
            chartId={`account-sparkline-${account.id}`}
            chartData={{
              type: 'bar',
              sparkline: true,
              series: [{
                name: 'Saldo',
                data: account.history?.balance || [0, 0, 0],
                color: chartColor
              }],
              fill: {
                opacity: 0.8,
              },
              categories: account.history?.labels || [],
              hideTooltip: true,
              hidePoints: false,
              showMarkers: false,
              xaxis: {
                tooltip: { enabled: false },
                labels: { show: false },
                axisBorder: { show: false },
                axisTicks: { show: false }
              },
              yaxis: {
                tooltip: { enabled: false },
                labels: { show: false }
              },
              legend: false,
              grid: { 
                show: false,
                padding: { top: 15, right: 0, bottom: 0, left: 0 } 
              },
              extend: {
                plotOptions: {
                  bar: {
                    columnWidth: '60%',
                    borderRadius: 2
                  }
                },
                markers: {
                  size: 0,
                  strokeWidth: 2,
                  hover: { size: 4 }
                },
                tooltip: {
                  theme: isDarkText ? 'light' : 'dark',
                  fixed: {
                    enabled: false
                  },
                  container: 'body',
                  x: { 
                    show: true,
                    formatter: (_val: any, { dataPointIndex }: any) => {
                      const label = account.history?.labels?.[dataPointIndex];
                      if (!label) return _val;
                      const date = new Date(label);
                      if (isNaN(date.getTime())) return label;
                      return date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      });
                    }
                  },
                  y: {
                    title: { formatter: () => 'Saldo: ' },
                    formatter: (val: number) => formatCurrency(val)
                  },
                  marker: { show: true }
                }
              }
            }}
            height={4.375}
          />
        </div>
      </div>
    </div>
  );
};
