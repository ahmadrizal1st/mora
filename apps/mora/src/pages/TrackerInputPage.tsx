import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BaseLayout from '../layouts/BaseLayout';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Datepicker } from '../components/ui/Datepicker';
import { InputIcon } from '../components/ui/InputIcon';

interface CustomField {
  id: string;
  label: string;
  value: string;
}

const amountInputStyle = `
  /* Hide spin-buttons for Chrome, Safari, Edge, Opera */
  .amount-input::-webkit-outer-spin-button,
  .amount-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Hide spin-buttons for Firefox */
  .amount-input {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  .amount-input::placeholder {
    color: #cbd5e1 !important;
    opacity: 0.5;
  }
`;

export default function TrackerInputPage() {
  const location = useLocation();
  const prefill = location.state?.prefill;

  const [type, setType] = useState<'income' | 'expense' | 'transfer'>(prefill?.type || 'expense');
  const [amount, setAmount] = useState<string>(prefill?.amount ? String(prefill.amount) : '');
  const [date, setDate] = useState<string>(prefill?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>(prefill?.category || 'food');
  const [description, setDescription] = useState<string>(prefill?.description || '');
  const [scannedImage, setScannedImage] = useState<string | null>(prefill?.image || null);

  const [showBankDetails, setShowBankDetails] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const addCustomField = () => {
    const id = Math.random().toString(36).substring(2, 9);
    setCustomFields([...customFields, { id, label: '', value: '' }]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const updateCustomField = (id: string, key: 'label' | 'value', val: string) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, [key]: val } : field
    ));
  };

  return (
    <BaseLayout pageTitle="Add Transaction">
      <div className="container-tight py-4">
        <div className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-5">
            <h2 className="card-title h3 text-center mb-5 fw-bold text-secondary text-uppercase ls-1">Manual Transaction</h2>
            
            {/* TRANSACTION TYPE SELECTOR */}
            <div className="mb-4">
              <div className="form-selectgroup form-selectgroup-pills d-flex justify-content-center">
                <label className="form-selectgroup-item flex-fill cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    value="expense" 
                    className="form-selectgroup-input" 
                    checked={type === 'expense'} 
                    onChange={() => setType('expense')}
                  />
                  <span className="form-selectgroup-button d-flex align-items-center justify-content-center py-2">
                    <Icon icon="minus" size="sm" className="me-2 text-danger" /> Expense
                  </span>
                </label>
                <label className="form-selectgroup-item flex-fill cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    value="income" 
                    className="form-selectgroup-input" 
                    checked={type === 'income'} 
                    onChange={() => setType('income')}
                  />
                  <span className="form-selectgroup-button d-flex align-items-center justify-content-center py-2">
                    <Icon icon="plus" size="sm" className="me-2 text-success" /> Income
                  </span>
                </label>
                <label className="form-selectgroup-item flex-fill cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    value="transfer" 
                    className="form-selectgroup-input" 
                    checked={type === 'transfer'} 
                    onChange={() => setType('transfer')}
                  />
                  <span className="form-selectgroup-button d-flex align-items-center justify-content-center py-2">
                    <Icon icon="arrows-right-left" size="sm" className="me-2 text-primary" /> Transfer
                  </span>
                </label>
              </div>
            </div>

            {/* SCANNED IMAGE PREVIEW */}
            {scannedImage && (
              <div className="mb-5 text-center">
                <div className="d-inline-block position-relative">
                  <span className="badge bg-primary position-absolute top-0 start-0 m-2 shadow-sm">Scanned Receipt</span>
                  <img src={scannedImage} alt="Scanned" className="rounded-3 shadow-sm border border-light" style={{ maxHeight: '200px', width: 'auto' }} />
                  <button type="button" className="btn btn-icon btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow" onClick={() => setScannedImage(null)}>
                    <Icon icon="x" size="sm" />
                  </button>
                </div>
              </div>
            )}

            <style>{amountInputStyle}</style>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* CORE FIELDS */}
              <div className="mb-5 text-center amount-input-container">
                <label className="form-label text-muted small text-uppercase fw-bold mb-3 ls-1">Transaction Amount</label>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="d-flex align-items-end me-2">
                    <span className="fw-bold text-dark opacity-40" style={{ fontSize: '1.25rem', lineHeight: '2.5' }}>IDR</span>
                  </div>
                  <input 
                    type="number" 
                    className="form-control form-control-flush fw-bold text-dark p-0 border-0 amount-input" 
                    placeholder="000,000" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ 
                      fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
                      width: 'auto', 
                      minWidth: '150px', 
                      textAlign: 'left',
                      outline: 'none',
                      boxShadow: 'none',
                      background: 'transparent',
                      lineHeight: '1',
                      letterSpacing: '-0.03em'
                    }}
                  />
                </div>
              </div>

              <div className="row g-3 g-md-4">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-uppercase fw-bold text-dark opacity-75 mb-2 ls-1">Date & Time</label>
                  <Datepicker layout="icon" id="tx-date" value={date} onChange={(val) => setDate(val)} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-uppercase fw-bold text-dark opacity-75 mb-2 ls-1">Category</label>
                  <Select 
                    value={category}
                    onChange={(val) => setCategory(Array.isArray(val) ? val[0] : val)}
                    options={[
                      { value: 'food', label: '🍕 Food & Drink' },
                      { value: 'shopping', label: '🛍️ Shopping' },
                      { value: 'housing', label: '🏠 Housing' },
                      { value: 'transport', label: '🚗 Transport' },
                      { value: 'entertainment', label: '🎬 Entertainment' },
                      { value: 'health', label: '🏥 Health' },
                      { value: 'salary', label: '💰 Salary' },
                      { value: 'others', label: '📦 Others' },
                    ]}
                    defaultValue="food"
                  />
                </div>

                {type === 'transfer' ? (
                  <>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-uppercase fw-bold text-danger opacity-75 mb-2 ls-1">From Account</label>
                      <Select 
                        options={[
                          { value: 'checking', label: 'Chase Checking' },
                          { value: 'savings', label: 'High Yield Savings' },
                          { value: 'wallet', label: 'Cash Wallet' },
                        ]}
                        defaultValue="checking"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-uppercase fw-bold text-success opacity-75 mb-2 ls-1">To Account</label>
                      <Select 
                        options={[
                          { value: 'checking', label: 'Chase Checking' },
                          { value: 'savings', label: 'High Yield Savings' },
                          { value: 'wallet', label: 'Cash Wallet' },
                        ]}
                        defaultValue="savings"
                      />
                    </div>
                  </>
                ) : (
                  <div className="col-12 mb-3">
                    <label className="form-label text-uppercase fw-bold text-dark opacity-75 mb-2 ls-1">Account / Wallet</label>
                    <Select 
                      options={[
                        { value: 'checking', label: 'Chase Checking' },
                        { value: 'savings', label: 'High Yield Savings' },
                        { value: 'wallet', label: 'Cash Wallet' },
                        { value: 'amex', label: 'Amex Gold' },
                      ]}
                      defaultValue="wallet"
                    />
                  </div>
                )}

                <div className="col-12 mb-3">
                  <label className="form-label text-uppercase fw-bold text-dark opacity-75 mb-2 ls-1">Note / Description</label>
                  <textarea 
                    className="form-control border-2-hover shadow-none" 
                    rows={3} 
                    placeholder="What was this for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* OPTIONAL BANKING DETAILS */}
              <div className="mt-4 pt-3 border-top">
                <button 
                  type="button" 
                  className="btn btn-link text-decoration-none p-0 text-dark d-flex align-items-center w-100 justify-content-between mb-3"
                  onClick={() => setShowBankDetails(!showBankDetails)}
                >
                  <span className="fw-bold h5 mb-0 text-uppercase ls-1">Bank / E-Wallet Details (Optional)</span>
                  <Icon icon={showBankDetails ? "chevron-up" : "chevron-down"} size="sm" />
                </button>

                {showBankDetails && (
                  <div className="row g-3 mt-3 animate__animated animate__fadeIn">
                    <div className="col-md-6">
                      <label className="form-label text-uppercase fw-bold text-dark opacity-75 mb-2 ls-1">Reference ID</label>
                      <input type="text" className="form-control border-2-hover shadow-none" placeholder="Ref: 123456789" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-uppercase fw-bold text-dark opacity-75 mb-2 ls-1">Transaction Fee</label>
                      <InputIcon icon="coin" placeholder="0.00" type="number" />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-uppercase fw-bold text-dark opacity-75 mb-2 ls-1">Provider / Bank Name</label>
                      <input type="text" className="form-control border-2-hover shadow-none" placeholder="GoPay, OVO, BCA, etc." />
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC CUSTOM FIELDS */}
              <div className="mt-5 pt-4 border-top">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <span className="fw-bold h5 mb-0 text-uppercase text-dark ls-1">Custom Fields</span>
                  <Button 
                    element="button"
                    text="Add Field" 
                    size="sm" 
                    icon="plus" 
                    ghost
                    color="primary"
                    onClick={addCustomField}
                    type="button"
                  />
                </div>

                {customFields.length > 0 ? (
                  <div className="space-y-sm">
                    {customFields.map((field) => (
                      <div key={field.id} className="row g-2 align-items-center mb-2 animate__animated animate__fadeIn">
                        <div className="col-5">
                          <input 
                            type="text" 
                            className="form-control border-2-hover shadow-none" 
                            placeholder="Label" 
                            value={field.label}
                            onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                          />
                        </div>
                        <div className="col-5">
                          <input 
                            type="text" 
                            className="form-control border-2-hover shadow-none" 
                            placeholder="Value" 
                            value={field.value}
                            onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                          />
                        </div>
                        <div className="col-2 text-end">
                          <button 
                            type="button" 
                            className="btn btn-icon text-danger border-0 p-0 shadow-none bg-transparent hover-opacity-75"
                            onClick={() => removeCustomField(field.id)}
                            title="Remove field"
                            style={{ background: 'none' }}
                          >
                            <Icon icon="trash" size="md" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-light-subtle rounded-2 p-3 text-center border-dashed">
                    <p className="text-muted small mb-0">No custom fields added yet. Click [Add Field] to add extra information.</p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5 d-grid gap-2">
                <Button color="primary" size="lg" text="Save Transaction" icon="check" block />
                <Button link text="Clear Form" className="text-secondary" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
