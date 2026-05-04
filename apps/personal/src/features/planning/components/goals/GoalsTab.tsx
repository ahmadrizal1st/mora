import { MOCK_GOALS_DATA } from '../../data/mockPlanningData';
import { GoalsOverviewCard } from './GoalsOverviewCard';
import { GoalCard } from './GoalCard';
import { GoalTrajectoryChart } from './GoalTrajectoryChart';
import { EmergencyFundCard } from './EmergencyFundCard';
import { SmartInsightCard } from './SmartInsightCard';
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
      <div className="col-lg-5">
        <div className="h-100">
          <GoalTrajectoryChart />
        </div>
      </div>
      <div className="col-lg-3">
        <div className="card border-0 h-100 overflow-hidden text-white" style={{ borderRadius: '16px', background: '#f59f00' }}>
          <div className="card-body p-4 d-flex flex-column h-100 position-relative">
            <div 
              className="position-absolute" 
              style={{ 
                top: '-20px', 
                right: '-35px',
                opacity: '0.12',
              }}
            >
              <Icon icon="flame" size="2xl" className="text-white" style={{ fontSize: '200px', width: '200px', height: '200px' }} />
            </div>
            
            <div className="flex-grow-1 d-flex flex-column justify-content-center text-center position-relative" style={{ zIndex: 1 }}>
              <div className="p-3 bg-white text-warning rounded-circle d-inline-flex mb-3 mx-auto shadow-sm">
                <Icon icon="flame" size="md" />
              </div>
              <h3 className="fw-bold mb-1 text-white">Savings Streak</h3>
              <p className="small mb-3 fw-medium text-white opacity-90">
                Hebat! Anda telah konsisten menabung selama <strong>6 bulan</strong> tanpa terputus.
              </p>
              
              {/* Visual Streak Tracker */}
              <div className="d-flex justify-content-center gap-2 mb-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="p-1 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '24px', height: '24px' }}>
                    <Icon icon="check" size="xs" className="text-warning" stroke={3} />
                  </div>
                ))}
                <div className="p-1 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm border border-white-subtle opacity-50" style={{ width: '24px', height: '24px' }}>
                  <span className="text-warning fw-bold" style={{ fontSize: '10px' }}>+1</span>
                </div>
              </div>
              <div className="small fw-bold text-white text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em', opacity: '0.8' }}>1 month to next milestone</div>
            </div>
            <div className="mt-3 pt-3 border-top border-white-subtle text-center">
              <button className="btn btn-white btn-sm w-100 rounded-pill fw-bold text-warning">Lihat Pencapaian</button>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Detailed Content Grid */}
      <div className="col-lg-8">
        <div className="card border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
            <h3 className="card-title fw-bold d-flex align-items-center gap-2 m-0">
              <Icon icon="star" size="sm" className="text-warning" />
              My Dreams & Wishes
              <span className="badge bg-light text-secondary border ms-2" style={{ fontSize: '11px' }}>{goals.length}</span>
            </h3>
            <button className="btn btn-ghost-orange btn-sm rounded-pill fw-bold">Filter</button>
          </div>
          <div className="card-body p-4 pt-2 d-flex flex-column h-100">
            <div 
              style={{ 
                maxHeight: '680px', 
                overflowY: 'auto', 
                overflowX: 'hidden',
                paddingRight: '0'
              }}
              className="no-scrollbar flex-grow-1"
            >
              <div className="row g-4">
                {goals.map(goal => (
                  <div key={goal.id} className="col-12 col-md-6">
                    <GoalCard goal={goal} />
                  </div>
                ))}
                {/* Add Button is always part of the grid flow */}
                <div className="col-12 col-md-6">
                  <div 
                    className="card shadow-none cursor-pointer d-flex align-items-center justify-content-center py-5 border-dashed h-100 transition-all hover-bg-light hover-border-primary" 
                    style={{ 
                      borderRadius: '16px', 
                      border: '2px dashed #cbd5e1', 
                      background: 'rgba(248, 250, 252, 0.4)', 
                      minHeight: '300px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="text-center">
                      <div className="p-3 bg-white rounded-circle d-inline-flex mb-3 border border-light transition-all scale-up-hover">
                        <Icon icon="plus" size="md" className="text-orange" stroke={3} />
                      </div>
                      <div className="fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>Tambah Impian Baru</div>
                      <div className="small text-muted mt-1" style={{ fontSize: '10px' }}>Wujudkan mimpimu hari ini</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Insight is now outside the scroll area, acting as a sticky footer/callout */}
            <div className="mt-4 pt-2 border-top">
              <SmartInsightCard />
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="d-flex flex-column gap-3 h-100">
          <div className="card border-0 flex-grow-1" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0">
              <h4 className="card-title fw-bold m-0 d-flex align-items-center gap-2 text-ls-sm">
                <Icon icon="timeline" size="sm" className="text-orange" />
                Journey Milestones
              </h4>
            </div>
            <div className="card-body p-4 d-flex flex-column h-100">
              <div className="position-relative ps-4 border-start border-2 border-orange-lt flex-grow-1">
                {milestones.map((m, i) => (
                  <div key={i} className="mb-4 position-relative">
                    <div 
                      className={`position-absolute rounded-circle border border-white d-flex align-items-center justify-content-center ${m.type === 'achievement' ? 'bg-success' : 'bg-orange'}`} 
                      style={{ width: '24px', height: '24px', left: '-33px', top: '0', borderWidth: '3px' }}
                    >
                      <Icon icon={m.type === 'achievement' ? 'trophy' : 'flag'} size="xs" className="text-white" />
                    </div>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="text-secondary mb-1 fw-bold" style={{ fontSize: '10px', textTransform: 'uppercase' }}>{m.date}</div>
                        <div className="fw-bold text-dark small leading-tight">{m.label}</div>
                      </div>
                      <span className={`badge ${m.type === 'achievement' ? 'bg-success-lt' : 'bg-primary-lt'} border-0`} style={{ fontSize: '9px' }}>
                        {m.type === 'achievement' ? 'Tercapai' : 'Target'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Visual filler for future milestones */}
                <div className="mb-0 position-relative opacity-50">
                  <div 
                    className="position-absolute rounded-circle bg-light border-dashed border-2" 
                    style={{ width: '20px', height: '20px', left: '-31px', top: '2px', borderColor: '#cbd5e1' }}
                  ></div>
                  <div className="text-secondary small italic">Impian berikutnya sedang menunggu...</div>
                </div>
              </div>

              {/* Motivational Footer to fill space */}
              <div className="mt-4 p-3 bg-light rounded-3 border-0 text-center">
                <div className="small fw-bold text-dark mb-1">Terus Konsisten!</div>
                <div className="text-secondary" style={{ fontSize: '11px' }}>Setiap langkah kecil membawamu lebih dekat ke impian.</div>
              </div>
            </div>
          </div>
          <EmergencyFundCard />
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
