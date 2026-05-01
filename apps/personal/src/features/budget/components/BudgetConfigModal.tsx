import React, { useEffect } from 'react';
import { Modal, ModalHeader, Button, Icon, Select, Datepicker, InputIcon, Alert } from '@/shared/components/ui';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { type BudgetPlan, type CreateBudgetPlanDTO } from '../types/budget.types';
import { budgetService } from '../services/budget.service';
import { DEFAULT_ITEMS, BUDGET_METHODS_INFO, METHOD_DEFAULT_ITEMS } from '../constants/budget.constants';
import dayjs from 'dayjs';
import { getApiErrorMessage } from '@/shared/utils/errorUtils';

interface BudgetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: BudgetPlan | null;
}

export const BudgetConfigModal: React.FC<BudgetConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editData 
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateBudgetPlanDTO>({
    defaultValues: {
      name: 'Budget Plan Baru',
      budget_method: '50_30_20',
      income_baseline: 10000000,
      period: 'monthly',
      start_date: dayjs().startOf('month').format('YYYY-MM-DD'),
      end_date: dayjs().endOf('month').format('YYYY-MM-DD'),
      is_active: true,
      rollover_enabled: false,
      items: DEFAULT_ITEMS
    }
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "items"
  });

  const budgetMethod = useWatch({ control, name: 'budget_method' });
  const items = useWatch({ control, name: 'items' });
  const incomeBaseline = useWatch({ control, name: 'income_baseline' });
  const totalPercentage = items?.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0) || 0;

  // Reset form when editData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        reset({
          name: editData.name,
          budget_method: editData.budget_method,
          income_baseline: Number(editData.income_baseline),
          period: editData.period,
          start_date: editData.start_date,
          end_date: editData.end_date,
          is_active: editData.is_active,
          rollover_enabled: editData.rollover_enabled,
          items: editData.items?.map(item => ({
            name: item.name,
            percentage: Number(item.percentage),
            icon: item.icon,
            color: item.color,
            category_ids: item.categories?.map(c => c.id) || []
          })) || []
        });
      } else {
        reset({
          name: 'Budget Plan Baru',
          budget_method: '50_30_20',
          income_baseline: 10000000,
          period: 'monthly',
          start_date: dayjs().startOf('month').format('YYYY-MM-DD'),
          end_date: dayjs().endOf('month').format('YYYY-MM-DD'),
          is_active: true,
          rollover_enabled: false,
          items: DEFAULT_ITEMS
        });
      }
    }
  }, [isOpen, editData, reset]);

  // Only auto-replace items if we are NOT in edit mode
  useEffect(() => {
    if (!editData && budgetMethod && METHOD_DEFAULT_ITEMS[budgetMethod]) {
      replace(METHOD_DEFAULT_ITEMS[budgetMethod]);
    }
  }, [budgetMethod, replace, editData]);

  const onSubmit = async (data: CreateBudgetPlanDTO) => {
    if (totalPercentage !== 100) {
      alert(`Total persentase harus 100%. Saat ini: ${totalPercentage}%`);
      return;
    }
    try {
      setError(null);
      if (editData) {
        await budgetService.updatePlan(editData.id, data);
      } else {
        await budgetService.createPlan(data);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Gagal menyimpan budget plan. Pastikan rentang tanggal tidak bertabrakan.'));
      console.error('Failed to save budget plan', err);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal 
      show={isOpen} 
      onClose={handleClose} 
      size="lg"
    >
      <ModalHeader title={editData ? "Edit Budget Plan" : "Setup Budget Plan Baru"} onClose={handleClose} />
      <div className="modal-body pb-4">
        {error && (
          <Alert type="danger" showClose className="mb-3" title="Terjadi Kesalahan">
            <Icon icon="alert-triangle" className="me-2" />
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <label className="form-label">Nama Plan</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputIcon 
                    {...field} 
                    icon="hash" 
                    placeholder="Contoh: Budget April" 
                  />
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tanggal Mulai</label>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <Datepicker 
                    value={field.value} 
                    onChange={field.onChange} 
                    layout="icon"
                  />
                )}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Tanggal Berakhir</label>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <Datepicker 
                    value={field.value} 
                    onChange={field.onChange} 
                    layout="icon"
                  />
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Metode Budgeting</label>
              <Controller
                name="budget_method"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!!editData} // Don't allow changing method for existing plan for safety
                    options={Object.keys(BUDGET_METHODS_INFO).map(key => ({
                      value: key,
                      label: BUDGET_METHODS_INFO[key].title
                    }))}
                  />
                )}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Baseline Income (Pemasukan)</label>
              <Controller
                name="income_baseline"
                control={control}
                render={({ field }) => (
                  <InputIcon 
                    {...field}
                    type="number"
                    icon="currency-dollar"
                    prepend
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </div>
          </div>

          {budgetMethod && BUDGET_METHODS_INFO[budgetMethod] && (
            <div className="alert alert-info py-2 mb-4">
              <div className="d-flex">
                <Icon icon="info-circle" className="me-2 mt-1" />
                <div>
                  <div className="font-weight-bold text-dark">{BUDGET_METHODS_INFO[budgetMethod].title}</div>
                  <div className="small opacity-80">{BUDGET_METHODS_INFO[budgetMethod].description}</div>
                </div>
              </div>
            </div>
          )}

          <div className="hr-text">Konfigurasi Keranjang ({totalPercentage}%)</div>
          
          <div className="space-y-2 mb-4" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
            {fields.map((field, index) => (
              <div key={field.id} className="p-3 rounded-3 border bg-white shadow-sm mb-2">
                <div className="row g-3 align-items-center">
                  <div className="col-auto">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 bg-light border overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
                        <Icon icon={items[index]?.icon || 'hash'} color={items[index]?.color || 'blue'} size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row g-2 align-items-center">
                      <div className="col">
                        <div className="font-weight-bold h4 mb-0">{items[index]?.name}</div>
                        <div className="small text-muted">
                          Alokasi: <span className="text-dark font-weight-medium">Rp {((Number(items[index]?.percentage) || 0) / 100 * (Number(incomeBaseline) || 0)).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      <div className="col-auto" style={{ width: '110px' }}>
                        <div className="input-group">
                          <Controller
                            name={`items.${index}.percentage`}
                            control={control}
                            render={({ field: percField }) => (
                              <input 
                                {...percField} 
                                type="number" 
                                className="form-control form-control-sm text-end font-weight-bold" 
                                placeholder="0" 
                                onChange={e => percField.onChange(Number(e.target.value))}
                              />
                            )}
                          />
                          <span className="input-group-text px-2 small bg-light font-weight-bold">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPercentage !== 100 && (
            <div className="alert alert-warning py-2 mb-3">
              <Icon icon="alert-triangle" size="sm" className="me-2" />
              Total persentase harus <strong>100%</strong>. Saat ini: <strong>{totalPercentage}%</strong>.
            </div>
          )}

          <div className="d-flex justify-content-end align-items-center gap-3 mt-4">
            <Button color="link" onClick={handleClose} element="button" className="text-muted border-0">
              Batal
            </Button>
            <Button 
              element="button" 
              type="submit" 
              color="primary" 
              loading={isSubmitting}
              disabled={totalPercentage !== 100}
            >
              <Icon icon="check" size="sm" className="me-2" />
              {editData ? 'Simpan Perubahan' : 'Simpan Budget Plan'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
