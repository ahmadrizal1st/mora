import React from 'react';
import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

interface PlanningSegmentedNavProps {
  activeTab: 'budget' | 'goals' | 'subscriptions';
  onTabChange: (tab: 'budget' | 'goals' | 'subscriptions') => void;
}

export function PlanningSegmentedNav({ activeTab, onTabChange }: PlanningSegmentedNavProps) {
  const tabs = [
    { id: 'budget', label: 'Monthly Budget', icon: 'chart-pie-2' },
    { id: 'goals', label: 'Financial Goals', icon: 'target' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'calendar-event' },
  ] as const;

  return (
    <ul className="nav nav-pills p-1 rounded-pill border d-inline-flex flex-nowrap shadow-none" style={{ background: 'var(--tblr-bg-surface-secondary)' }}>
      {tabs.map((tab) => (
        <li key={tab.id} className="nav-item">
          <button
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'nav-link border-0 py-2 px-4 d-flex align-items-center gap-2 small transition-all duration-200',
              activeTab === tab.id ? 'active bg-surface text-primary shadow-sm fw-bold' : 'text-secondary opacity-75'
            )}
            style={{ borderRadius: '100px', fontSize: '13px' }}
          >
            <Icon icon={tab.icon as any} size="sm" />
            <span className="d-none d-md-inline">{tab.label}</span>
            <span className="d-md-none">{tab.label.split(' ')[1] || tab.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
