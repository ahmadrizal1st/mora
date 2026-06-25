import React from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { Chart } from '@/shared/components/ui/Chart'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { useNavigate } from '@tanstack/react-router'
import type { Account } from '../types/transaction.types'

interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  isBalanceHidden?: boolean
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onEdit,
  isBalanceHidden = false,
}) => {
  const navigate = useNavigate()

  const getContrastColor = (hexColor: string) => {
    if (!hexColor) return '#ffffff'
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 180 ? '#1d273b' : '#ffffff'
  }

  const textColor = getContrastColor(account.color)
  const isDarkText = textColor === '#1d273b'
  const secondaryTextColor = isDarkText ? 'rgba(29, 39, 59, 0.6)' : 'rgba(255, 255, 255, 0.7)'
  const iconBgColor = isDarkText ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.15)'

  const accountIcon =
    account.account_type === 'bank'
      ? 'building-bank'
      : account.account_type === 'cash'
        ? 'wallet'
        : account.account_type === 'e-wallet'
          ? 'device-mobile'
          : 'credit-card'

  const handleCardClick = () => {
    navigate({ to: '/accounts/$accountId', params: { accountId: account.id }, search: { page: 1, per_page: 10 } })
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(account)
  }

  return (
    <div
      className="card h-100 shadow-sm border-0 position-relative group cursor-pointer overflow-hidden transition-all hover-shadow-lg"
      onClick={handleCardClick}
      style={{
        backgroundColor: account.color,
        color: textColor,
        borderRadius: '1.25rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        filter: account.is_archived ? 'grayscale(0.6) opacity(0.8)' : 'none',
      }}
    >
      <div
        className="position-absolute"
        style={{
          top: '-20px',
          right: '-20px',
          width: '140px',
          height: '140px',
          backgroundColor: iconBgColor,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <div
        className="position-absolute"
        style={{
          top: '10px',
          right: '10px',
          zIndex: 1,
          opacity: isDarkText ? 0.08 : 0.15,
          transform: 'rotate(-10deg)',
        }}
      >
        {account.provider?.logo_url ? (
          <img
            src={account.provider.logo_url}
            alt={account.provider.name}
            style={{
              width: '90px',
              height: '90px',
              objectFit: 'contain',
              filter: isDarkText ? 'none' : 'brightness(0) invert(1)',
            }}
          />
        ) : (
          <Icon icon={accountIcon} size={90} stroke={1.5} />
        )}
      </div>

      <div
        className="card-body p-4 d-flex flex-column position-relative"
        style={{ minHeight: '220px', zIndex: 2 }}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <div
              className="fw-bold text-uppercase mb-1"
              style={{ color: secondaryTextColor, fontSize: '10px', letterSpacing: '1px' }}
            >
              {account.account_type.replace('-', ' ')}
            </div>
            <h3 className="card-title h3 mb-0 fw-bold" style={{ color: textColor }}>
              {account.name}
            </h3>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-icon btn-sm border-0 shadow-none text-reset opacity-50 hover-opacity-100"
              style={{ backgroundColor: iconBgColor, borderRadius: '8px' }}
              onClick={handleEditClick}
              title="Edit Akun"
            >
              <Icon icon="edit" size={16} />
            </button>
            {account.provider?.logo_url && (
              <div
                className="bg-white p-1 rounded-circle d-flex shadow-sm"
                style={{ width: '32px', height: '32px' }}
              >
                <img
                  src={account.provider.logo_url}
                  alt=""
                  className="img-fluid rounded-circle"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 mb-2">
          <div style={{ color: secondaryTextColor, fontSize: '12px', fontWeight: 500 }}>
            Saldo Saat Ini
          </div>
          <div
            className="h1 fw-bold mb-0 mt-1 d-flex align-items-center"
            style={{ fontSize: '1.85rem', letterSpacing: '-0.5px', color: textColor }}
          >
            {isBalanceHidden
              ? 'Rp ••••••••'
              : formatCurrency(account.balance ?? 0, account.currency?.code)}
            {account.is_archived && (
              <span
                className="badge bg-dark-lt ms-2 border-0"
                style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
              >
                TERARSIP
              </span>
            )}
          </div>
        </div>

        <div
          style={{ height: '70px', margin: '0 -1.5rem -1.25rem -1.5rem' }}
          className="mt-auto rounded-bottom overflow-hidden"
        >
          <Chart
            chartId={`account-sparkline-${account.id}`}
            chartData={{
              type: 'line',
              sparkline: true,
              series: [
                {
                  name: 'Pemasukan',
                  data: account.history?.income || [0, 0, 0],
                  color: '#ffffff',
                },
                {
                  name: 'Pengeluaran',
                  data: account.history?.expense || [0, 0, 0],
                  color: '#000000',
                },
              ],
              strokeWidth: [2, 2],
              strokeDash: [0, 4],
              fill: {
                opacity: 1,
              },
              categories: account.history?.labels || [],
              hideTooltip: true,
              hidePoints: true,
              showMarkers: false,
              xaxis: {
                tooltip: { enabled: false },
                labels: { show: false },
                axisBorder: { show: false },
                axisTicks: { show: false },
              },
              yaxis: {
                tooltip: { enabled: false },
                labels: { show: false },
              },
              legend: false,
              grid: {
                show: false,
                padding: { top: 15, right: 0, bottom: 10, left: 0 },
              },
              extend: {
                stroke: {
                  curve: 'smooth',
                  width: [2, 1.5],
                  dashArray: [0, 4],
                },
                markers: {
                  size: 0,
                  hover: { size: 3 },
                },
                tooltip: {
                  theme: isDarkText ? 'light' : 'dark',
                  shared: true,
                  intersect: false,
                  container: 'body',
                  x: {
                    show: true,
                    formatter: (_val: unknown, { dataPointIndex }: { dataPointIndex: number }) => {
                      const label = account.history?.labels?.[dataPointIndex]
                      if (!label) return _val
                      const date = new Date(label)
                      if (isNaN(date.getTime())) return label
                      return date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    },
                  },
                  y: {
                    formatter: (val: number) => formatCurrency(val),
                  },
                },
              },
            }}
            height={4.375}
          />
        </div>
      </div>
    </div>
  )
}
