import React, { useContext } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { PlanningContext } from '../../pages/PlanningLayout'

export function EmergencyFundCard() {
  const { goalsData } = useContext(PlanningContext)
  const goals = goalsData?.goals || []
  
  const emergencyFund = goals.find((g: any) => g.name.toLowerCase().includes('darurat') || g.name.toLowerCase().includes('emergency'))
  
  const target = emergencyFund ? emergencyFund.target : 0
  const current = emergencyFund ? emergencyFund.saved : 0
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0

  if (!emergencyFund) {
    return (
      <div className="card shadow-none border" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '180px' }}>
          <div
            className="bg-orange-lt text-orange d-flex align-items-center justify-content-center mb-3"
            style={{ width: '48px', height: '48px', borderRadius: '12px' }}
          >
            <Icon icon="shield-check" size="sm" stroke={1.5} />
          </div>
          <h4 className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>Dana Darurat</h4>
          <p className="text-secondary mb-0" style={{ fontSize: '12px' }}>
            Buat goal dengan nama <strong>"Dana Darurat"</strong> untuk melacak progresnya di sini.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card shadow-none border" style={{ borderRadius: '12px' }}>
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-orange text-white d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px', borderRadius: '10px' }}
            >
              <Icon icon="shield-check" size="sm" stroke={1.5} />
            </div>
            <div>
              <h4 className="fw-bold m-0 fs-3 text-dark">Dana Darurat</h4>
              <div className="text-secondary small fw-medium">Safety Net</div>
            </div>
          </div>
          <span
            className="badge bg-orange-lt text-orange fw-bold border-0 rounded-pill px-3 py-1"
            style={{ fontSize: '11px' }}
          >
            {percentage}%
          </span>
        </div>

        <div className="mb-3 d-flex justify-content-between align-items-end">
          <div>
            <div
              className="text-secondary mb-1 fw-bold"
              style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Terkumpul
            </div>
            <div className="fw-bold text-dark fs-2">{formatCurrency(current)}</div>
          </div>
          <div className="text-end">
            <div
              className="text-secondary mb-1 fw-bold"
              style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Target (6 Bln)
            </div>
            <div className="fw-bold text-secondary fs-4">{formatCurrency(target)}</div>
          </div>
        </div>

        <div
          className="progress mb-4 bg-body-tertiary"
          style={{
            height: '6px',
            borderRadius: '10px',
            overflow: 'visible'
          }}
        >
          <div
            className="progress-bar bg-orange"
            style={{
              width: `${percentage}%`,
              borderRadius: '10px',
              transition: 'width 1.5s ease-in-out',
            }}
          ></div>
        </div>

        <div className="p-3 bg-body-tertiary border rounded-4 d-flex gap-3 align-items-center mt-2">
          <div
            className="flex-shrink-0 bg-white border text-orange rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '36px', height: '36px' }}
          >
            <Icon icon="bulb" size="sm" stroke={1.5} />
          </div>
          <p
            className="text-secondary mb-0 fw-medium"
            style={{ fontSize: '11px', lineHeight: '1.5' }}
          >
            Dana darurat idealnya mencakup <strong className="text-dark">6 bulan</strong> biaya hidup. 
            Tingkatkan setoran untuk keamanan finansial yang lebih baik.
          </p>
        </div>
      </div>
    </div>
  )
}

