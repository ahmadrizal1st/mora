import React, { useState } from 'react';
import { Icon } from '@/shared/components/ui/Icon';

interface Subscription {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Upcoming' | 'Unpaid';
  icon: string;
  category: string;
}

export function SubscriptionItem({ subscription }: { subscription: Subscription & { color?: string } }) {
  const [imageError, setImageError] = useState(false);

  const getLogo = (name: string) => {
    if (name.includes('Netflix')) return 'https://cdn-icons-png.flaticon.com/512/732/732228.png';
    if (name.includes('Spotify')) return 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png';
    if (name.includes('PLN')) return 'https://upload.wikimedia.org/wikipedia/id/5/55/Logo_PLN.png';
    if (name.includes('Indihome')) return 'https://upload.wikimedia.org/wikipedia/id/e/e1/IndiHome_logo.png';
    return '';
  };

  const getFallbackIcon = (name: string) => {
    if (name.includes('PLN')) return 'bolt';
    if (name.includes('Indihome')) return 'world';
    if (name.includes('Netflix')) return 'player-play';
    if (name.includes('Spotify')) return 'music';
    return subscription.icon || 'receipt';
  };

  const statusColor = 
    subscription.status === 'Paid' ? 'success' : 
    subscription.status === 'Upcoming' ? 'primary' : 'danger';

  const logoUrl = getLogo(subscription.name);

  return (
    <div className="card border-0 shadow-sm h-100 transition-all hover-shadow-md" style={{ borderRadius: '12px', border: '1px solid #f1f4f9' }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-white p-2 rounded-3 border border-light shadow-sm d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', overflow: 'hidden' }}>
            {logoUrl && !imageError ? (
              <img 
                src={logoUrl} 
                alt="" 
                style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                onError={() => setImageError(true)}
              />
            ) : (
              <Icon icon={getFallbackIcon(subscription.name) as any} size="sm" className="text-primary" />
            )}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div className="text-truncate" style={{ maxWidth: '140px' }}>
                <div className="fw-bold text-dark text-truncate" style={{ fontSize: '13px' }}>{subscription.name}</div>
                <div className="text-secondary" style={{ fontSize: '10px' }}>{subscription.dueDate}</div>
              </div>
              <div className="text-end">
                <div className="fw-bold text-dark" style={{ fontSize: '12px' }}>{`Rp ${subscription.amount.toLocaleString()}`}</div>
                <span className={`badge border-0 rounded-pill mt-1`} style={{ fontSize: '8px', padding: '2px 8px', backgroundColor: `rgba(${statusColor === 'primary' ? '245, 159, 0' : statusColor === 'success' ? '47, 179, 68' : '214, 51, 108'}, 0.1)`, color: statusColor === 'primary' ? '#f59f00' : undefined }}>
                  {subscription.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
