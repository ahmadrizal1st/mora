import React from 'react';
import { MOCK_SUBSCRIPTIONS_DATA } from '../../data/mockPlanningData';
import { Icon } from '@/shared/components/ui/Icon';

export function SubscriptionCalendar() {
  // Mock calendar days for May 2026
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const bills = MOCK_SUBSCRIPTIONS_DATA.subscriptions;

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
      <div className="card-header border-bottom py-3 px-4 bg-white">
        <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
          <Icon icon="calendar" size="sm" className="text-primary" />
          May 2026 Schedule
        </h3>
      </div>
      <div className="card-body p-0">
        <div className="d-grid shadow-none" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#f1f4f9' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-white p-2 text-center text-secondary small fw-bold">{d}</div>
          ))}
          {/* Fill empty days before May 1st (May 1 2026 is Friday) */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-light p-3" style={{ minHeight: '80px' }}></div>
          ))}
          {days.map(day => {
            const dayBills = bills.filter(b => b.date.includes(`${day} `));
            return (
              <div key={day} className="bg-white p-2 position-relative" style={{ minHeight: '80px' }}>
                <span className="small text-secondary fw-bold">{day}</span>
                <div className="mt-1 d-flex flex-column gap-1">
                  {dayBills.map(b => (
                    <div key={b.id} className="badge bg-primary-lt text-primary border-0 p-1 text-truncate" style={{ fontSize: '9px', maxWidth: '100%' }}>
                      {b.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
