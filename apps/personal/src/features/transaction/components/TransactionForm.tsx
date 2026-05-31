import React from 'react'
import { useForm, Controller, useWatch, type FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Transaction } from '../types/transaction.types'
import { useCategories, useCurrencies, useTags } from '../hooks/useLookups'
import { useAccounts } from '../hooks/useAccounts'
import { Button, Select, Icon, AutosizeTextarea, Datepicker } from '@/shared/components/ui'
import { ErrorAlert } from '@/shared/components/ui/ErrorAlert'

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(1, 'Nominal harus lebih dari 0'),
  account_id: z.string({ message: 'Pilih akun' }),
  category_id: z.string().optional().nullable(),
  currency_id: z.string().optional(),
  tx_date: z.string().min(1, 'Tanggal wajib diisi'),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  tag_ids: z.array(z.string()),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  initialData?: Partial<Transaction>
  onSubmit: (data: TransactionFormValues) => void
  isLoading?: boolean
  onCancel?: () => void
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: (initialData?.type === 'income' ? 'income' : 'expense') as 'income' | 'expense',
      amount: initialData?.amount || 0,
      account_id: initialData?.account_id,
      category_id: initialData?.category_id,
      currency_id: initialData?.currency_id,
      tx_date: initialData?.tx_date || new Date().toISOString().split('T')[0],
      merchant: initialData?.merchant || '',
      notes: initialData?.notes || '',
      tag_ids: initialData?.tags?.map((t) => t.id) || [],
    },
  })

  React.useEffect(() => {
    if (initialData) {
      reset({
        type: (initialData.type === 'income' ? 'income' : 'expense') as 'income' | 'expense',
        amount: initialData.amount || 0,
        account_id: initialData.account_id,
        category_id: initialData.category_id,
        currency_id: initialData.currency_id,
        tx_date: initialData.tx_date || new Date().toISOString().split('T')[0],
        merchant: initialData.merchant || '',
        notes: initialData.notes || '',
        tag_ids: initialData.tags?.map((t) => t.id) || [],
      })
    } else {
      reset({
        type: 'expense',
        amount: 0,
        account_id: undefined,
        category_id: undefined,
        currency_id: undefined,
        tx_date: new Date().toISOString().split('T')[0],
        merchant: '',
        notes: '',
        tag_ids: [],
      })
    }
  }, [initialData, reset])

  const type = useWatch({
    control,
    name: 'type',
    defaultValue: (initialData?.type === 'income' ? 'income' : 'expense') as 'income' | 'expense',
  })
  const { data: categories = [] } = useCategories(type)
  const { data: response } = useAccounts()
  const accounts = response?.data || []
  const { data: currencies = [] } = useCurrencies()
  const { data: tags = [] } = useTags()

  const currencyOptions = React.useMemo(() => {
    const options = currencies.map((c) => ({
      value: c.id,
      label: c.code,
    }))

    if (!options.find((o) => o.label === 'IDR')) {
      options.unshift({ value: '0', label: 'IDR' })
    }

    return options
  }, [currencies])

  const getFieldErrors = () => {
    if (Object.keys(errors).length === 0) return null
    const formatted: Record<string, string[]> = {}
    Object.entries(errors).forEach(([key, err]) => {
      if (err && typeof err === 'object' && 'message' in err) {
        const error = err as FieldError
        if (typeof error.message === 'string') {
          formatted[key] = [error.message]
        }
      }
    })
    return formatted
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="transaction-form">
      {Object.keys(errors).length > 0 && (
        <div className="mb-4">
          <ErrorAlert
            message="Validasi Gagal: Silakan lengkapi data yang diwajibkan."
            fieldErrors={getFieldErrors()}
          />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Tipe Transaksi</label>
        <div className="form-selectgroup">
          {(['expense', 'income'] as const).map((t) => (
            <label key={t} className="form-selectgroup-item">
              <input
                type="radio"
                {...register('type')}
                value={t}
                className="form-selectgroup-input"
              />
              <span className="form-selectgroup-label text-capitalize">
                {t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Nominal</label>
          <div className={`input-group ${errors.amount ? 'has-validation' : ''}`}>
            <div style={{ width: '100px' }} className="flex-shrink-0">
              <Controller
                name="currency_id"
                control={control}
                render={({ field }) => (
                  <Select
                    className="h-100"
                    triggerClassName="rounded-end-0 border-end-0"
                    options={currencyOptions}
                    value={field.value || '0'}
                    onChange={(val) => field.onChange(val === '0' ? undefined : val)}
                    placeholder="IDR"
                  />
                )}
              />
            </div>
            <input
              type="number"
              {...register('amount', { valueAsNumber: true })}
              className={`form-control rounded-start-0 ${errors.amount ? 'is-invalid' : ''}`}
              placeholder="0"
            />
            {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Tanggal</label>
          <Controller
            name="tx_date"
            control={control}
            render={({ field }) => (
              <Datepicker
                id="datepicker-tx"
                layout="icon"
                value={field.value}
                onChange={field.onChange}
                className={errors.tx_date ? 'is-invalid' : ''}
              />
            )}
          />
          {errors.tx_date && (
            <div className="invalid-feedback d-block">{errors.tx_date.message}</div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Akun</label>
          <Controller
            name="account_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={accounts.map((a) => ({
                  value: a.id,
                  label: `${a.name} (${a.currency?.code || 'IDR'})`,
                }))}
                placeholder="Pilih Akun"
                error={errors.account_id?.message}
              />
            )}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Kategori</label>
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ''}
                onChange={field.onChange}
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                  icon: c.icon,
                  color: c.color,
                }))}
                placeholder="Pilih Kategori"
                error={errors.category_id?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Merchant / Penerima</label>
          <div className="input-icon">
            <span className="input-icon-addon">
              <Icon icon="building-store" size={18} />
            </span>
            <input
              type="text"
              {...register('merchant')}
              className="form-control"
              placeholder="Misal: Starbucks, Tokopedia, dll"
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Tags</label>
        <Controller
          name="tag_ids"
          control={control}
          render={({ field }) => (
            <Select
              multiple
              value={field.value}
              onChange={field.onChange}
              options={tags.map((t) => ({
                value: t.id,
                label: t.name,
                color: t.color,
              }))}
              placeholder="Pilih tags..."
            />
          )}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Catatan</label>
        <AutosizeTextarea
          {...register('notes')}
          rows={3}
          placeholder="Tambahkan catatan jika perlu..."
        />
      </div>

      <div className="mt-4 d-flex justify-content-end gap-2">
        {onCancel ? (
          <Button element="button" type="button" link className="text-muted" onClick={onCancel}>
            Batal
          </Button>
        ) : (
          <Button link to="/transactions" className="text-muted">
            Batal
          </Button>
        )}
        <Button element="button" type="submit" color="primary" loading={isLoading} icon="check">
          {initialData?.id ? 'Simpan Perubahan' : 'Simpan Transaksi'}
        </Button>
      </div>
    </form>
  )
}
