import { useState } from 'react'
import BaseLayout from '@/shared/layouts/BaseLayout'
import {
  Button,
  Icon,
  Modal,
  ModalHeader,
  Select,
  Datepicker,
  AutosizeTextarea,
} from '@/shared/components/ui'
import { useAccounts } from '@/features/transaction/hooks/useAccounts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CreditHeroBanner } from '../components/CreditHeroBanner'
import type { Account } from '@/features/transaction/types/transaction.types'

import { CreditAlertsDropdown } from '../components/CreditAlertsDropdown'
import { Outlet } from '@tanstack/react-router'
import { CreditSegmentedNav } from '../components/shared/CreditSegmentedNav'
import { CreditLayoutContext } from '../context/CreditLayoutContext'

export default function CreditLayout() {
  const queryClient = useQueryClient()
  const { data: accountsResponse } = useAccounts()
  const accounts = accountsResponse?.data || []

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    credit_type: 'credit_card' as 'credit_card' | 'kta' | 'kpr' | 'paylater' | 'other',
    limit: 0,
    total_amount: 0,
    installment_amount: 0,
    interest_rate: 0,
    tenor_months: 0,
    billing_cycle_day: 0,
    minimum_payment: 0,
    due_date: '',
    notes: '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (!selectedAccount) throw new Error('Account not selected')

      const stored = localStorage.getItem('visatamora_credits')
      let credits: Account[] = []
      if (stored) {
        try {
          credits = JSON.parse(stored)
        } catch (e) {}
      }

      const existingIndex = credits.findIndex((c) => c.id === selectedAccount.id)

      const updatedCredit = {
        credit_type: data.credit_type,
        limit: data.limit,
        total_amount: data.total_amount,
        installment_amount: data.installment_amount,
        interest_rate: data.interest_rate,
        tenor_months: data.tenor_months,
        billing_cycle_day: data.billing_cycle_day,
        minimum_payment: data.minimum_payment,
        due_date: data.due_date,
        notes: data.notes,
      }

      if (existingIndex >= 0) {
        credits[existingIndex] = {
          ...credits[existingIndex],
          balance: -data.total_amount,
          credit: updatedCredit,
        }
      } else {
        const newAcc: Account = {
          id: selectedAccount.id,
          name: selectedAccount.name,
          account_type:
            data.credit_type === 'kta' || data.credit_type === 'kpr' ? 'loan' : 'credit',
          balance: -data.total_amount,
          currency: selectedAccount.currency || 'IDR',
          provider: selectedAccount.provider || { name: 'Bank' },
          color: selectedAccount.color || '#206bc4',
          credit: updatedCredit,
        }
        credits.push(newAcc)
      }

      localStorage.setItem('visatamora_credits', JSON.stringify(credits))
      return { success: true, data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] })
      setIsModalOpen(false)
      setSelectedAccount(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const stored = localStorage.getItem('visatamora_credits')
      if (stored) {
        try {
          let credits: Account[] = JSON.parse(stored)
          credits = credits.filter((c) => c.id !== id)
          localStorage.setItem('visatamora_credits', JSON.stringify(credits))
        } catch (e) {}
      }
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] })
    },
  })

  const openForm = (account: Account) => {
    setSelectedAccount(account)
    if (account.credit) {
      setFormData({
        credit_type: account.credit.credit_type || 'credit_card',
        limit: account.credit.limit,
        total_amount: account.credit.total_amount,
        installment_amount: account.credit.installment_amount,
        interest_rate: account.credit.interest_rate || 0,
        tenor_months: account.credit.tenor_months || 0,
        billing_cycle_day: account.credit.billing_cycle_day || 0,
        minimum_payment: account.credit.minimum_payment || 0,
        due_date: account.credit.due_date ? account.credit.due_date.split('T')[0] : '',
        notes: account.credit.notes || '',
      })
    } else {
      setFormData({
        credit_type: 'credit_card',
        limit: 0,
        total_amount: 0,
        installment_amount: 0,
        interest_rate: 0,
        tenor_months: 0,
        billing_cycle_day: 0,
        minimum_payment: 0,
        due_date: '',
        notes: '',
      })
    }
    setIsModalOpen(true)
  }

  const openFormForType = (type: 'credit_card' | 'kta' | 'kpr' | 'paylater') => {
    setSelectedAccount(null)
    setFormData({
      credit_type: type,
      limit: 0,
      total_amount: 0,
      installment_amount: 0,
      interest_rate: 0,
      tenor_months: 0,
      billing_cycle_day: 0,
      minimum_payment: 0,
      due_date: '',
      notes: '',
    })
    setIsModalOpen(true)
  }

  const accountOptions = accounts.map((acc: Account) => ({
    value: acc.id,
    label: acc.name,
    color: acc.color,
  }))

  return (
    <BaseLayout 
      pageTitle="Manajemen Kredit & Pinjaman"
      pageActions={<CreditAlertsDropdown />}
    >
      <div className="container-xl pt-3 pb-5">
        <div className="d-flex flex-column gap-3">
          <CreditHeroBanner />
          <CreditSegmentedNav />
          <CreditLayoutContext.Provider value={{ openFormForType }}>
            <Outlet />
          </CreditLayoutContext.Provider>
        </div>
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalHeader
          title={
            selectedAccount ? `Profil Kredit: ${selectedAccount.name}` : 'Tambah Profil Kredit Baru'
          }
          onClose={() => setIsModalOpen(false)}
        />
        <div className="modal-body pt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate(formData)
            }}
          >
            {!selectedAccount && (
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label fw-bold">Pilih Rekening / Akun</label>
                  <Select
                    options={accountOptions}
                    placeholder="Pilih rekening untuk profil kredit ini"
                    showSearch={true}
                    onChange={(val) => {
                      const acc = accounts.find((a: Account) => a.id === val)
                      if (acc) {
                        setSelectedAccount(acc)
                        if (acc.credit) {
                          setFormData({
                            credit_type: acc.credit.credit_type || formData.credit_type,
                            limit: acc.credit.limit,
                            total_amount: acc.credit.total_amount,
                            installment_amount: acc.credit.installment_amount,
                            interest_rate: acc.credit.interest_rate || 0,
                            tenor_months: acc.credit.tenor_months || 0,
                            billing_cycle_day: acc.credit.billing_cycle_day || 0,
                            minimum_payment: acc.credit.minimum_payment || 0,
                            due_date: acc.credit.due_date ? acc.credit.due_date.split('T')[0] : '',
                            notes: acc.credit.notes || '',
                          })
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Jenis Kredit</label>
              <div className="form-selectgroup">
                {[
                  { value: 'credit_card', label: 'Credit Card' },
                  { value: 'kta', label: 'KTA / Pinjaman' },
                  { value: 'kpr', label: 'KPR / Mortgage' },
                  { value: 'paylater', label: 'Paylater' },
                ].map((item) => (
                  <label key={item.value} className="form-selectgroup-item">
                    <input
                      type="radio"
                      name="credit_type"
                      value={item.value}
                      checked={formData.credit_type === item.value}
                      onChange={() => setFormData({ ...formData, credit_type: item.value as any })}
                      className="form-selectgroup-input"
                    />
                    <span className="form-selectgroup-label">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Suku Bunga (% p.a.)</label>
                <div className="input-group">
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.interest_rate}
                    onChange={(e) =>
                      setFormData({ ...formData, interest_rate: parseFloat(e.target.value) || 0 })
                    }
                  />
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Limit Kredit (Plafon)</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.limit}
                    onChange={(e) =>
                      setFormData({ ...formData, limit: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Total Pinjaman Saat Ini</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.total_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, total_amount: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Besar Cicilan</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.installment_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        installment_amount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Tenggat Waktu (Jatuh Tempo)</label>
                <Datepicker
                  value={formData.due_date}
                  onChange={(val) => setFormData({ ...formData, due_date: val })}
                  layout="icon"
                />
              </div>
            </div>

            {(formData.credit_type === 'kta' || formData.credit_type === 'kpr') && (
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Tenor (Bulan)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.tenor_months}
                    onChange={(e) =>
                      setFormData({ ...formData, tenor_months: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            )}

            {formData.credit_type === 'credit_card' && (
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Siklus Penagihan (Tanggal)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    className="form-control"
                    value={formData.billing_cycle_day}
                    onChange={(e) =>
                      setFormData({ ...formData, billing_cycle_day: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pembayaran Minimum</label>
                  <div className="input-group">
                    <span className="input-group-text">Rp</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.minimum_payment}
                      onChange={(e) =>
                        setFormData({ ...formData, minimum_payment: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Catatan Tambahan</label>
              <AutosizeTextarea
                className="form-control"
                rows={3}
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Misal: Cicilan rumah ke-12"
              />
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <div>
                {selectedAccount?.credit && (
                  <Button
                    element="button"
                    type="button"
                    color="ghost-danger"
                    onClick={() => {
                      if (
                        window.confirm('Hapus profil kredit ini? Semua data terkait akan hilang.')
                      ) {
                        deleteMutation.mutate(selectedAccount.id)
                        setIsModalOpen(false)
                      }
                    }}
                    loading={deleteMutation.isPending}
                  >
                    <Icon icon="trash" size={16} className="me-2" />
                    Hapus Profil
                  </Button>
                )}
              </div>
              <div className="d-flex gap-2">
                <Button
                  element="button"
                  type="button"
                  link
                  className="text-muted"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  element="button"
                  type="submit"
                  color="primary"
                  icon="check"
                  loading={mutation.isPending}
                  disabled={!selectedAccount}
                >
                  Simpan Profil
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </BaseLayout>
  )
}
