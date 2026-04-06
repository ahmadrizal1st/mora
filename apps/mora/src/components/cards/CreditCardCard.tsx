import React, { useState } from 'react';

interface CreditCardCardProps {
  onPay?: (data: { number: string; name: string; month: string; year: string; cvv: string }) => void;
}

export function CreditCardCard({ onPay }: CreditCardCardProps) {
  const [form, setForm] = useState({ number: '', name: '', month: '1', year: '2025', cvv: '' });
  
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
    
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-3">
          <div className="form-label">Card number</div>
          <input type="text" className="form-control" name="input-mask" data-mask="0000 0000 0000 0000" data-mask-visible="true" placeholder="0000 0000 0000 0000"
            autoComplete="off" value={form.number} onChange={set('number')} maxLength={19} />
        </div>
        <div className="mb-3">
          <div className="form-label">Card name</div>
          <input type="text" className="form-control" value={form.name} onChange={set('name')} />
        </div>
        <div className="row">
          <div className="col-8">
            <div className="mb-3">
              <label className="form-label">Expiration date</label>
              <div className="row g-2">
                <div className="col">
                  <select className="form-select" value={form.month} onChange={set('month')}>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col">
                  <select className="form-select" value={form.year} onChange={set('year')}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="mb-3">
              <div className="form-label">CVV</div>
              <input type="number" className="form-control" value={form.cvv} onChange={set('cvv')} maxLength={4} />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <button className="btn btn-primary w-100" onClick={() => onPay?.(form)}>Pay now</button>
        </div>
      </div>
    </div>
  );
}
