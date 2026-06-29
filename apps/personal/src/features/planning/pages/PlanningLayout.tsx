import React, { useState, useEffect, useRef } from 'react'
import { Outlet } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { PlanningSegmentedNav } from '../components/shared/PlanningSegmentedNav'
import { BudgetSummaryCards } from '../components/budget/BudgetSummaryCards'
import { Icon, MonthPicker, Modal, ModalHeader, Button, Datepicker, ErrorAlert, Select } from '@/shared/components/ui'

import type { Goal, GoalsData, SubscriptionsData } from '../types'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { 
  useGoals, 
  useSubscriptions, 
  useBudgets, 
  useCreateGoal, 
  useUpdateGoal, 
  useDeleteGoal,
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription 
} from '../hooks/usePlanning'

export const PlanningContext = React.createContext<any>(null)

export function PlanningLayout() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)

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
  const [subCategory, setSubCategory] = useState('Hiburan')
  const [subStatus, setSubStatus] = useState('upcoming')
  const [subIcon, setSubIcon] = useState('device-tv')

  const [goalError, setGoalError] = useState<string | null>(null)
  const [subError, setSubError] = useState<string | null>(null)

  const [editingSub, setEditingSub] = useState<any>(null)
  const [isDeleteSubModalOpen, setIsDeleteSubModalOpen] = useState(false)
  const [subToDelete, setSubToDelete] = useState<string | null>(null)

  const { data: apiGoalsData } = useGoals()
  const { data: apiSubsData } = useSubscriptions()
  const { data: budgetData } = useBudgets()

  const { mutateAsync: createGoal } = useCreateGoal()
  const { mutateAsync: updateGoal } = useUpdateGoal()
  const { mutateAsync: deleteGoal } = useDeleteGoal()

  const { mutateAsync: createSubscription } = useCreateSubscription()
  const { mutateAsync: updateSubscription } = useUpdateSubscription()
  const { mutateAsync: deleteSubscription } = useDeleteSubscription()

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
  const safeToSpendPerDay = budgetData?.safeToSpendPerDay || 0

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
    setGoalEta(goal.rawEta || '')
    setGoalIcon(goal.icon)
    setIsGoalModalOpen(true)
  }

  const handleAddGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: goalName,
      target: parseFloat(goalTarget) || 0,
      saved: parseFloat(goalSaved) || 0,
      monthlyDeposit: parseFloat(goalMonthly) || 0,
      eta: goalEta,
      icon: goalIcon,
      color: '#ff6b00',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=cover&w=400&q=80',
    }

    setGoalError(null)
    try {
      if (editingGoal) {
        await updateGoal({ id: editingGoal.id, data: payload })
      } else {
        await createGoal(payload)
      }

      setIsGoalModalOpen(false)
      setEditingGoal(null)
      setGoalName('')
      setGoalTarget('')
      setGoalSaved('')
      setGoalMonthly('')
      setGoalEta('')
      setGoalIcon('star')
    } catch (error: any) {
      console.error('Failed to save goal', error)
      setGoalError(error?.response?.data?.message || 'Gagal menyimpan impian. Silakan coba lagi.')
    }
  }

  const confirmDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteGoal = async () => {
    if (goalToDelete) {
      try {
        await deleteGoal(goalToDelete)
        setIsDeleteModalOpen(false)
        setGoalToDelete(null)
        setIsGoalModalOpen(false)
        setEditingGoal(null)
        setGoalName('')
        setGoalTarget('')
        setGoalSaved('')
        setGoalMonthly('')
        setGoalEta('')
        setGoalIcon('star')
      } catch (error: any) {
        console.error('Failed to delete goal', error)
        setGoalError(error?.response?.data?.message || 'Gagal menghapus impian. Silakan coba lagi.')
        setIsDeleteModalOpen(false)
      }
    }
  }

  const handleOpenAddSub = () => {
    setEditingSub(null)
    setSubName('')
    setSubCost('')
    setSubDueDate('')
    setSubCategory('Hiburan')
    setSubStatus('upcoming')
    setSubIcon('device-tv')
    setIsSubModalOpen(true)
  }

  const handleEditSub = (sub: any) => {
    setEditingSub(sub)
    setSubName(sub.name)
    setSubCost(sub.amount.toString())
    const cleanDate = sub.dueDate ? sub.dueDate.substring(0, 10) : ''
    setSubDueDate(cleanDate)
    setSubStatus(sub.status)
    setSubIcon(sub.icon || 'device-tv')
    setIsSubModalOpen(true)
  }

  const confirmDeleteSub = (subId: string) => {
    setSubToDelete(subId)
    setIsDeleteSubModalOpen(true)
  }

  const handleDeleteSub = async () => {
    if (subToDelete) {
      try {
        await deleteSubscription(subToDelete)
        setIsDeleteSubModalOpen(false)
        setSubToDelete(null)
        setIsSubModalOpen(false)
      } catch (error: any) {
        console.error('Failed to delete sub', error)
        setSubError(error?.response?.data?.message || 'Gagal menghapus langganan. Silakan coba lagi.')
        setIsDeleteSubModalOpen(false)
      }
    }
  }

  const handleAddSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: subName,
      amount: parseFloat(subCost) || 0,
      dueDate: subDueDate, // using the full date from datepicker
      status: subStatus as 'paid' | 'unpaid' | 'upcoming',
      icon: subIcon,
      color: '#5b9ef7',
    }

    setSubError(null)
    try {
      if (editingSub) {
        await updateSubscription({ id: editingSub.id, data: payload })
      } else {
        await createSubscription(payload)
      }
      setIsSubModalOpen(false)
      setSubName('')
      setSubCost('')
      setSubDueDate('')
      setSubCategory('Hiburan')
      setSubStatus('upcoming')
      setSubIcon('device-tv')
    } catch (error: any) {
      console.error('Failed to save subscription', error)
      setSubError(error?.response?.data?.message || 'Gagal menyimpan langganan. Silakan coba lagi.')
    }
  }

  return (
    <BaseLayout
      pageTitle="Financial Planning"
      pagePretitle="STRATEGY"
      showBackButton={false}
    >
      <div className="d-flex flex-column gap-4">
        <div className="d-flex flex-wrap gap-3">
          <BudgetSummaryCards 
            totalBudget={totalBudget} 
            spent={spent} 
            safeToSpendPerDay={safeToSpendPerDay} 
            currentDate={currentDate}
          />
        </div>

        <div className="d-flex justify-content-center">
          <PlanningSegmentedNav />
        </div>

        <div className="tab-content transition-all animate-in fade-in duration-500">
          <PlanningContext.Provider
            value={{
              goalsData,
              subsData,
              handleOpenAddGoal,
              handleEditGoal,
              handleOpenAddSub,
              handleEditSub,
              confirmDeleteSub,
            }}
          >
            <Outlet />
          </PlanningContext.Provider>
        </div>
      </div>

      <Modal show={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} size="lg">
        <form onSubmit={handleAddGoalSubmit}>
          <ModalHeader
            title={editingGoal ? 'Edit Target Impian (Goal)' : 'Tambah Target Impian (Goal)'}
            onClose={() => setIsGoalModalOpen(false)}
          />
          <div className="modal-body py-4">
            {goalError && (
              <div className="mb-3">
                <ErrorAlert message={goalError} />
              </div>
            )}
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
                <Datepicker
                  layout="icon"
                  value={goalEta}
                  onChange={(val) => setGoalEta(val)}
                  placeholder="Pilih Tanggal"
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
                  onClick={() => confirmDeleteGoal(editingGoal.id)}
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
            title={editingSub ? 'Edit Layanan Langganan' : 'Tambah Layanan Langganan (Subscription)'}
            onClose={() => setIsSubModalOpen(false)}
          />
          <div className="modal-body py-4">
            {subError && (
              <div className="mb-3">
                <ErrorAlert message={subError} />
              </div>
            )}
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
                  Tanggal Tagihan Berikutnya
                </label>
                <Datepicker
                  layout="icon"
                  value={subDueDate}
                  onChange={(val) => setSubDueDate(val)}
                  placeholder="Pilih Tanggal"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">Kategori Layanan</label>
                <Select
                  value={subCategory}
                  onChange={(val) => setSubCategory(val)}
                  options={[
                    { value: 'Hiburan', label: 'Hiburan' },
                    { value: 'Kerja', label: 'Pekerjaan & Produktivitas' },
                    { value: 'Edukasi', label: 'Edukasi & Belajar' },
                    { value: 'Lainnya', label: 'Lainnya' },
                  ]}
                  placeholder="Pilih Kategori"
                  showSearch={false}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-secondary">Status Pembayaran</label>
                <Select
                  value={subStatus}
                  onChange={(val) => setSubStatus(val)}
                  options={[
                    { value: 'paid', label: 'Lunas (Paid)' },
                    { value: 'upcoming', label: 'Akan Datang (Upcoming)' },
                    { value: 'unpaid', label: 'Terlambat (Unpaid)' },
                  ]}
                  placeholder="Pilih Status"
                  showSearch={false}
                />
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
            <div
              className={`mt-4 d-flex ${editingSub ? 'justify-content-between' : 'justify-content-end'} align-items-center`}
            >
              {editingSub && (
                <Button
                  element="button"
                  type="button"
                  color="danger"
                  icon="trash"
                  onClick={() => confirmDeleteSub(editingSub.id)}
                >
                  Hapus
                </Button>
              )}
              <div className="d-flex gap-2">
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
                  {editingSub ? 'Simpan Perubahan' : 'Simpan Layanan'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <ModalHeader title="Konfirmasi Hapus" onClose={() => setIsDeleteModalOpen(false)} />
        <div className="modal-body py-4 text-center">
          <div className="mb-3">
            <Icon icon="alert-triangle" size="lg" className="text-danger" />
          </div>
          <h4 className="fw-bold mb-2">Hapus Impian?</h4>
          <p className="text-secondary small mb-4">
            Apakah Anda yakin ingin menghapus impian ini? Data yang sudah dihapus tidak dapat dikembalikan.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button
              element="button"
              type="button"
              link
              className="text-muted"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </Button>
            <Button element="button" type="button" color="danger" onClick={handleDeleteGoal}>
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>

      <Modal show={isDeleteSubModalOpen} onClose={() => setIsDeleteSubModalOpen(false)} size="sm">
        <ModalHeader title="Konfirmasi Hapus" onClose={() => setIsDeleteSubModalOpen(false)} />
        <div className="modal-body py-4 text-center">
          <div className="mb-3">
            <Icon icon="alert-triangle" size="lg" className="text-danger" />
          </div>
          <h4 className="fw-bold mb-2">Hapus Langganan?</h4>
          <p className="text-secondary small mb-4">
            Apakah Anda yakin ingin menghapus langganan ini? Data yang sudah dihapus tidak dapat dikembalikan.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button
              element="button"
              type="button"
              link
              className="text-muted"
              onClick={() => setIsDeleteSubModalOpen(false)}
            >
              Batal
            </Button>
            <Button element="button" type="button" color="danger" onClick={handleDeleteSub}>
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </BaseLayout>
  )
}
