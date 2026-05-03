import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Account, Provider } from '../types/transaction.types';
import { useCurrencies } from '../hooks/useLookups';
import { useProviders } from '../hooks/useProviders';
import { Button, Select, Icon } from '@/shared/components/ui';
import { AsyncSelect } from '@/shared/components/ui/Select/AsyncSelect';

const accountSchema = z.object({
  name: z.string().min(1, 'Nama akun wajib diisi'),
  account_type: z.enum(['cash', 'bank', 'e-wallet', 'investment', 'credit', 'saving', 'loan']),
  currency_id: z.string({ message: 'Pilih mata uang' }),
  provider_id: z.string().optional().nullable(),
  color: z.string(),
  is_archived: z.boolean().optional(),
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
    setValue,
    watch,
    formState: { errors }
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: React.useMemo(() => ({
      name: initialData?.name || '',
      account_type: initialData?.account_type || 'bank',
      currency_id: initialData?.currency_id || '',
      provider_id: initialData?.provider_id || null,
      color: initialData?.color || '#206bc4',
      is_archived: initialData?.is_archived || false,
    }), [initialData]),
  });

  const { data: providers = [] } = useProviders();
  const { data: currencies = [] } = useCurrencies();

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        account_type: initialData.account_type || 'bank',
        currency_id: initialData.currency_id,
        provider_id: initialData.provider_id || null,
        color: initialData.color || '#206bc4',
        is_archived: initialData.is_archived || false,
      });
    }
  }, [initialData, reset]);

  const selectedProviderId = watch('provider_id');

  const handleProviderChange = (provider: any | null) => {
    if (provider) {
      setValue('provider_id', provider.id);
      setValue('name', provider.name);
      setValue('account_type', provider.type === 'bank' ? 'bank' : provider.type === 'ewallet' ? 'e-wallet' : 'investment');
      if (provider.color) setValue('color', provider.color);
    } else {
      setValue('provider_id', null);
    }
  };

  const loadProviderOptions = async (inputValue: string) => {
    return providers
      .filter(p => p.name.toLowerCase().includes(inputValue.toLowerCase()))
      .map(p => ({
        ...p,
        value: p.id,
        label: p.name,
      }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="account-form">
      <div className="mb-3">
        <label className="form-label">Cari Bank / E-Wallet</label>
        <AsyncSelect<any>
          loadOptions={loadProviderOptions}
          onChange={handleProviderChange}
          value={providers.find(p => p.id === selectedProviderId) || null}
          placeholder="Cari BCA, Mandiri, GoPay..."
        />
        <div className="form-hint mt-1">Atau masukkan nama manual di bawah jika tidak ditemukan.</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Nama Akun</label>
        <input
          type="text"
          {...register('name')}
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          placeholder="Misal: BCA Tabungan, Dompet Utama"
        />
        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Tipe Akun</label>
          <Controller
            name="account_type"
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
                error={errors.account_type?.message}
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

      {initialData?.id && (
        <div className="mb-3">
          <label className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              {...register('is_archived')} 
            />
            <span className="form-check-label">Arsipkan Akun Ini</span>
          </label>
          <div className="form-hint">
            Akun yang diarsipkan tidak akan muncul di daftar aktif dan ringkasan kekayaan.
          </div>
        </div>
      )}

      <div className="mt-5 d-flex justify-content-between align-items-center pt-3 border-top">
        <div>
          {initialData?.id && onDelete && (
            <Button
              type="button"
              color="danger"
              outline
              className="border-0 bg-danger-lt fw-bold"
              onClick={onDelete}
            >
              <Icon icon="trash" className="me-1" />
              Hapus Akun
            </Button>
          )}
        </div>
        <div className="d-flex gap-2">
            <Button
              type="submit"
              color="primary"
              loading={isLoading}
              className="px-4 fw-bold"
            >
            {!isLoading && <Icon icon="check" className="me-1" />}
            {initialData?.id ? 'Simpan Perubahan' : 'Buat Akun'}
          </Button>
        </div>
      </div>
    </form>
  );
};
