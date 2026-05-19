import React from 'react';
import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

interface PlanningMetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: string;
  valueColor?: 'success' | 'danger' | 'primary' | 'warning';
}

export function PlanningMetricCard({ title, value, subtext, icon, valueColor }: PlanningMetricCardProps) {
  // Map valueColor to standard Tabler solid background classes
  const bgClass = clsx({
    'bg-blue': valueColor === 'primary',
    'bg-red': valueColor === 'danger',
    'bg-green': valueColor === 'success',
    'bg-orange': valueColor === 'warning',
  }) || 'bg-blue';

  // Map valueColor to text class for the value to align with the Credit tab aesthetics
  const textClass = clsx({
    'text-body': valueColor === 'primary',
    'text-danger': valueColor === 'danger',
    'text-success': valueColor === 'success',
    'text-warning': valueColor === 'warning',
  }) || 'text-body';

  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-3 p-lg-4">
        
        {/* Header: Solid Color Square Avatar & Uppercase Label */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <div 
            className={clsx('avatar avatar-sm text-white', bgClass)} 
            style={{ borderRadius: '10px', width: '32px', height: '32px' }}
          >
            <Icon icon={icon as any} size="sm" className="text-white" />
          </div>
          <div 
            className="subheader text-muted m-0 fw-bold" 
            style={{ letterSpacing: '0.05em', fontSize: '10px' }}
          >
            {title.toUpperCase()}
          </div>
        </div>

        {/* Primary Metric Value */}
        <div className={clsx('h1 fw-bold m-0 mb-1', textClass)} style={{ letterSpacing: '-0.5px' }}>
          {value}
        </div>

        {/* Small Footer Detail */}
        <div className="text-muted small" style={{ fontSize: '11px' }}>
          {subtext}
        </div>

      </div>
    </div>
  );
}
