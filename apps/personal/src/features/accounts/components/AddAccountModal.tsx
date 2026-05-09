import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalHeader, 
  ModalFooter, 
  Button, 
  Select, 
  Icon,
  ColorPicker,
  Nav,
} from '@/shared/components/ui';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const accountSchema = z.object({
  name: z.string().min(1, 'Nama akun wajib diisi'),
  type: z.string().min(1, 'Pilih tipe akun'),
  balance: z.number().min(0, 'Saldo minimal 0'),
  color: z.string().optional(),
  logo: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AddAccountModalProps {
  show: boolean;
  onClose: () => void;
}

const ACCOUNT_CATEGORIES = [
  {
    id: 'bank',
    label: 'Bank',
    items: [
      { value: 'BCA', label: 'BCA', type: 'Bank', color: '#0066AE', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
      { value: 'Mandiri', label: 'Mandiri', type: 'Bank', color: '#003D79', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' },
      { value: 'BNI', label: 'BNI', type: 'Bank', color: '#005E6A', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg' },
      { value: 'BRI', label: 'BRI', type: 'Bank', color: '#00529C', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg' },
      { value: 'BSI', label: 'BSI', type: 'Bank', color: '#00A39E', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Bank_Syariah_Indonesia.svg' },
      { value: 'Jago', label: 'Bank Jago', type: 'Bank', color: '#F78100', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Logo-jago.svg' },
    ]
  },
  {
    id: 'ewallet',
    label: 'E-Wallet',
    items: [
      { value: 'GoPay', label: 'GoPay', type: 'E-wallet', color: '#00AED6', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
      { value: 'OVO', label: 'OVO', type: 'E-wallet', color: '#4C3494', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
      { value: 'DANA', label: 'DANA', type: 'E-wallet', color: '#118EEA', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' },
      { value: 'ShopeePay', label: 'ShopeePay', type: 'E-wallet', color: '#EE4D2D', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg' },
      { value: 'LinkAja', label: 'LinkAja', type: 'E-wallet', color: '#E31837', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/LinkAja.svg' },
    ]
  },
  {
    id: 'investasi',
    label: 'Investasi',
    items: [
      { value: 'Bibit', label: 'Bibit', type: 'Investment', color: '#41B549', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bibit_logo.svg/512px-Bibit_logo.svg.png' },
      { value: 'Bareksa', label: 'Bareksa', type: 'Investment', color: '#006B3F', logo: '' },
      { value: 'Ajaib', label: 'Ajaib', type: 'Investment', color: '#000000', logo: '' },
    ]
  },
  {
    id: 'lainnya',
    label: 'Lainnya',
    items: [
      { value: 'Tunai', label: 'Tunai', type: 'Cash', color: '#2FB344', logo: '' },
      { value: 'Custom', label: 'Buat Akun Lain...', type: 'Bank', color: '#066fd1', logo: '' },
    ]
  }
];

export function AddAccountModal({ show, onClose }: AddAccountModalProps) {
  const [step, setStep] = useState<'selection' | 'form'>('selection');
  const [activeTab, setActiveTab] = useState('bank');
  const [isCustom, setIsCustom] = useState(false);
  const [selectedPredefined, setSelectedPredefined] = useState<any>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: 'Bank',
      balance: 0,
      color: '#066fd1',
      logo: ''
    }
  });

  const currentName = useWatch({ control, name: 'name' });

  useEffect(() => {
    if (show) {
      setStep('selection');
      setActiveTab('bank');
      setIsCustom(false);
      setSelectedPredefined(null);
      reset({
        name: '',
        type: 'Bank',
        balance: 0,
        color: '#066fd1',
        logo: ''
      });
    }
  }, [show, reset]);

  const handleSelectAccount = (item: any) => {
    if (item.value === 'Custom') {
      setIsCustom(true);
      setSelectedPredefined(null);
      setValue('name', '');
      setValue('type', 'Bank');
      setValue('color', '#066fd1');
      setValue('logo', '');
    } else {
      setIsCustom(false);
      setSelectedPredefined(item);
      setValue('name', item.label);
      setValue('type', item.type);
      setValue('color', item.color);
      setValue('logo', item.logo);
    }
    setStep('form');
  };

  const onSubmit = (data: AccountFormValues) => {
    console.log('New Account Data:', data);
    // Logic to save account would go here
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose} size="md">
      <ModalHeader onClose={onClose}>
        <div className="d-flex align-items-center gap-2">
          {step === 'form' && (
            <button type="button" className="btn btn-icon btn-sm btn-ghost-secondary me-2" onClick={() => setStep('selection')}>
              <Icon icon="arrow-left" size={18} />
            </button>
          )}
          <Icon icon={step === 'selection' ? "list-details" : "wallet"} className="text-primary" size="md" />
          <h3 className="modal-title fw-bold">
            {step === 'selection' ? 'Pilih Akun' : 'Detail Akun'}
          </h3>
        </div>
      </ModalHeader>
      
      {step === 'selection' ? (
        <div className="modal-body p-0">
          <Nav tabs className="px-3 pt-2">
            {ACCOUNT_CATEGORIES.map(cat => (
              <li className="nav-item" key={cat.id}>
                <a
                  className={`nav-link ${activeTab === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {cat.label}
                </a>
              </li>
            ))}
          </Nav>
          <div className="p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div className="form-selectgroup form-selectgroup-boxes d-flex flex-column gap-2">
              {ACCOUNT_CATEGORIES.find(c => c.id === activeTab)?.items.map(item => (
                <label key={item.value} className="form-selectgroup-item flex-fill mb-0">
                  <input 
                    type="radio" 
                    name="account-selection" 
                    value={item.value} 
                    className="form-selectgroup-input" 
                    onChange={() => handleSelectAccount(item)}
                    onClick={() => handleSelectAccount(item)}
                    checked={selectedPredefined?.value === item.value || (isCustom && item.value === 'Custom')}
                  />
                  <div className="form-selectgroup-label d-flex align-items-center p-3 text-start cursor-pointer">
                    <div className="me-3">
                      <span className="form-selectgroup-check"></span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      {item.logo ? (
                        <img src={item.logo} alt={item.label} style={{width: '32px', height: '32px', objectFit: 'contain'}} />
                      ) : item.value === 'Custom' ? (
                        <div className="avatar avatar-sm bg-primary-lt"><Icon icon="plus" size={16}/></div>
                      ) : (
                        <div className="avatar avatar-sm" style={{backgroundColor: item.color}}><Icon icon="wallet" className="text-white" size={16}/></div>
                      )}
                      <span className="fw-bold text-body" style={{fontSize: '1.05rem'}}>{item.label}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body py-4">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-medium">Nama Akun</label>
                {isCustom ? (
                  <div className="input-group">
                    <input 
                      type="text" 
                      {...register('name')}
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Contoh: Jenius, Bank Mega, dll"
                      autoFocus
                    />
                    <button type="button" className="btn" onClick={() => setStep('selection')} title="Ubah Pilihan">
                      <Icon icon="list" />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="form-control d-flex align-items-center cursor-pointer" 
                    onClick={() => setStep('selection')}
                    style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)' }}
                  >
                    {selectedPredefined?.logo ? (
                      <img src={selectedPredefined.logo} alt="" style={{width: '24px', height: '24px', objectFit: 'contain'}} className="me-2" />
                    ) : (
                      <div className="status-dot me-2" style={{backgroundColor: selectedPredefined?.color || '#000'}}></div>
                    )}
                    <span className="fw-medium">{currentName}</span>
                    <span className="ms-auto text-muted"><Icon icon="chevron-down" size={16}/></span>
                  </div>
                )}
                {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
              </div>

              {isCustom && (
                <>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Warna Penanda</label>
                    <Controller
                      name="color"
                      control={control}
                      render={({ field }) => (
                        <ColorPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Tipe Akun</label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={field.onChange}
                          options={[
                            { value: 'Bank', label: 'Bank / Rekening' },
                            { value: 'E-wallet', label: 'E-wallet / Digital' },
                            { value: 'Cash', label: 'Tunai / Cash' },
                            { value: 'Investment', label: 'Investasi' },
                          ]}
                          placeholder="Pilih Tipe"
                        />
                      )}
                    />
                  </div>
                </>
              )}

              <div className={isCustom ? "col-md-6" : "col-12"}>
                <label className="form-label fw-medium">Saldo Saat Ini</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input 
                    type="number" 
                    {...register('balance', { valueAsNumber: true })}
                    className={`form-control ${errors.balance ? 'is-invalid' : ''}`}
                    placeholder="0"
                  />
                </div>
                {errors.balance && <div className="invalid-feedback d-block">{errors.balance.message}</div>}
              </div>

              {isCustom && (
                <div className="col-md-6">
                  <label className="form-label fw-medium">Link Logo <span className="text-muted fw-normal">(Opsional)</span></label>
                  <input 
                    type="text" 
                    {...register('logo')}
                    className={`form-control ${errors.logo ? 'is-invalid' : ''}`}
                    placeholder="https://..."
                  />
                  {errors.logo && <div className="invalid-feedback">{errors.logo.message}</div>}
                </div>
              )}
            </div>
          </div>

          <ModalFooter>
            <Button element="button" type="button" link onClick={onClose}>
              Batal
            </Button>
            <Button element="button" type="submit" color="primary" icon="check" className="px-4">
              Simpan Akun
            </Button>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}
