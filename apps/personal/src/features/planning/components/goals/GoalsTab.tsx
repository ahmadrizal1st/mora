import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { MOCK_GOALS_DATA } from '../../data/mockPlanningData';
import { Goal, GoalsData } from '../../types';
import { GoalsOverviewCard } from './GoalsOverviewCard';
import { GoalCard } from './GoalCard';
import { GoalTrajectoryChart } from './GoalTrajectoryChart';
import { EmergencyFundCard } from './EmergencyFundCard';
import { SmartInsightCard } from './SmartInsightCard';
import { Modal, ModalHeader, Icon } from '@/shared/components/ui';
import { formatCurrency } from '@/shared/utils/currencyUtils';

interface GoalsTabProps {
  onAdd?: () => void;
  onEditGoal?: (goal: Goal) => void;
  data?: GoalsData;
}

export function GoalsTab({ onAdd, onEditGoal, data = MOCK_GOALS_DATA as GoalsData }: GoalsTabProps) {
  const { totalSaved, totalTarget, goals, milestones } = data;

  // Main Page Filter States
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'achieved'>('all');
  const [targetFilter, setTargetFilter] = useState<'all' | 'under30' | 'above30'>('all');

  // Modal State & Modal Filter States
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [modalFilterOpen, setModalFilterOpen] = useState(false);
  const [modalStatusFilter, setModalStatusFilter] = useState<'all' | 'active' | 'achieved'>('all');
  const [modalTargetFilter, setModalTargetFilter] = useState<'all' | 'under30' | 'above30'>('all');

  // Filter logic for main page list
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      // Status filter (active if saved < target, achieved if saved >= target)
      const isAchieved = goal.saved >= goal.target;
      if (statusFilter === 'active' && isAchieved) return false;
      if (statusFilter === 'achieved' && !isAchieved) return false;

      // Target filter
      if (targetFilter === 'under30' && goal.target >= 30000000) return false;
      if (targetFilter === 'above30' && goal.target < 30000000) return false;

      return true;
    });
  }, [goals, statusFilter, targetFilter]);

  // Filter logic for modal table
  const modalFilteredGoals = useMemo(() => {
    return goals.filter(goal => {
      // Status filter
      const isAchieved = goal.saved >= goal.target;
      if (modalStatusFilter === 'active' && isAchieved) return false;
      if (modalStatusFilter === 'achieved' && !isAchieved) return false;

      // Target filter
      if (modalTargetFilter === 'under30' && goal.target >= 30000000) return false;
      if (modalTargetFilter === 'above30' && goal.target < 30000000) return false;

      return true;
    });
  }, [goals, modalStatusFilter, modalTargetFilter]);

  return (
    <div className="row row-cards g-3 tab-content-anim">
      {/* ROW 1: Header Analytics */}
      <div className="col-lg-4">
        <div className="h-100">
          <GoalsOverviewCard 
            totalSaved={totalSaved} 
            totalTarget={totalTarget} 
            onViewDetail={() => setIsDetailOpen(true)} 
          />
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
              <div className="p-3 bg-white rounded-circle d-inline-flex mb-3 mx-auto shadow-sm" style={{ color: '#f59f00' }}>
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
                    <Icon icon="check" size="xs" style={{ color: '#f59f00' }} stroke={3} />
                  </div>
                ))}
                <div className="p-1 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm border border-white-subtle opacity-50" style={{ width: '24px', height: '24px' }}>
                  <span className="fw-bold" style={{ fontSize: '10px', color: '#f59f00' }}>+1</span>
                </div>
              </div>
              <div className="small fw-bold text-white text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em', opacity: '0.8' }}>1 month to next milestone</div>
            </div>
            <div className="mt-3 pt-3 border-top border-white-subtle text-center">
              <Link to="/achievements" className="btn btn-white btn-sm w-100 rounded-pill fw-bold" style={{ color: '#f59f00' }}>
                Lihat Pencapaian
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Detailed Content Grid */}
      <div className="col-lg-8">
        <div className="card border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
            <h3 className="card-title fw-bold d-flex align-items-center gap-2 m-0">
              <Icon icon="star" size="sm" style={{ color: '#f59f00' }} />
              My Dreams & Wishes
              <span className="badge bg-body-tertiary text-secondary border ms-2" style={{ fontSize: '11px' }}>{filteredGoals.length}</span>
            </h3>
            
            <div className="position-relative">
              <button 
                className="btn btn-ghost-orange btn-sm rounded-pill fw-bold d-flex align-items-center gap-1 px-3"
                style={{ height: '32px' }}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Icon icon="filter" size="xs" />
                Filter
              </button>
              
              {filterOpen && (
                <>
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1000 }} onClick={() => setFilterOpen(false)} />
                  <div 
                    className="card position-absolute end-0 mt-2 p-3 shadow-lg border border-light-subtle text-body" 
                    style={{ 
                      zIndex: 1001, 
                      width: '280px', 
                      borderRadius: '16px',
                      top: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold text-dark small">Filter Impian</span>
                      <button 
                        className="btn btn-link btn-sm text-decoration-none p-0 text-muted fw-semibold"
                        style={{ fontSize: '11px' }}
                        onClick={() => { setStatusFilter('all'); setTargetFilter('all'); }}
                      >
                        Reset
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label small text-secondary fw-semibold mb-2">Status</label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { value: 'all', label: 'Semua' },
                          { value: 'active', label: 'Sedang Berjalan' },
                          { value: 'achieved', label: 'Sudah Tercapai' }
                        ].map(opt => (
                          <label key={opt.value} className="form-check m-0 cursor-pointer d-flex align-items-center">
                            <input 
                              type="radio" 
                              className="form-check-input" 
                              name="statusFilter"
                              checked={statusFilter === opt.value}
                              onChange={() => setStatusFilter(opt.value as 'all' | 'active' | 'achieved')}
                            />
                            <span className="form-check-label small ms-2 text-body" style={{ fontSize: '12px' }}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-secondary fw-semibold mb-2">Target Nominal</label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { value: 'all', label: 'Semua' },
                          { value: 'under30', label: '< Rp 30 Juta' },
                          { value: 'above30', label: '≥ Rp 30 Juta' }
                        ].map(opt => (
                          <label key={opt.value} className="form-check m-0 cursor-pointer d-flex align-items-center">
                            <input 
                              type="radio" 
                              className="form-check-input" 
                              name="targetFilter"
                              checked={targetFilter === opt.value}
                              onChange={() => setTargetFilter(opt.value as 'all' | 'under30' | 'above30')}
                            />
                            <span className="form-check-label small ms-2 text-body" style={{ fontSize: '12px' }}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
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
                {filteredGoals.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <div className="p-4 mx-auto" style={{ maxWidth: '400px' }}>
                      <div className="p-3 bg-orange-lt text-orange rounded-circle d-inline-flex mb-3">
                        <Icon icon="search" size="md" />
                      </div>
                      <h4 className="fw-bold text-orange mb-2">Tidak Ada Impian Ditemukan</h4>
                      <p className="text-secondary small mb-3">
                        Tidak ada target impian yang sesuai dengan filter yang Anda pilih. Coba ubah filter atau reset pencarian.
                      </p>
                      <button 
                        className="btn btn-orange rounded-pill btn-sm px-4 fw-bold"
                        onClick={() => { setStatusFilter('all'); setTargetFilter('all'); }}
                      >
                        Reset Filter
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredGoals.map(goal => (
                    <div key={goal.id} className="col-12 col-md-6">
                      <GoalCard 
                        goal={goal} 
                        onClick={() => onEditGoal?.(goal)}
                      />
                    </div>
                  ))
                )}
                {/* Add Button is always part of the grid flow */}
                <div className="col-12 col-md-6" onClick={onAdd}>
                  <div 
                    className="card shadow-none cursor-pointer d-flex align-items-center justify-content-center py-5 h-100 transition-all hover-bg-surface hover-border-primary" 
                    style={{ 
                      borderRadius: '16px', 
                      border: '2px dashed var(--tblr-border-color)', 
                      background: 'var(--tblr-bg-surface-secondary, rgba(248, 250, 252, 0.4))', 
                      minHeight: '300px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="text-center">
                      <div className="mb-3">
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
                        <div className="fw-bold text-body small leading-tight">{m.label}</div>
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
                    className="position-absolute rounded-circle bg-body-tertiary border-dashed border-2" 
                    style={{ width: '20px', height: '20px', left: '-31px', top: '2px', borderColor: 'var(--tblr-border-color)' }}
                  ></div>
                  <div className="text-secondary small italic">Impian berikutnya sedang menunggu...</div>
                </div>
              </div>

              {/* Motivational Footer to fill space */}
              <div className="mt-4 p-3 bg-body-tertiary rounded-3 border-0 text-center">
                <div className="small fw-bold text-body mb-1">Terus Konsisten!</div>
                <div className="text-secondary" style={{ fontSize: '11px' }}>Setiap langkah kecil membawamu lebih dekat ke impian.</div>
              </div>
            </div>
          </div>
          <EmergencyFundCard />
        </div>
      </div>

      {/* Goal Details Modal (Now globally managed in GoalsTab) */}
      <Modal show={isDetailOpen} onClose={() => setIsDetailOpen(false)} size="xl">
        <ModalHeader title="Detail Progres Impian (Goals)" onClose={() => setIsDetailOpen(false)} />
        <div className="modal-body p-4">
          
          {/* Modal Filter Bar */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-secondary small fw-medium">
              Menampilkan {modalFilteredGoals.length} dari {goals.length} impian
            </div>
            
            <div className="position-relative">
              <button 
                className="btn btn-ghost-orange btn-sm rounded-pill fw-bold d-flex align-items-center gap-1 px-3"
                style={{ height: '32px' }}
                onClick={() => setModalFilterOpen(!modalFilterOpen)}
              >
                <Icon icon="filter" size="xs" />
                Filter
              </button>
              
              {modalFilterOpen && (
                <>
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1060 }} onClick={() => setModalFilterOpen(false)} />
                  <div 
                    className="card position-absolute end-0 mt-2 p-3 shadow-lg border border-light-subtle text-body" 
                    style={{ 
                      zIndex: 1061, 
                      width: '280px', 
                      borderRadius: '16px',
                      top: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold text-dark small">Filter Impian</span>
                      <button 
                        className="btn btn-link btn-sm text-decoration-none p-0 text-muted fw-semibold"
                        style={{ fontSize: '11px' }}
                        onClick={() => { setModalStatusFilter('all'); setModalTargetFilter('all'); }}
                      >
                        Reset
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label small text-secondary fw-semibold mb-2">Status</label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { value: 'all', label: 'Semua' },
                          { value: 'active', label: 'Sedang Berjalan' },
                          { value: 'achieved', label: 'Sudah Tercapai' }
                        ].map(opt => (
                          <label key={opt.value} className="form-check m-0 cursor-pointer d-flex align-items-center">
                            <input 
                              type="radio" 
                              className="form-check-input" 
                              name="modalStatusFilter"
                              checked={modalStatusFilter === opt.value}
                              onChange={() => setModalStatusFilter(opt.value as 'all' | 'active' | 'achieved')}
                            />
                            <span className="form-check-label small ms-2 text-body" style={{ fontSize: '12px' }}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-secondary fw-semibold mb-2">Target Nominal</label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { value: 'all', label: 'Semua' },
                          { value: 'under30', label: '< Rp 30 Juta' },
                          { value: 'above30', label: '≥ Rp 30 Juta' }
                        ].map(opt => (
                          <label key={opt.value} className="form-check m-0 cursor-pointer d-flex align-items-center">
                            <input 
                              type="radio" 
                              className="form-check-input" 
                              name="modalTargetFilter"
                              checked={modalTargetFilter === opt.value}
                              onChange={() => setModalTargetFilter(opt.value as 'all' | 'under30' | 'above30')}
                            />
                            <span className="form-check-label small ms-2 text-body" style={{ fontSize: '12px' }}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {modalFilteredGoals.length === 0 ? (
            <div className="text-center py-5">
              <div className="p-4 mx-auto" style={{ maxWidth: '400px' }}>
                <div className="p-3 bg-orange-lt text-orange rounded-circle d-inline-flex mb-3">
                  <Icon icon="search" size="md" />
                </div>
                <h4 className="fw-bold text-orange mb-2">Tidak Ada Impian Ditemukan</h4>
                <p className="text-secondary small mb-3">
                  Tidak ada target impian yang sesuai dengan filter yang Anda pilih. Coba ubah filter atau reset pencarian.
                </p>
                <button 
                  className="btn btn-orange rounded-pill btn-sm px-4 fw-bold"
                  onClick={() => { setModalStatusFilter('all'); setModalTargetFilter('all'); }}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-vcenter card-table table-hover">
                <thead>
                  <tr>
                    <th className="text-secondary small fw-bold px-3 py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', minWidth: '180px' }}>Nama Impian</th>
                    <th className="text-secondary small fw-bold py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', minWidth: '130px' }}>Target</th>
                    <th className="text-secondary small fw-bold py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', minWidth: '130px' }}>Terkumpul</th>
                    <th className="text-secondary small fw-bold py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', minWidth: '160px' }}>Progres</th>
                    <th className="text-secondary small fw-bold py-2 text-center" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', minWidth: '120px' }}>Target Selesai</th>
                    <th className="text-secondary small fw-bold py-2 text-end" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', minWidth: '140px' }}>Saran Tabungan</th>
                  </tr>
                </thead>
                <tbody>
                  {modalFilteredGoals.map(g => {
                    const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
                    return (
                      <tr 
                        key={g.id} 
                        className="align-middle cursor-pointer animate-in fade-in"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setIsDetailOpen(false);
                          onEditGoal?.(g);
                        }}
                      >
                        <td className="px-3 py-3" style={{ minWidth: '180px' }}>
                          <div className="d-flex align-items-center gap-2">
                            <span 
                              className="avatar avatar-xs rounded-circle text-white shadow-sm d-flex align-items-center justify-content-center"
                              style={{ backgroundColor: g.color || '#ff6b00', width: '28px', height: '28px' }}
                            >
                              <Icon icon={g.icon as string} size={12} className="m-0 text-white" />
                            </span>
                            <span className="fw-bold">{g.name}</span>
                          </div>
                        </td>
                        <td className="py-3 fw-medium" style={{ minWidth: '130px' }}>{formatCurrency(g.target)}</td>
                        <td className="py-3 text-success fw-bold" style={{ minWidth: '130px' }}>{formatCurrency(g.saved)}</td>
                        <td className="py-3" style={{ minWidth: '160px' }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress progress-sm flex-grow-1" style={{ height: '8px', borderRadius: '10px', minWidth: '80px' }}>
                              <div className="progress-bar bg-orange" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="small fw-bold text-orange" style={{ minWidth: '35px', textAlign: 'right' }}>{pct}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-center" style={{ minWidth: '120px' }}>
                          <span className="badge bg-orange-lt text-orange border-0 px-2 py-1" style={{ fontSize: '10px' }}>
                            {g.eta}
                          </span>
                        </td>
                        <td className="py-3 text-end fw-semibold text-secondary" style={{ minWidth: '140px' }}>
                          {g.monthlyDeposit ? `${formatCurrency(g.monthlyDeposit)}/bln` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
