import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Account } from '../types/transaction.types';
import { useCurrencies } from '../hooks/useLookups';
import { Button, Select } from '@/shared/components/ui';

const accountSchema = z.object({
  name: z.string().min(1, 'Nama akun wajib diisi'),
  type: z.enum(['cash', 'bank', 'e-wallet', 'investment']),
  currency_id: z.number({ message: 'Pilih mata uang' }),
  color: z.string(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountFormProps {
  initialData?: Partial<Account>;
  onSubmit: (data: AccountFormValues) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  initialData,
  onSubmit,
  onDelete,
  isLoading
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: React.useMemo(() => ({
      name: initialData?.name || '',
      type: initialData?.type || 'bank',
      currency_id: initialData?.currency_id as number,
      color: initialData?.color || '#206bc4',
    }), [initialData]),
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        type: initialData.type || 'bank',
        currency_id: initialData.currency_id,
        color: initialData.color || '#206bc4',
      });
    } else {
      reset({
        name: '',
        type: 'bank',
        currency_id: undefined as any,
        color: '#206bc4',
      });
    }
  }, [initialData, reset]);

  const { data: currencies = [] } = useCurrencies();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="account-form">
      <div className="mb-3">
        <label className="form-label">Nama Akun / Bank</label>
        <input
          type="text"
          {...register('name')}
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          placeholder="Misal: BCA, Mandiri, Dompet, dll"
        />
        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Tipe Akun</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: 'cash', label: 'Tunai / Cash' },
                  { value: 'bank', label: 'Rekening Bank' },
                  { value: 'e-wallet', label: 'E-Wallet (OVO, Dana, dll)' },
                  { value: 'investment', label: 'Investasi' },
                ]}
                placeholder="Pilih Tipe"
                error={errors.type?.message}
              />
            )}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Mata Uang</label>
          <Controller
            name="currency_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={currencies.map(c => ({
                  value: c.id,
                  label: `${c.code} - ${c.name}`
                }))}
                placeholder="Pilih Mata Uang"
                error={errors.currency_id?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Warna Label</label>
        <input
          type="color"
          {...register('color')}
          className="form-control form-control-color"
          title="Pilih warna akun"
        />
      </div>

      <div className="mt-5 d-flex justify-content-between align-items-center pt-3 border-top">
        <div>
          {initialData?.id && onDelete && (
            <Button
              element="button"
              type="button"
              color="danger"
              outline
              className="border-0 bg-danger-lt fw-bold"
              onClick={onDelete}
              icon="trash"
            >
              Hapus Akun
            </Button>
          )}
        </div>
        <div className="d-flex gap-2">
            <Button
              element="button"
              type="submit"
              color="primary"
              loading={isLoading}
              spinner={isLoading}
              icon={!isLoading ? "check" : undefined}
              className="px-4 fw-bold"
            >
            {initialData?.id ? 'Simpan Perubahan' : 'Buat Akun'}
          </Button>
        </div>
      </div>
    </form>
  );
};
