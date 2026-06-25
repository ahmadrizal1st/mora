import React, { useState, useEffect, useRef } from 'react'
import { Outlet } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { PlanningSegmentedNav } from '../components/shared/PlanningSegmentedNav'
import { PlanningMetricCard } from '../components/shared/PlanningMetricCard'
import { Icon, MonthPicker, Modal, ModalHeader, Button } from '@/shared/components/ui'
import {
  MOCK_GOALS_DATA,
  MOCK_SUBSCRIPTIONS_DATA,
} from '../data/mockPlanningData'
import type { Goal, GoalsData, SubscriptionsData } from '../types'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { useGoals, useSubscriptions, useBudgets } from '../hooks/usePlanning'

export const PlanningContext = React.createContext<any>(null)

export function PlanningLayout() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [goalName, setGoalName] = useState('')
  const [goalTarget, setGoalTarget] = useState('')
  const [goalSaved, setGoalSaved] = useState('')
  const [goalMonthly, setGoalMonthly] = useState('')
  const [goalEta, setGoalEta] = useState('')
  const [goalIcon, setGoalIcon] = useState('star')

  const [subName, setSubName] = useState('')
  const [subCost, setSubCost] = useState('')
  const [subDueDate, setSubDueDate] = useState('')
  const [subCategory, setSubCategory] = useState('Streaming')
  const [subStatus, setSubStatus] = useState('upcoming')
  const [subIcon, setSubIcon] = useState('device-tv')

  const { data: apiGoalsData } = useGoals()
  const { data: apiSubsData } = useSubscriptions()
  const { data: budgetData } = useBudgets()

  const [goalsData, setGoalsData] = useState<GoalsData>({ totalSaved: 0, totalTarget: 0, goals: [], milestones: [] })
  const [subsData, setSubsData] = useState<SubscriptionsData>({ totalMonthly: 0, paidThisMonth: 0, subscriptions: [] })

  useEffect(() => {
    if (apiGoalsData) {
      setGoalsData(apiGoalsData)
    }
  }, [apiGoalsData])

  useEffect(() => {
    if (apiSubsData) {
      setSubsData(apiSubsData)
    }
  }, [apiSubsData])

  const totalBudget = budgetData?.totalBudget || 0
  const spent = budgetData?.spent || 0
  const remaining = totalBudget - spent
  const safeToSpendPerDay = budgetData?.safeToSpendPerDay || 0

  const formatMonthYear = (date: Date) => {
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const handleOpenAddGoal = () => {
    setEditingGoal(null)
    setGoalName('')
    setGoalTarget('')
    setGoalSaved('')
    setGoalMonthly('')
    setGoalEta('')
    setGoalIcon('star')
    setIsGoalModalOpen(true)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalName(goal.name)
    setGoalTarget(goal.target.toString())
    setGoalSaved(goal.saved.toString())
    setGoalMonthly(goal.monthlyDeposit ? goal.monthlyDeposit.toString() : '')
    setGoalEta(goal.eta)
    setGoalIcon(goal.icon)
    setIsGoalModalOpen(true)
  }

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingGoal) {
      const updatedGoals = goalsData.goals.map((g: Goal) => {
        if (g.id === editingGoal.id) {
          return {
            ...g,
            name: goalName,
            target: parseFloat(goalTarget) || 0,
            saved: parseFloat(goalSaved) || 0,
            eta: goalEta,
            monthlyDeposit: parseFloat(goalMonthly) || 0,
            icon: goalIcon,
          }
        }
        return g
      })

      const totalSaved = updatedGoals.reduce((sum: number, g: Goal) => sum + g.saved, 0)
      const totalTarget = updatedGoals.reduce((sum: number, g: Goal) => sum + g.target, 0)

      const updated = {
        ...goalsData,
        totalSaved,
        totalTarget,
        goals: updatedGoals,
      }

      setGoalsData(updated)
      localStorage.setItem('visatamora_goals', JSON.stringify(updated))
    } else {
      const newGoal = {
        id: `goal-${Date.now()}`,
        name: goalName,
        target: parseFloat(goalTarget) || 0,
        saved: parseFloat(goalSaved) || 0,
        eta: goalEta || 'Des 2026',
        monthlyDeposit: parseFloat(goalMonthly) || 0,
        icon: goalIcon,
        color: '#ff6b00',
        imageUrl:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=cover&w=400&q=80',
      }

      const updated = {
        ...goalsData,
        totalSaved: goalsData.totalSaved + newGoal.saved,
        totalTarget: goalsData.totalTarget + newGoal.target,
        goals: [...goalsData.goals, newGoal],
      }

      setGoalsData(updated)
      localStorage.setItem('visatamora_goals', JSON.stringify(updated))
    }

    setIsGoalModalOpen(false)
    setEditingGoal(null)

    setGoalName('')
    setGoalTarget('')
    setGoalSaved('')
    setGoalMonthly('')
    setGoalEta('')
    setGoalIcon('star')
  }

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus impian ini?')) {
      const updatedGoals = goalsData.goals.filter((g: Goal) => g.id !== goalId)

      const totalSaved = updatedGoals.reduce((sum: number, g: Goal) => sum + g.saved, 0)
      const totalTarget = updatedGoals.reduce((sum: number, g: Goal) => sum + g.target, 0)

      const updated = {
        ...goalsData,
        totalSaved,
        totalTarget,
        goals: updatedGoals,
      }

      setGoalsData(updated)
      localStorage.setItem('visatamora_goals', JSON.stringify(updated))
      setIsGoalModalOpen(false)
      setEditingGoal(null)

      setGoalName('')
      setGoalTarget('')
      setGoalSaved('')
      setGoalMonthly('')
      setGoalEta('')
      setGoalIcon('star')
    }
  }

  const handleAddSubSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newSub = {
      id: `sub-${Date.now()}`,
      name: subName,
      amount: parseFloat(subCost) || 0,
      dueDate: `2026-05-${subDueDate.padStart(2, '0')}`,
      status: subStatus as 'paid' | 'unpaid' | 'upcoming',
      icon: subIcon,
      color: '#5b9ef7',
    }

    const updated = {
      ...subsData,
      totalMonthly: subsData.totalMonthly + newSub.amount,
      paidThisMonth:
        subStatus === 'paid' ? subsData.paidThisMonth + newSub.amount : subsData.paidThisMonth,
      subscriptions: [...subsData.subscriptions, newSub],
    }

    setSubsData(updated)
    localStorage.setItem('visatamora_subscriptions', JSON.stringify(updated))

    setIsSubModalOpen(false)

    setSubName('')
    setSubCost('')
    setSubDueDate('')
    setSubCategory('Streaming')
    setSubStatus('upcoming')
    setSubIcon('device-tv')
  }

  return (
    <BaseLayout
      pageTitle="Financial Planning"
      pagePretitle="STRATEGY"
      showBackButton={false}
      pageActions={
        <div className="d-flex align-items-center gap-2">
          <MonthPicker value={currentDate} onChange={setCurrentDate} />
          <div className="position-relative" ref={dropdownRef}>
            <button
              className="btn btn-sm px-3 d-flex align-items-center gap-2 rounded-pill shadow-sm text-white border-0 fw-bold py-2"
              style={{ backgroundColor: '#ff6b00' }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Icon icon="plus" size="sm" stroke={2.5} />
              Tambah Baru
            </button>
            {isDropdownOpen && (
              <div
                className="card shadow-lg border position-absolute end-0 mt-2 py-1 bg-surface"
                style={{
                  zIndex: 1050,
                  minWidth: '220px',
                  borderRadius: '10px',
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                }}
              >
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-start bg-transparent border-0 w-100 hover-bg-light"
                  style={{ fontSize: '13px' }}
                  onClick={() => {
                    setIsGoalModalOpen(true)
                    setIsDropdownOpen(false)
                  }}
                >
                  <Icon icon="star" size="sm" className="text-orange" />
                  Tambah Impian (Goal)
                </button>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-start bg-transparent border-0 w-100 hover-bg-light"
                  style={{ fontSize: '13px' }}
                  onClick={() => {
                    setIsSubModalOpen(true)
                    setIsDropdownOpen(false)
                  }}
                >
                  <Icon icon="credit-card" size="sm" className="text-primary" />
                  Tambah Langganan (Subscription)
                </button>
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="row g-3 mb-4 d-none d-md-flex">
        <div className="col-3">
          <PlanningMetricCard
            title="Total Budget"
            value={formatCurrency(totalBudget)}
            subtext={formatMonthYear(currentDate)}
            icon="wallet"
            valueColor="primary"
          />
        </div>
        <div className="col-3">
          <PlanningMetricCard
            title="Terpakai"
            value={formatCurrency(spent)}
            subtext={`${Math.round((spent / totalBudget) * 100)}% digunakan`}
            icon="trending-down"
            valueColor="danger"
          />
        </div>
        <div className="col-3">
          <PlanningMetricCard
            title="Sisa Anggaran"
            value={formatCurrency(remaining)}
            subtext="Tersedia"
            icon="cash"
            valueColor="success"
          />
        </div>
        <div className="col-3">
          <PlanningMetricCard
            title="Harian (Safe)"
            value={formatCurrency(safeToSpendPerDay)}
            subtext="Estimasi harian"
            icon="shield-check"
            valueColor="warning"
          />
        </div>
      </div>

      <div
        className="card border-0 shadow-sm mb-4 overflow-hidden d-block d-md-none"
        style={{ borderRadius: '16px' }}
      >
        <div className="row g-0">
          <div className="col-6 border-end border-bottom p-3 position-relative">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="avatar avatar-sm bg-primary-lt text-primary"
                style={{ borderRadius: '8px', width: '28px', height: '28px' }}
              >
                <Icon icon="wallet" size="sm" />
              </div>
              <div
                className="text-muted fw-bold text-truncate"
                style={{ fontSize: '10px', letterSpacing: '0.05em' }}
              >
                TOTAL BUDGET
              </div>
            </div>
            <div
              className="fs-4 fw-bold text-body mb-1 text-truncate"
              style={{ letterSpacing: '-0.5px' }}
            >
              {formatCurrency(totalBudget)}
            </div>
            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
              {formatMonthYear(currentDate)}
            </div>
          </div>

          <div className="col-6 border-bottom p-3 position-relative">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="avatar avatar-sm bg-danger-lt text-danger"
                style={{ borderRadius: '8px', width: '28px', height: '28px' }}
              >
                <Icon icon="trending-down" size="sm" />
              </div>
              <div
                className="text-muted fw-bold text-truncate"
                style={{ fontSize: '10px', letterSpacing: '0.05em' }}
              >
                TERPAKAI
              </div>
            </div>
            <div
              className="fs-4 fw-bold text-danger mb-1 text-truncate"
              style={{ letterSpacing: '-0.5px' }}
            >
              {formatCurrency(spent)}
            </div>
            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
              {Math.round((spent / totalBudget) * 100)}% digunakan
            </div>
          </div>

          <div className="col-6 border-end p-3 position-relative">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="avatar avatar-sm bg-success-lt text-success"
                style={{ borderRadius: '8px', width: '28px', height: '28px' }}
              >
                <Icon icon="cash" size="sm" />
              </div>
              <div
                className="text-muted fw-bold text-truncate"
                style={{ fontSize: '10px', letterSpacing: '0.05em' }}
              >
                SISA ANGGARAN
              </div>
            </div>
            <div
              className="fs-4 fw-bold text-success mb-1 text-truncate"
              style={{ letterSpacing: '-0.5px' }}
            >
              {formatCurrency(remaining)}
            </div>
            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
              Tersedia
            </div>
          </div>

          <div className="col-6 p-3 position-relative">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="avatar avatar-sm bg-warning-lt text-warning"
                style={{ borderRadius: '8px', width: '28px', height: '28px' }}
              >
                <Icon icon="shield-check" size="sm" />
              </div>
              <div
                className="text-muted fw-bold text-truncate"
                style={{ fontSize: '10px', letterSpacing: '0.05em' }}
              >
                HARIAN (SAFE)
              </div>
            </div>
            <div
              className="fs-4 fw-bold text-warning mb-1 text-truncate"
              style={{ letterSpacing: '-0.5px' }}
            >
              {formatCurrency(safeToSpendPerDay)}
            </div>
            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
              Estimasi harian
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 d-flex justify-content-center">
        <PlanningSegmentedNav />
      </div>

      <div className="tab-content transition-all animate-in fade-in duration-500">
        <PlanningContext.Provider
          value={{
            goalsData,
            subsData,
            handleOpenAddGoal,
            handleEditGoal,
            setIsSubModalOpen,
          }}
        >
          <Outlet />
        </PlanningContext.Provider>
      </div>

      <Modal show={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} size="lg">
        <form onSubmit={handleAddGoalSubmit}>
          <ModalHeader
            title={editingGoal ? 'Edit Target Impian (Goal)' : 'Tambah Target Impian (Goal)'}
            onClose={() => setIsGoalModalOpen(false)}
          />
          <div className="modal-body py-4">
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label fw-bold small text-secondary">Nama Impian</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Contoh: DP Rumah, Liburan Jepang"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">Target Tabungan</label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold text-secondary">Rp</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">
                  Dana Terkumpul (Mulai Awal)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold text-secondary">Rp</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={goalSaved}
                    onChange={(e) => setGoalSaved(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">Setoran Bulanan</label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold text-secondary">Rp</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={goalMonthly}
                    onChange={(e) => setGoalMonthly(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">
                  Target Selesai (ETA)
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Contoh: Desember 2026"
                  value={goalEta}
                  onChange={(e) => setGoalEta(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label fw-bold small text-secondary">Pilih Icon Impian</label>
              <div className="d-flex gap-2">
                {['star', 'home', 'plane', 'car', 'device-laptop', 'gift'].map((iconName) => {
                  const isActive = goalIcon === iconName
                  return (
                    <button
                      key={iconName}
                      type="button"
                      className="btn p-0 d-flex align-items-center justify-content-center rounded-3"
                      onClick={() => setGoalIcon(iconName)}
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: isActive ? '#ff6b00' : 'transparent',
                        borderColor: isActive ? '#ff6b00' : 'var(--tblr-border-color)',
                        color: isActive ? '#ffffff' : 'var(--tblr-secondary)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon icon={iconName} size="sm" className="m-0" />
                    </button>
                  )
                })}
              </div>
            </div>
            <div
              className={`mt-4 d-flex ${editingGoal ? 'justify-content-between' : 'justify-content-end'} align-items-center`}
            >
              {editingGoal && (
                <Button
                  element="button"
                  type="button"
                  color="danger"
                  icon="trash"
                  onClick={() => handleDeleteGoal(editingGoal.id)}
                >
                  Hapus Impian
                </Button>
              )}
              <div className="d-flex gap-2">
                <Button
                  element="button"
                  type="button"
                  link
                  className="text-muted"
                  onClick={() => setIsGoalModalOpen(false)}
                >
                  Batal
                </Button>
                <Button element="button" type="submit" color="primary" icon="check">
                  {editingGoal ? 'Simpan Perubahan' : 'Simpan Impian'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <Modal show={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} size="lg">
        <form onSubmit={handleAddSubSubmit}>
          <ModalHeader
            title="Tambah Layanan Langganan (Subscription)"
            onClose={() => setIsSubModalOpen(false)}
          />
          <div className="modal-body py-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">Nama Layanan</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Contoh: Netflix, Spotify, iCloud"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">
                  Biaya Langganan (Bulanan)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold text-secondary">Rp</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={subCost}
                    onChange={(e) => setSubCost(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">
                  Tanggal Tagihan (Setiap Bulan)
                </label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  placeholder="Contoh: 15"
                  min="1"
                  max="31"
                  value={subDueDate}
                  onChange={(e) => setSubDueDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">Kategori Layanan</label>
                <select
                  className="form-select rounded-3"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                >
                  <option value="Streaming">Streaming (Hiburan)</option>
                  <option value="Kerja">Pekerjaan & Produktivitas</option>
                  <option value="Edukasi">Edukasi & Belajar</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">Status Pembayaran</label>
                <select
                  className="form-select rounded-3"
                  value={subStatus}
                  onChange={(e) => setSubStatus(e.target.value)}
                >
                  <option value="paid">Lunas (Paid)</option>
                  <option value="upcoming">Akan Datang (Upcoming)</option>
                  <option value="unpaid">Terlambat (Unpaid)</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">
                  Pilih Jenis Icon Layanan
                </label>
                <div className="d-flex gap-2">
                  {['device-tv', 'music', 'world', 'bolt', 'database'].map((iconName) => {
                    const isActive = subIcon === iconName
                    return (
                      <button
                        key={iconName}
                        type="button"
                        className="btn p-0 d-flex align-items-center justify-content-center rounded-3"
                        onClick={() => setSubIcon(iconName)}
                        style={{
                          width: '42px',
                          height: '42px',
                          backgroundColor: isActive ? 'var(--tblr-primary)' : 'transparent',
                          borderColor: isActive
                            ? 'var(--tblr-primary)'
                            : 'var(--tblr-border-color)',
                          color: isActive ? '#ffffff' : 'var(--tblr-secondary)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Icon icon={iconName} size="sm" className="m-0" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex justify-content-end gap-2">
              <Button
                element="button"
                type="button"
                link
                className="text-muted"
                onClick={() => setIsSubModalOpen(false)}
              >
                Batal
              </Button>
              <Button element="button" type="submit" color="primary" icon="check">
                Simpan Layanan
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </BaseLayout>
  )
}
