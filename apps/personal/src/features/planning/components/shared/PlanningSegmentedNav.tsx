import React from 'react';
import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

interface PlanningSegmentedNavProps {
  activeTab: 'budget' | 'goals' | 'subscriptions';
  onTabChange: (tab: 'budget' | 'goals' | 'subscriptions') => void;
}

export function PlanningSegmentedNav({ activeTab, onTabChange }: PlanningSegmentedNavProps) {
  const tabs = [
    { id: 'budget', label: 'Monthly Budget', icon: 'chart-pie', badge: '5', badgeColor: 'azure' },
    { id: 'goals', label: 'Financial Goals', icon: 'target', badge: '3', badgeColor: 'warning' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'calendar-event', badge: '4', badgeColor: 'green' },
  ] as const;

  return (
    <div 
      className="p-1 d-inline-flex bg-body-tertiary rounded-3" 
      style={{ 
        backgroundColor: '#f4f6fa',
        border: '1px solid rgba(0,0,0,0.04)',
        padding: '2px'
      }}
    >
      <div className="d-flex flex-nowrap" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="border-0 d-flex align-items-center justify-content-center gap-2 px-3 py-1 fw-bold transition-all"
              style={{
                borderRadius: '6px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                outline: 'none',
                height: '32px',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#1e293b' : '#64748b',
                border: isActive ? '1px solid #e6e8eb' : '1px solid transparent',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                margin: '1px'
              }}
              role="tab"
              aria-selected={isActive}
            >
              <Icon icon={tab.icon as any} size={15} />
              <span className="d-none d-md-inline">{tab.label}</span>
              <span className="d-md-none">{tab.label.split(' ')[1] || tab.label}</span>
              {tab.badge && (
                <span
                  className={`badge bg-${tab.badgeColor} text-white border-0 rounded-pill ms-1`}
                  style={{ fontSize: '8px', padding: '1px 5px' }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
