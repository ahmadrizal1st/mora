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
  return (
    <div 
      className="card h-100 shadow-sm border-0 position-relative group cursor-pointer"
      onClick={() => onEdit(account)}
    >
      <div className="card-body p-4 d-flex flex-column" style={{ minHeight: '220px' }}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span 
              className="badge mb-1 fw-bold" 
              style={{ backgroundColor: `${account.color}15`, color: account.color, fontSize: '10px' }}
            >
              {account.type.replace('-', ' ').toUpperCase()}
            </span>
            <h3 className="card-title h3 mb-0 fw-bold">{account.name}</h3>
          </div>
          <div className="d-flex gap-2">
            <button 
              onClick={() => onEdit(account)}
              className="btn btn-icon btn-ghost-secondary btn-sm rounded-circle opacity-0 group-hover-opacity-100 transition-opacity"
              title="Edit Akun"
            >
              <Icon icon="pencil" size={14} />
            </button>
            <div 
              className="avatar avatar-md rounded-3 border-0 bg-transparent"
              style={{ color: account.color, backgroundColor: `${account.color}10` }}
            >
              <Icon icon={account.type === 'bank' ? 'building-bank' : account.type === 'cash' ? 'wallet' : account.type === 'e-wallet' ? 'device-mobile' : 'credit-card'} size={20} />
            </div>
          </div>
        </div>

        <div className="mt-2 mb-2">
          <div className="text-secondary small fw-medium">Saldo Saat Ini</div>
          <div className="h1 fw-bold mb-0" style={{ fontSize: '1.5rem', color: '#1d273b' }}>
            {formatCurrency(account.balance_raw, account.currency?.code)}
          </div>
        </div>

        {account.is_credit && (
          <div className="mt-3">
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-secondary">Limit: {formatCurrency(account.credit_limit, account.currency?.code)}</span>
              <span className="text-muted fw-bold">{(account.balance_raw / account.credit_limit * 100).toFixed(0)}%</span>
            </div>
            <div className="progress progress-xs">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${Math.min(100, (account.balance_raw / account.credit_limit * 100))}%`,
                  backgroundColor: account.color 
                }}
              ></div>
            </div>
          </div>
        )}

        <div style={{ height: '60px', margin: '0 -1.25rem -1.25rem -1.25rem' }} className="mt-auto rounded-bottom">
          <Chart
            chartId={`account-sparkline-${account.id}`}
            chartData={{
              type: 'area',
              sparkline: true,
              series: [{
                name: 'Saldo',
                data: account.history?.balance || [0, 0, 0],
                color: account.color
              }],
              strokeWidth: [2],
              fill: {
                opacity: 0,
              },
              categories: account.history?.labels || [],
              hideTooltip: false,
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
                padding: { top: 0, right: 0, bottom: -10, left: 0 } 
              },
              extend: {
                markers: {
                  size: 4,
                  strokeWidth: 2,
                  hover: { size: 6 }
                },
                tooltip: {
                  theme: 'dark',
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
            height={3.75}
          />
        </div>
      </div>
    </div>
  );
};
