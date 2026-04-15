interface TableUser {
  name: string;
  registeredDate?: string;
  avatarSrc?: string;
  usagePercent?: number;
  lastLogin?: string;
  satisfaction?: number;
}

interface TableUsersCardProps {
  users?: TableUser[];
}

const payments = ['visa', 'mastercard', 'paypal', 'googlewallet', 'shopify', 'ebay'];
const usageColor = (v: number) => v >= 70 ? 'success' : v >= 40 ? 'warning' : 'danger';

export function TableUsersCard({
  users = [
    { name: 'Alice Smith', registeredDate: 'Jan 15, 2020', usagePercent: 82, lastLogin: '5 min ago', satisfaction: 92 },
    { name: 'Bob Jones', registeredDate: 'Mar 3, 2021', usagePercent: 45, lastLogin: '2 hours ago', satisfaction: 60 },
    { name: 'Carol White', registeredDate: 'Jun 18, 2022', usagePercent: 67, lastLogin: '1 day ago', satisfaction: 75 },
    { name: 'Dave Brown', registeredDate: 'Aug 22, 2019', usagePercent: 91, lastLogin: 'Just now', satisfaction: 88 },
    { name: 'Eve Taylor', registeredDate: 'Dec 11, 2023', usagePercent: 33, lastLogin: '3 days ago', satisfaction: 42 },
  ],
}: TableUsersCardProps) {
  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-hover table-outline table-vcenter text-nowrap card-table">
          <thead>
            <tr>
              <th colSpan={2}>User</th>
              <th>Usage</th>
              <th className="text-center">Payment</th>
              <th>Activity</th>
              <th className="w-1 text-center">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => {
              const pct = user.usagePercent ?? 50;
              const sat = user.satisfaction ?? 70;
              return (
                <tr key={i}>
                  <td className="text-center w-1">
                    <span className="avatar"
                      style={user.avatarSrc ? { backgroundImage: `url(${user.avatarSrc})` } : undefined}>
                      {!user.avatarSrc && user.name.charAt(0)}
                    </span>
                  </td>
                  <td>
                    <div>{user.name}</div>
                    {user.registeredDate && <div className="small text-secondary">Registered: {user.registeredDate}</div>}
                  </td>
                  <td>
                    <div className="clearfix">
                      <div className="float-start"><strong>{pct}%</strong></div>
                      <div className="float-end"><small className="text-secondary">Jun–Jul 2015</small></div>
                    </div>
                    <div className="progress progress-sm">
                      <div className={`progress-bar bg-${usageColor(pct)}`} style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                  <td className="text-center">
                    <span className={`payment payment-provider-${payments[i % payments.length]}`} />
                  </td>
                  <td>
                    <div className="small text-secondary">Last login</div>
                    <div>{user.lastLogin ?? '—'}</div>
                  </td>
                  <td className="text-center">
                    <div className="text-secondary small">{sat}%</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
