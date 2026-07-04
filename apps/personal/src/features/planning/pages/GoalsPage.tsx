import { useState, useMemo, useContext, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { GoalsOverviewCard } from '../components/goals/GoalsOverviewCard'
import { GoalCard } from '../components/goals/GoalCard'
import { GoalTrajectoryChart } from '../components/goals/GoalTrajectoryChart'
import { Modal, ModalHeader, Icon, Button } from '@/shared/components/ui'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { PlanningContext } from './PlanningLayout'

export function GoalsPage() {
  const { goalsData, handleOpenAddGoal, handleEditGoal } = useContext(PlanningContext)
  const data = goalsData || { totalSaved: 0, totalTarget: 0, goals: [], milestones: [] }
  const { totalSaved, totalTarget, goals, milestones } = data

  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'achieved'>('all')
  const [targetFilter, setTargetFilter] = useState<'all' | 'under30' | 'above30'>('all')

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [modalFilterOpen, setModalFilterOpen] = useState(false)
  const [modalStatusFilter, setModalStatusFilter] = useState<'all' | 'active' | 'achieved'>('all')
  const [modalTargetFilter, setModalTargetFilter] = useState<'all' | 'under30' | 'above30'>('all')

  const filteredGoals = useMemo(() => {
    return goals.filter((goal: any) => {
      const isAchieved = goal.saved >= goal.target
      if (statusFilter === 'active' && isAchieved) return false
      if (statusFilter === 'achieved' && !isAchieved) return false

      if (targetFilter === 'under30' && goal.target >= 30000000) return false
      if (targetFilter === 'above30' && goal.target < 30000000) return false

      return true
    })
  }, [goals, statusFilter, targetFilter])

  const modalFilteredGoals = useMemo(() => {
    return goals.filter((goal: any) => {
      const isAchieved = goal.saved >= goal.target
      if (modalStatusFilter === 'active' && isAchieved) return false
      if (modalStatusFilter === 'achieved' && !isAchieved) return false

      if (modalTargetFilter === 'under30' && goal.target >= 30000000) return false
      if (modalTargetFilter === 'above30' && goal.target < 30000000) return false

      return true
    })
  }, [goals, modalStatusFilter, modalTargetFilter])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="d-flex flex-column gap-3"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.4s ease-out',
      }}
    >
      <div className="d-flex flex-wrap gap-3">
        <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
          <GoalsOverviewCard
            totalSaved={totalSaved}
            totalTarget={totalTarget}
            goals={goals}
            onViewDetail={() => setIsDetailOpen(true)}
          />
        </div>
        <div className="d-none d-lg-flex flex-column" style={{ flex: '2 1 500px', minWidth: '400px' }}>
          <GoalTrajectoryChart
            totalSaved={totalSaved}
            totalTarget={totalTarget}
            goals={goals}
          />
        </div>
      </div>

      <div className="d-flex flex-wrap gap-3">
        <div className="card shadow-none border h-100" style={{ borderRadius: '12px', flex: '2 1 500px' }}>
          <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
            <h3 className="card-title fw-bold d-flex align-items-center gap-2 m-0">
              My Dreams & Wishes
              <span
                className="badge bg-body-tertiary text-secondary border ms-2"
                style={{ fontSize: '11px' }}
              >
                {filteredGoals.length}
              </span>
            </h3>

            <div className="d-flex align-items-center gap-2">
              <Button
                element="button"
                type="button"
                color="primary"
                icon="plus"
                size="sm"
                onClick={handleOpenAddGoal}
              >
                Tambah
              </Button>
              <div className="position-relative">
                <a
                  href="#"
                  className="text-secondary small d-flex align-items-center gap-1 text-decoration-none fw-semibold"
                  onClick={(e) => {
                    e.preventDefault()
                    setFilterOpen(!filterOpen)
                  }}
                >
                  <span className="text-decoration-underline-hover">Filter</span>
                  <Icon icon="chevron-down" size="xs" />
                </a>

              {filterOpen && (
                <>
                  <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1000 }}
                    onClick={() => setFilterOpen(false)}
                  />
                  <div
                    className="card position-absolute end-0 mt-2 p-3 shadow-lg border border-light-subtle text-body"
                    style={{
                      zIndex: 1001,
                      width: '280px',
                      borderRadius: '16px',
                      top: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold text-dark small">Filter Impian</span>
                      <button
                        className="btn btn-link btn-sm text-decoration-none p-0 text-muted fw-semibold"
                        style={{ fontSize: '11px' }}
                        onClick={() => {
                          setStatusFilter('all')
                          setTargetFilter('all')
                        }}
                      >
                        Reset
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-secondary fw-semibold mb-2">
                        Status
                      </label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { value: 'all', label: 'Semua' },
                          { value: 'active', label: 'Sedang Berjalan' },
                          { value: 'achieved', label: 'Sudah Tercapai' },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className="form-check m-0 cursor-pointer d-flex align-items-center"
                          >
                            <input
                              type="radio"
                              className="form-check-input"
                              name="statusFilter"
                              checked={statusFilter === opt.value}
                              onChange={() =>
                                setStatusFilter(opt.value as 'all' | 'active' | 'achieved')
                              }
                            />
                            <span
                              className="form-check-label small ms-2 text-body"
                              style={{ fontSize: '12px' }}
                            >
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-secondary fw-semibold mb-2">
                        Target Nominal
                      </label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { value: 'all', label: 'Semua' },
                          { value: 'under30', label: '< Rp 30 Juta' },
                          { value: 'above30', label: '≥ Rp 30 Juta' },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className="form-check m-0 cursor-pointer d-flex align-items-center"
                          >
                            <input
                              type="radio"
                              className="form-check-input"
                              name="targetFilter"
                              checked={targetFilter === opt.value}
                              onChange={() =>
                                setTargetFilter(opt.value as 'all' | 'under30' | 'above30')
                              }
                            />
                            <span
                              className="form-check-label small ms-2 text-body"
                              style={{ fontSize: '12px' }}
                            >
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>
          </div>
          <div className="card-body p-4 pt-2 d-flex flex-column h-100">
            <div
              style={{
                maxHeight: '680px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '0',
              }}
              className="no-scrollbar flex-grow-1"
            >
              <div className="row g-4">
                {filteredGoals.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <div className="p-4 mx-auto" style={{ maxWidth: '400px' }}>
                      {goals.length === 0 ? (
                        <>
                          <div className="p-3 bg-orange-lt text-orange rounded-circle d-inline-flex mb-3">
                            <Icon icon="star" size="md" />
                          </div>
                          <h4 className="fw-bold text-body mb-2">Belum Ada Impian</h4>
                          <p className="text-secondary small mb-3">
                            Mulai tuliskan impianmu dan rencanakan langkah untuk mencapainya hari ini!
                          </p>
                          <Button
                            element="button"
                            type="button"
                            color="primary"
                            icon="plus"
                            onClick={handleOpenAddGoal}
                          >
                            Tambah Impian
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="p-3 bg-orange-lt text-orange rounded-circle d-inline-flex mb-3">
                            <Icon icon="search" size="md" />
                          </div>
                          <h4 className="fw-bold text-orange mb-2">Tidak Ada Impian Ditemukan</h4>
                          <p className="text-secondary small mb-3">
                            Tidak ada target impian yang sesuai dengan filter yang Anda pilih. Coba ubah
                            filter atau reset pencarian.
                          </p>
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              element="button"
                              type="button"
                              color="primary"
                              icon="plus"
                              onClick={handleOpenAddGoal}
                              size="sm"
                            >
                              Tambah
                            </Button>
                            <Button
                              element="button"
                              type="button"
                              color="secondary"
                              onClick={() => {
                                setStatusFilter('all')
                                setTargetFilter('all')
                              }}
                              size="sm"
                            >
                              Reset Filter
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredGoals.map((goal: any) => (
                    <div key={goal.id} className="col-12 col-md-6">
                      <GoalCard goal={goal} onClick={() => handleEditGoal?.(goal)} />
                    </div>
                  ))
                )}

                <div className="col-12 col-md-6" onClick={handleOpenAddGoal}>
                  <div
                    className="card shadow-none border cursor-pointer d-flex align-items-center justify-content-center py-5 h-100 transition-all hover-border-primary"
                    style={{
                      borderRadius: '12px',
                      background: '#f8f9fa',
                      minHeight: '260px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div className="text-center">
                      <div className="mb-3">
                        <div 
                          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm"
                          style={{ width: '48px', height: '48px', border: '1px solid #e9ecef' }}
                        >
                          <Icon icon="plus" size="md" className="text-secondary" stroke={2.5} />
                        </div>
                      </div>
                      <div
                        className="fw-bold text-dark text-uppercase"
                        style={{ fontSize: '12px', letterSpacing: '0.05em' }}
                      >
                        Tambah Impian Baru
                      </div>
                      <div className="small text-secondary mt-1" style={{ fontSize: '11px' }}>
                        Wujudkan mimpimu hari ini
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 280px', minWidth: '260px' }}>
          <div className="d-flex flex-column gap-3 h-100">
            <div
              className="card shadow-none border flex-grow-1 d-none d-lg-flex flex-column overflow-hidden"
              style={{ borderRadius: '12px' }}
            >
              <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0 flex-shrink-0">
                <h4
                  className="card-title fw-bold m-0 d-flex align-items-center gap-2"
                  style={{ letterSpacing: '0.025em' }}
                >
                  Journey Milestones
                </h4>
              </div>
              <div className="card-body p-4 d-flex flex-column overflow-hidden" style={{ minHeight: 0 }}>
                {milestones && milestones.length > 0 ? (
                  <div className="flex-grow-1 overflow-y-auto no-scrollbar" style={{ minHeight: 0 }}>
                    <div className="position-relative ms-3 ps-4 border-start border-2 border-orange-lt">
                      {milestones.map((m: any, i: number) => (
                        <div key={i} className="mb-4 position-relative">
                          <div
                            className={`position-absolute rounded-circle border border-white d-flex align-items-center justify-content-center ${m.type === 'achievement' ? 'bg-success' : 'bg-orange'}`}
                            style={{
                              width: '24px',
                              height: '24px',
                              left: '-36px',
                              top: '0',
                              borderWidth: '3px',
                            }}
                          >
                            <Icon
                              icon={m.type === 'achievement' ? 'trophy' : 'flag'}
                              size="xs"
                              className="text-white"
                            />
                          </div>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div
                                className="text-secondary mb-1 fw-bold"
                                style={{ fontSize: '10px', textTransform: 'uppercase' }}
                              >
                                {m.date}
                              </div>
                              <div className="fw-bold text-body small leading-tight">{m.label}</div>
                            </div>
                            <span
                              className={`badge ${m.type === 'achievement' ? 'bg-success-lt' : 'bg-primary-lt'} border-0`}
                              style={{ fontSize: '9px' }}
                            >
                              {m.type === 'achievement' ? 'Tercapai' : 'Target'}
                            </span>
                          </div>
                        </div>
                      ))}

                      <div className="mb-0 position-relative mt-2">
                        <div
                          className="position-absolute rounded-circle bg-white border-dashed border-2"
                          style={{
                            width: '20px',
                            height: '20px',
                            left: '-34px',
                            top: '2px',
                            borderColor: '#cbd5e1',
                          }}
                        ></div>
                        <div className="text-secondary small fst-italic opacity-50">
                          Impian berikutnya sedang menunggu...
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-3 py-4">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center mb-3" 
                      style={{ 
                        width: '64px', 
                        height: '64px', 
                        background: '#f8f9fa',
                        border: '2px dashed #e2e8f0'
                      }}
                    >
                      <Icon icon="map-2" size="md" className="text-secondary opacity-50" stroke={1.5} />
                    </div>
                    <div className="fw-bold text-dark mb-2" style={{ fontSize: '14px' }}>Belum Ada Perjalanan</div>
                    <div className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                      Milestone impian Anda akan otomatis tercatat di sini seiring dengan progres tabungan Anda.
                    </div>
                  </div>
                )}

                <div className="mt-4 p-3 bg-body-tertiary rounded-3 border-0 text-center flex-shrink-0">
                  <div className="small fw-bold text-body mb-1">Terus Konsisten!</div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>
                    Setiap langkah kecil membawamu lebih dekat ke impian.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={isDetailOpen} onClose={() => setIsDetailOpen(false)} size="xl">
        <ModalHeader title="Detail Progres Impian (Goals)" onClose={() => setIsDetailOpen(false)} />
        <div className="modal-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-secondary small fw-medium">
              Menampilkan {modalFilteredGoals.length} dari {goals.length} impian
            </div>

            <div className="position-relative">
              <a
                href="#"
                className="text-secondary small d-flex align-items-center gap-1 text-decoration-none fw-semibold"
                onClick={(e) => {
                  e.preventDefault()
                  setModalFilterOpen(!modalFilterOpen)
                }}
              >
                <span className="text-decoration-underline-hover">Filter</span>
                <Icon icon="chevron-down" size="xs" />
              </a>

              {modalFilterOpen && (
                <>
                  <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1060 }}
                    onClick={() => setModalFilterOpen(false)}
                  />
                  <div
                    className="card position-absolute end-0 mt-2 p-3 shadow-lg border border-light-subtle text-body"
                    style={{
                      zIndex: 1061,
                      width: '280px',
                      borderRadius: '16px',
                      top: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold text-dark small">Filter Impian</span>
                      <button
                        className="btn btn-link btn-sm text-decoration-none p-0 text-muted fw-semibold"
                        style={{ fontSize: '11px' }}
                        onClick={() => {
                          setModalStatusFilter('all')
                          setModalTargetFilter('all')
                        }}
                      >
                        Reset
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-secondary fw-semibold mb-2">
                        Status
                      </label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { value: 'all', label: 'Semua' },
                          { value: 'active', label: 'Sedang Berjalan' },
                          { value: 'achieved', label: 'Sudah Tercapai' },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className="form-check m-0 cursor-pointer d-flex align-items-center"
                          >
                            <input
                              type="radio"
                              className="form-check-input"
                              name="modalStatusFilter"
                              checked={modalStatusFilter === opt.value}
                              onChange={() =>
                                setModalStatusFilter(opt.value as 'all' | 'active' | 'achieved')
                              }
                            />
                            <span
                              className="form-check-label small ms-2 text-body"
                              style={{ fontSize: '12px' }}
                            >
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-secondary fw-semibold mb-2">
                        Target Nominal
                      </label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { value: 'all', label: 'Semua' },
                          { value: 'under30', label: '< Rp 30 Juta' },
                          { value: 'above30', label: '≥ Rp 30 Juta' },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className="form-check m-0 cursor-pointer d-flex align-items-center"
                          >
                            <input
                              type="radio"
                              className="form-check-input"
                              name="modalTargetFilter"
                              checked={modalTargetFilter === opt.value}
                              onChange={() =>
                                setModalTargetFilter(opt.value as 'all' | 'under30' | 'above30')
                              }
                            />
                            <span
                              className="form-check-label small ms-2 text-body"
                              style={{ fontSize: '12px' }}
                            >
                              {opt.label}
                            </span>
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
                {goals.length === 0 ? (
                  <>
                    <div className="p-3 bg-orange-lt text-orange rounded-circle d-inline-flex mb-3">
                      <Icon icon="star" size="md" />
                    </div>
                    <h4 className="fw-bold text-body mb-2">Belum Ada Impian</h4>
                    <p className="text-secondary small mb-3">
                      Mulai tuliskan impianmu dan rencanakan langkah untuk mencapainya hari ini!
                    </p>
                    <Button
                      element="button"
                      type="button"
                      color="primary"
                      icon="plus"
                      onClick={() => {
                        setIsDetailOpen(false)
                        handleOpenAddGoal()
                      }}
                    >
                      Tambah Impian
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-orange-lt text-orange rounded-circle d-inline-flex mb-3">
                      <Icon icon="search" size="md" />
                    </div>
                    <h4 className="fw-bold text-orange mb-2">Tidak Ada Impian Ditemukan</h4>
                    <p className="text-secondary small mb-3">
                      Tidak ada target impian yang sesuai dengan filter yang Anda pilih. Coba ubah
                      filter atau reset pencarian.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        element="button"
                        type="button"
                        color="primary"
                        icon="plus"
                        onClick={() => {
                          setIsDetailOpen(false)
                          handleOpenAddGoal()
                        }}
                        size="sm"
                      >
                        Tambah
                      </Button>
                      <Button
                        element="button"
                        type="button"
                        color="secondary"
                        onClick={() => {
                          setModalStatusFilter('all')
                          setModalTargetFilter('all')
                        }}
                        size="sm"
                      >
                        Reset Filter
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="card-body p-0 m-0">
              <div>
                {modalFilteredGoals.map((g: any, i: number) => {
                  const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0
                  return (
                    <div
                      key={g.id}
                      className="d-flex justify-content-between align-items-center px-4 py-3 cursor-pointer hover-bg-surface"
                      style={{ borderBottom: i < modalFilteredGoals.length - 1 ? '1px solid #fafafa' : undefined }}
                      onClick={() => {
                        setIsDetailOpen(false)
                        handleEditGoal?.(g)
                      }}
                    >
                      <div className="d-flex align-items-center gap-3 flex-grow-1 overflow-hidden me-2">
                        <div
                          className="d-flex align-items-center justify-content-center text-white"
                          style={{
                            backgroundColor: g.color || '#ff6b00',
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            flexShrink: 0,
                          }}
                        >
                          <Icon icon={g.icon as string} size="sm" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                            {g.name}
                          </div>
                          <div className="d-flex align-items-center gap-1 flex-wrap mt-1" style={{ fontSize: '11px', color: '#a0aec0' }}>
                            <span
                              className="badge bg-orange-lt text-orange border-0 px-1 py-0"
                              style={{ fontSize: '10px' }}
                            >
                              {g.eta}
                            </span>
                            <span>&middot; Target: {formatCurrency(g.target)}</span>
                            <span>&middot; Progres: {pct}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <div className="fw-bold text-success" style={{ fontSize: '14px' }}>
                          {formatCurrency(g.saved)}
                        </div>
                        <div className="mt-1 fw-medium text-secondary" style={{ fontSize: '11px' }}>
                          {g.monthlyDeposit ? `${formatCurrency(g.monthlyDeposit)}/bln` : '-'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
