import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

export type WealthTab = 'portfolio' | 'watchlist' | 'market' | 'dividends';

interface NavItem {
  id: WealthTab;
  label: string;
  icon: string;
}

const TABS: NavItem[] = [
  { id: 'portfolio', label: 'Portfolio', icon: 'chart-pie' },
  { id: 'watchlist', label: 'Watchlist', icon: 'eye' },
  { id: 'market', label: 'Market', icon: 'trending-up' },
  { id: 'dividends', label: 'Dividen', icon: 'cash' },
];

interface Props {
  activeTab: WealthTab;
  onTabChange: (tab: WealthTab) => void;
}

export function WealthSegmentedNav({ activeTab, onTabChange }: Props) {
  return (
    <ul className="nav nav-pills p-1 rounded-pill border d-inline-flex flex-nowrap shadow-none" style={{ background: 'var(--tblr-bg-surface-secondary)' }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <li key={tab.id} className="nav-item">
            <button
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'nav-link border-0 py-2 px-4 d-flex align-items-center gap-2 small transition-all duration-200',
                isActive ? 'active bg-surface text-primary shadow-sm fw-bold' : 'text-secondary opacity-75'
              )}
              style={{ borderRadius: '100px', fontSize: '13px' }}
            >
              <Icon icon={tab.icon} size="sm" />
              <span className="d-none d-md-inline">{tab.label}</span>
              <span className="d-inline d-md-none">{tab.label.substring(0, 4)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
