
interface Employee {
  name: string; 
  department: string; 
  progress?: number; 
  avatarSrc?: string;
}

interface CompanyEmployeesCardProps {
  employees?: Employee[];
}

const progressColor = (v: number) => v >= 70 ? 'success' : v >= 40 ? 'warning' : 'danger';

export function CompanyEmployeesCard({
  employees = [
    { name: 'Alice Smith', department: 'Engineering', progress: 82 },
    { name: 'Bob Jones', department: 'Marketing', progress: 45 },
    { name: 'Carol White', department: 'Design', progress: 67 },
    { name: 'Dave Brown', department: 'Sales', progress: 91 },
    { name: 'Eve Taylor', department: 'Finance', progress: 33 },
  ],
}: CompanyEmployeesCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Company Employees</h4>
      </div>
      <table className="table card-table table-vcenter">
        <thead>
          <tr>
            <th colSpan={2}>Name</th>
            <th>Department</th>
            <th colSpan={2} className="w-25">Progress</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => {
            const pct = emp.progress ?? Math.floor(30 + Math.random() * 60);
            return (
              <tr key={i}>
                <td className="w-1">
                  <span className="avatar"
                    style={emp.avatarSrc ? { backgroundImage: `url(${emp.avatarSrc})` } : undefined}>
                    {!emp.avatarSrc && emp.name.charAt(0)}
                  </span>
                </td>
                <td><a href="#" className="text-reset">{emp.name}</a></td>
                <td>{emp.department}</td>
                <td className="w-1 pe-0">{pct}%</td>
                <td>
                  <div className="progress progress-xs">
                    <div className={`progress-bar bg-${progressColor(pct)}`}
                      role="progressbar" style={{ width: `${pct}%` }} />
                  </div>
                </td>
                <td>
                  <a href="#" className="text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
                      viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
                    </svg>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
