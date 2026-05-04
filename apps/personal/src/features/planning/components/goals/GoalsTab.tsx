import React from 'react';
import { MOCK_GOALS_DATA } from '../../data/mockPlanningData';
import { GoalsOverviewCard } from './GoalsOverviewCard';
import { GoalCard } from './GoalCard';
import { GoalTrajectoryChart } from './GoalTrajectoryChart';
import { Icon } from '@/shared/components/ui/Icon';

export function GoalsTab() {
  const { totalSaved, totalTarget, goals, milestones } = MOCK_GOALS_DATA;

  return (
    <div className="row row-cards g-3 tab-content-anim">
      {/* ROW 1: Header Analytics */}
      <div className="col-lg-4">
        <div className="h-100">
          <GoalsOverviewCard totalSaved={totalSaved} totalTarget={totalTarget} />
        </div>
      </div>
      <div className="col-lg-4">
        <div className="h-100">
          <GoalTrajectoryChart />
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card shadow-sm border-0 glass-card text-success h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4 d-flex flex-column justify-content-center text-center">
            <div className="p-3 bg-success-lt rounded-circle d-inline-flex mb-3 mx-auto shadow-sm">
              <Icon icon="award" size="md" />
            </div>
            <h3 className="fw-bold mb-2">Savings Streak</h3>
            <p className="small text-secondary mb-0 fw-medium">
              Hebat! Anda telah konsisten menabung selama <strong>6 bulan</strong> tanpa terputus.
            </p>
          </div>
        </div>
      </div>

      {/* ROW 2: Detailed Content Grid */}
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0">
            <h3 className="card-title fw-bold">My Dreams & Wishes</h3>
          </div>
          <div className="card-body p-4 pt-2">
            <div className="row g-4">
              {goals.map(goal => (
                <div key={goal.id} className="col-12 col-md-6">
                  <GoalCard goal={goal} />
                </div>
              ))}
              <div className="col-12 col-md-6">
                <div 
                  className="card shadow-none cursor-pointer d-flex align-items-center justify-content-center py-5 border-dashed h-100 transition-all" 
                  style={{ borderRadius: '16px', border: '2px dashed #cbd5e1', background: 'rgba(248, 250, 252, 0.4)' }}
                >
                  <div className="text-center">
                    <div className="p-2 bg-white rounded-circle d-inline-flex mb-2 shadow-sm border">
                      <Icon icon="plus" size="md" className="text-primary" stroke={2.5} />
                    </div>
                    <div className="fw-bold text-secondary small">Tambah Impian</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0">
            <h4 className="card-title fw-bold m-0 d-flex align-items-center gap-2 text-ls-sm">
              <Icon icon="timeline" size="sm" className="text-primary" />
              Journey Milestones
            </h4>
          </div>
          <div className="card-body p-4">
            <div className="position-relative ps-4 border-start border-2 border-primary-lt h-100">
              {milestones.map((m, i) => (
                <div key={i} className="mb-4 position-relative">
                  <div 
                    className="position-absolute rounded-circle bg-primary shadow-sm border border-white" 
                    style={{ width: '10px', height: '10px', left: '-26px', top: '4px', borderWidth: '2px' }}
                  ></div>
                  <div className="text-secondary mb-1 fw-medium" style={{ fontSize: '10px' }}>{m.date}</div>
                  <div className="fw-bold text-dark small leading-tight">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
