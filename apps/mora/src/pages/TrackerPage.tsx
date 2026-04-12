import { useState } from 'react';
import { Link } from 'react-router-dom';
import BaseLayout from '../layouts/BaseLayout';
import { Icon } from '../components/ui/Icon';
import { Chart, type ChartData } from '../components/ui/Chart';

export default function TrackerPage() {

  // Mock data for Expense by Category
  const expenseByCategoryData: ChartData = {
    type: 'donut',
    height: 22,
    donutLabel: 'Total Expenses',
    donutValue: '$8,120',
    series: [
      { name: 'Housing', data: [35], color: 'primary' },
      { name: 'Food', data: [15], color: 'success' },
      { name: 'Transport', data: [10], color: 'info' },
      { name: 'Entertainment', data: [12], color: 'warning' },
      { name: 'Others', data: [28], color: 'secondary' },
    ],
    legend: true,
    hollowSize: '70%',
  };

  const [selectedRange, setSelectedRange] = useState<6 | 12>(6);

  // Mock data for Monthly Cashflow
  const monthlyCashflowData: ChartData = {
    type: 'bar',
    height: 22,
    stacked: false,
    categories: selectedRange === 6
      ? ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
      : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    series: [
      {
        name: 'Income',
        data: selectedRange === 6
          ? [11000, 11500, 13000, 12000, 12500, 12450]
          : [10500, 11000, 10800, 11200, 11800, 12000, 11000, 11500, 13000, 12000, 12500, 12450],
        color: 'primary',
      },
      {
        name: 'Expenses',
        data: selectedRange === 6
          ? [8500, 8200, 9500, 8100, 8300, 8120]
          : [7800, 8100, 8000, 8500, 8200, 8800, 8500, 8200, 9500, 8100, 8300, 8120],
        color: 'secondary',
      },
    ],
    legend: true,
  };

  const transactions = [
    { id: 1, date: '2024-03-25', desc: 'Monthly Salary', cat: 'Income', amount: 8500, status: 'Completed', account: 'Chase Checking', type: 'income' },
    { id: 2, date: '2024-03-24', desc: 'Rent Payment', cat: 'Housing', amount: -2800, status: 'Completed', account: 'Chase Checking', type: 'expense' },
    { id: 3, date: '2024-03-23', desc: 'Whole Foods Market', cat: 'Food', amount: -245.50, status: 'Completed', account: 'Amex Gold', type: 'expense' },
    { id: 4, date: '2024-03-22', desc: 'Stock Dividends', cat: 'Income', amount: 1250.75, status: 'Completed', account: 'Vanguard', type: 'income' },
    { id: 5, date: '2024-03-21', desc: 'Netflix Subscription', cat: 'Entertainment', amount: -19.99, status: 'Pending', account: 'Amex Gold', type: 'expense' },
    { id: 6, date: '2024-03-20', desc: 'Shell Gas Station', cat: 'Transport', amount: -65.00, status: 'Completed', account: 'Chase Checking', type: 'expense' },
    { id: 7, date: '2024-03-18', desc: 'Freelance Design Project', cat: 'Income', amount: 2700, status: 'Completed', account: 'PayPal', type: 'income' },
  ];

  return (
    <BaseLayout pageTitle="Financial Tracker">
      <div className="row row-cards g-3">
        {/* SUMMARY CARDS */}
        <div className="col-sm-6 col-lg-3">
          <div className="card card-sm border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-auto">
                  <span className="bg-success text-white avatar shadow-sm border-0">
                    <Icon icon="trending-up" />
                  </span>
                </div>
                <div className="col">
                  <div className="font-weight-medium text-secondary">Total Income</div>
                  <div className="h2 mb-0 fw-bold">$12,450.00</div>
                  <div className="text-success small d-flex align-items-center gap-1 mt-1">
                    <Icon icon="arrow-up" size="xs" /> 12.5% vs last month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card card-sm border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-auto">
                  <span className="bg-danger text-white avatar shadow-sm border-0">
                    <Icon icon="trending-down" />
                  </span>
                </div>
                <div className="col">
                  <div className="font-weight-medium text-secondary">Total Expenses</div>
                  <div className="h2 mb-0 fw-bold">$8,120.00</div>
                  <div className="text-danger small d-flex align-items-center gap-1 mt-1">
                    <Icon icon="arrow-down" size="xs" /> 5.2% vs last month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card card-sm border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-auto">
                  <span className="bg-primary text-white avatar shadow-sm border-0">
                    <Icon icon="wallet" />
                  </span>
                </div>
                <div className="col">
                  <div className="font-weight-medium text-secondary">Net Balance</div>
                  <div className="h2 mb-0 fw-bold">$4,330.00</div>
                  <div className="text-success small d-flex align-items-center gap-1 mt-1">
                    <Icon icon="arrow-up" size="xs" /> 8.4% vs last month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card card-sm border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-auto">
                  <span className="bg-info text-white avatar shadow-sm border-0">
                    <Icon icon="coins" />
                  </span>
                </div>
                <div className="col">
                  <div className="font-weight-medium text-secondary">Savings Rate</div>
                  <div className="h2 mb-0 fw-bold">34.8%</div>
                  <div className="text-success small d-flex align-items-center gap-1 mt-1">
                    <Icon icon="arrow-up" size="xs" /> 2.1% vs last month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header border-0 pb-0 pt-4 px-4 bg-transparent d-flex justify-content-between align-items-center">
              <h3 className="card-title fw-bold">Monthly Cashflow</h3>
              <div className="dropdown">
                <a
                  href="#"
                  className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                  data-bs-toggle="dropdown"
                >
                  <span className="text-decoration-underline-hover">Last {selectedRange} Months</span>
                  <Icon icon="chevron-down" size="xs" />
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <button className={`dropdown-item ${selectedRange === 6 ? 'active' : ''}`} onClick={() => setSelectedRange(6)}>
                    Last 6 Months
                  </button>
                  <button className={`dropdown-item ${selectedRange === 12 ? 'active' : ''}`} onClick={() => setSelectedRange(12)}>
                    Last 12 Months
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              <Chart chartId="monthly-cashflow" chartData={monthlyCashflowData} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header border-0 pb-0 pt-4 px-4 bg-transparent d-flex justify-content-between align-items-center">
              <h3 className="card-title fw-bold">Expenses by Category</h3>
              <div className="dropdown">
                <a
                  href="#"
                  className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                  data-bs-toggle="dropdown"
                >
                  <span className="text-decoration-underline-hover">This Month</span>
                  <Icon icon="chevron-down" size="xs" />
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <button className="dropdown-item">This Month</button>
                  <button className="dropdown-item">Last Month</button>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              <Chart chartId="expense-by-category" chartData={expenseByCategoryData} />
            </div>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header border-0 pb-0 pt-4 px-4 bg-transparent d-flex justify-content-between align-items-center">
              <h3 className="card-title fw-bold">Recent Transactions</h3>
              <div className="d-flex gap-2">
                <div className="input-icon">
                  <span className="input-icon-addon">
                    <Icon icon="search" size="sm" />
                  </span>
                  <input type="text" className="form-control form-control-sm form-control-flush border-bottom px-4" placeholder="Search transactions..." />
                </div>
                <a
                  href="#"
                  className="text-secondary small d-flex align-items-center gap-1 text-decoration-none ms-2"
                >
                  <span className="text-decoration-underline-hover">Filter</span>
                  <Icon icon="adjustments-horizontal" size="xs" />
                </a>
              </div>
            </div>
            <div className="card-body p-0 overflow-hidden mt-3">
              <div className="table-responsive">
                <table className="table table-vcenter table-borderless text-nowrap mb-0">
                  <thead className="bg-light-subtle">
                    <tr className="border-bottom">
                      <th className="px-4 py-3 text-muted small fw-medium">Date</th>
                      <th className="px-4 py-3 text-muted small fw-medium">Description</th>
                      <th className="px-4 py-3 text-muted small fw-medium">Category</th>
                      <th className="px-4 py-3 text-muted small fw-medium">Account</th>
                      <th className="px-4 py-3 text-muted small fw-medium">Status</th>
                      <th className="px-4 py-3 text-muted small fw-medium text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id} className="border-bottom">
                        <td className="px-4 py-3">
                          <div className="fw-medium">{t.date}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="fw-bold text-dark">{t.desc}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge px-2 rounded-pill ${t.type === 'income' ? 'bg-success-lt text-success' : 'bg-primary-lt text-primary'}`}>
                            {t.cat}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-secondary">
                          {t.account}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge px-2 rounded-pill ${t.status === 'Completed' ? 'bg-success text-white' : 'bg-warning text-white'}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-end fw-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                          {t.type === 'income' ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 d-flex align-items-center justify-content-between p-4">
              <div className="text-muted small">Showing 7 of 128 transactions</div>
              <ul className="pagination pagination-sm m-0 ms-auto">
                <li className="page-item disabled">
                  <a className="page-link" href="#" aria-disabled="true">prev</a>
                </li>
                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                  <a className="page-link" href="#">next</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content hiding behind the fixed bottom shelf */}
      <div style={{ height: '180px' }} className="d-block w-100" />

      {/* METODE LAINNYA - FIXED BOTTOM SHELF */}
      <div className="position-fixed bottom-0 start-0 w-100 bg-white" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', zIndex: 1040, paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))', boxShadow: '0 -4px 20px rgba(0,0,0,0.04)' }}>
        <div className="container-xl pt-3">
          <h4 className="text-center fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#f97316' }}>Track Your Finance</h4>
          <div className="row g-2 px-3 pb-2">
            <div className="col-4">
              <Link 
                to="/tracker/audio"
                className="bg-white text-decoration-none w-100 d-flex flex-column align-items-center justify-content-center py-2 px-1 m-0"
                style={{ borderRadius: '10px', border: '1px solid #d1d5db', cursor: 'pointer', outline: 'none' }}
              >
                <div className="mb-1 d-flex align-items-center justify-content-center" style={{ height: '24px', color: '#f97316' }}>
                  <Icon icon="microphone" size={22} stroke={2.5} />
                </div>
                <span className="fw-medium m-0" style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1' }}>Audio</span>
              </Link>
            </div>
            <div className="col-4">
              <Link 
                to="/tracker/photo"
                className="bg-white text-decoration-none w-100 d-flex flex-column align-items-center justify-content-center py-2 px-1 m-0"
                style={{ borderRadius: '10px', border: '1px solid #d1d5db', cursor: 'pointer', outline: 'none' }}
              >
                <div className="mb-1 d-flex align-items-center justify-content-center" style={{ height: '24px', color: '#f97316' }}>
                  <Icon icon="scan" size={22} stroke={2.5} />
                </div>
                <span className="fw-medium m-0" style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1' }}>Scan</span>
              </Link>
            </div>
            <div className="col-4">
              <Link 
                to="/tracker/input"
                className="bg-white text-decoration-none w-100 d-flex flex-column align-items-center justify-content-center py-2 px-1 m-0"
                style={{ borderRadius: '10px', border: '1px solid #d1d5db', cursor: 'pointer', outline: 'none' }}
              >
                <div className="mb-1 d-flex align-items-center justify-content-center" style={{ height: '24px', color: '#f97316' }}>
                  <Icon icon="keyboard" size={22} stroke={2.5} />
                </div>
                <span className="fw-medium m-0" style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1' }}>Input</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
