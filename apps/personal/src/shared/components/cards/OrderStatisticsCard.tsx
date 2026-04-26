interface OrderItem { 
  title: string; 
  subtitle: string; 
  color: string; 
  orders?: number 
}

interface OrderStatisticsCardProps {
  total?: string;
  trend?: number;
  items?: OrderItem[];
}

export function OrderStatisticsCard({
  total = '2,137',
  trend = 7,
  items = [
    { title: 'New', subtitle: 'Newly created', color: 'blue', orders: 693 },
    { title: 'Processing', subtitle: 'In progress', color: 'azure', orders: 420 },
    { title: 'Shipped', subtitle: 'On its way', color: 'indigo', orders: 842 },
    { title: 'Returned', subtitle: 'Back to us', color: 'yellow', orders: 182 },
    { title: 'Cancelled', subtitle: 'Lost orders', color: 'red', orders: 0 },
  ],
}: OrderStatisticsCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div>Total orders</div>
        <div className="d-flex align-items-baseline mb-3">
          <div className="h1 mb-0 me-2">{total}</div>
          <div className="me-auto">
            <span className={`text-${trend > 0 ? 'green' : 'red'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          </div>
        </div>
        <div className="progress mb-4">
          <div className="progress-bar bg-blue" style={{ width: '40%' }} />
          <div className="progress-bar bg-azure" style={{ width: '15%' }} />
          <div className="progress-bar bg-indigo" style={{ width: '25%' }} />
          <div className="progress-bar bg-yellow" style={{ width: '15%' }} />
          <div className="progress-bar bg-red" style={{ width: '5%' }} />
        </div>
        <ul className="list-unstyled">
          {items.map((item, i) => (
            <li key={i} className="row g-2 align-items-center mb-2">
              <div className="col-auto"><span className={`legend bg-${item.color}`} /></div>
              <div className="col">
                {item.title}
                <div className="fs-6 text-secondary">{item.subtitle}</div>
              </div>
              {item.orders !== undefined && (
                <div className="col-auto small text-secondary">
                  <strong className="text-body">{item.orders.toLocaleString()}</strong> orders
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
