import { Icon } from '@/shared/components/ui/Icon';

export function TopMerchantsCard() {
  const merchants = [
    { name: 'Indomaret', cat: 'Shopping', amount: 'Rp 1.250.000', count: 12, icon: 'shopping-cart', color: 'blue' },
    { name: 'Grab / Gojek', cat: 'Transport', amount: 'Rp 850.000', count: 24, icon: 'bike', color: 'green' },
    { name: 'Starbucks', cat: 'Food & Drink', amount: 'Rp 450.000', count: 8, icon: 'coffee', color: 'orange' },
    { name: 'Netflix', cat: 'Entertainment', amount: 'Rp 186.000', count: 1, icon: 'device-tv', color: 'red' },
  ];

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-4">Top Merchants (Mei)</div>
        
        <div className="divide-y">
          {merchants.map((m, i) => (
            <div key={i} className="py-2">
              <div className="row align-items-center g-3">
                <div className="col-auto">
                  <div className={`avatar avatar-sm rounded bg-${m.color}-lt text-${m.color}`}>
                    <Icon icon={m.icon} size="sm" />
                  </div>
                </div>
                <div className="col">
                  <div className="text-body fw-bold small">{m.name}</div>
                  <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>{m.count} transaksi • {m.cat}</div>
                </div>
                <div className="col-auto text-end">
                  <div className="text-body fw-bold font-monospace small">{m.amount}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
