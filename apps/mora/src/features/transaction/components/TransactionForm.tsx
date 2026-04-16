import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type {
  TransactionType,
  Transaction
} from '../types/transaction.types';
import {
  useCategories,
  useCurrencies,
} from '../hooks/useLookups';
import { useAccounts } from '../hooks/useAccounts';
import {
  Button,
  Select,
} from '@/shared/components/ui';
import { TagInput } from './TagInput';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  amount_raw: z.number().min(1, 'Nominal harus lebih dari 0'),
  account_id: z.number({ message: 'Pilih akun' }),
  to_account_id: z.number().optional().nullable(),
  category_id: z.number().optional().nullable(),
  currency_id: z.number().optional(),
  tx_date: z.string().min(1, 'Tanggal wajib diisi'),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  tag_ids: z.array(z.number()),
}).refine((data) => {
  if (data.type === 'transfer' && !data.to_account_id) return false;
  return true;
}, {
  message: 'Akun tujuan wajib diisi untuk transfer',
  path: ['to_account_id'],
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  initialData?: Partial<Transaction>;
  onSubmit: (data: TransactionFormValues) => void;
  isLoading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  isLoading
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: (initialData?.type as TransactionType) || 'expense',
      amount_raw: initialData?.amount_raw || 0,
      account_id: initialData?.account_id,
      to_account_id: initialData?.to_account_id,
      category_id: initialData?.category_id,
      currency_id: initialData?.currency_id,
      tx_date: initialData?.tx_date || new Date().toISOString().split('T')[0],
      merchant: initialData?.merchant || '',
      notes: initialData?.notes || '',
      tag_ids: initialData?.tags?.map(t => t.id) || [],
    },
  });

  const type = useWatch({
    control,
    name: 'type',
    defaultValue: (initialData?.type as TransactionType) || 'expense',
  });
  const { data: categories = [] } = useCategories(type);
  const { data: accounts = [] } = useAccounts();
  const { data: currencies = [] } = useCurrencies();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="transaction-form">
      <div className="mb-3">
        <label className="form-label">Tipe Transaksi</label>
        <div className="form-selectgroup">
          {(['expense', 'income', 'transfer'] as const).map((t) => (
            <label key={t} className="form-selectgroup-item">
              <input
                type="radio"
                {...register('type')}
                value={t}
                className="form-selectgroup-input"
              />
              <span className="form-selectgroup-label text-capitalize">
                {t === 'income' ? 'Pemasukan' : t === 'expense' ? 'Pengeluaran' : 'Transfer'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Nominal</label>
          <div className="input-group">
            <Controller
              name="currency_id"
              control={control}
              render={({ field }) => (
                <select
                  className="form-select"
                  style={{ maxWidth: '90px' }}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <option value="">IDR</option>
                  {currencies.filter(c => !c.is_default).map(c => (
                    <option key={c.id} value={c.id}>{c.code}</option>
                  ))}
                </select>
              )}
            />
            <input
              type="number"
              {...register('amount_raw', { valueAsNumber: true })}
              className={`form-control ${errors.amount_raw ? 'is-invalid' : ''}`}
              placeholder="0"
            />
            {errors.amount_raw && <div className="invalid-feedback">{errors.amount_raw.message}</div>}
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Tanggal</label>
          <input
            type="date"
            {...register('tx_date')}
            className={`form-control ${errors.tx_date ? 'is-invalid' : ''}`}
          />
          {errors.tx_date && <div className="invalid-feedback">{errors.tx_date.message}</div>}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">{type === 'transfer' ? 'Dari Akun' : 'Akun'}</label>
          <Controller
            name="account_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={accounts.map(a => ({
                  value: a.id,
                  label: `${a.name} (${a.currency?.code || 'IDR'})`
                }))}
                placeholder="Pilih Akun"
                error={errors.account_id?.message}
              />
            )}
          />
        </div>

        {type === 'transfer' ? (
          <div className="col-md-6 mb-3">
            <label className="form-label">Ke Akun</label>
            <Controller
              name="to_account_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={accounts.map(a => ({
                    value: a.id,
                    label: `${a.name} (${a.currency?.code || 'IDR'})`
                  }))}
                  placeholder="Pilih Akun Tujuan"
                  error={errors.to_account_id?.message}
                />
              )}
            />
          </div>
        ) : (
          <div className="col-md-6 mb-3">
            <label className="form-label">Kategori</label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={categories.map(c => ({
                    value: c.id,
                    label: c.name,
                    icon: c.icon
                  }))}
                  placeholder="Pilih Kategori"
                  error={errors.category_id?.message}
                />
              )}
            />
          </div>
        )}
      </div>

      {type !== 'transfer' && (
        <div className="mb-3">
          <label className="form-label">Merchant / Penerima</label>
          <input
            type="text"
            {...register('merchant')}
            className="form-control"
            placeholder="Misal: Starbucks, Tokopedia, dll"
          />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Tags</label>
        <Controller
          name="tag_ids"
          control={control}
          render={({ field }) => (
            <TagInput
              selectedTagIds={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Catatan</label>
        <textarea
          {...register('notes')}
          className="form-control"
          rows={3}
          placeholder="Tambahkan catatan jika perlu..."
        ></textarea>
      </div>

      <div className="mt-4 d-flex justify-content-end gap-2">
        <Button link href="/transactions" className="text-muted">
          Batal
        </Button>
        <Button
          type="submit"
          color="primary"
          loading={isLoading}
          icon="check"
        >
          {initialData?.id ? 'Simpan Perubahan' : 'Simpan Transaksi'}
        </Button>
      </div>
    </form>
  );
};
