export const MOCK_BUDGET_DATA = {
  totalBudget: 10000000,
  spent: 6500000,
  safeToSpendPerDay: 150000,
  categories: [
    { id: '1', name: 'Groceries', limit: 2000000, spent: 1500000, type: 'needs', icon: 'shopping-cart', color: '#3ecf8e' },
    { id: '2', name: 'Transportasi', limit: 1000000, spent: 1200000, type: 'needs', icon: 'car', color: '#e05c7a' },
    { id: '3', name: 'Hiburan', limit: 1000000, spent: 300000, type: 'wants', icon: 'device-tv', color: '#f5a623' },
    { id: '4', name: 'Makan Luar', limit: 1500000, spent: 1400000, type: 'wants', icon: 'tools-kitchen-2', color: '#f5a623' },
    { id: '5', name: 'Investasi', limit: 2000000, spent: 2000000, type: 'savings', icon: 'chart-line', color: '#3ecf8e' },
  ]
};

export const MOCK_GOALS_DATA = {
  totalSaved: 45000000,
  totalTarget: 130000000,
  goals: [
    {
      id: '1',
      name: 'DP Rumah',
      target: 100000000,
      saved: 40000000,
      eta: 'Des 2026',
      monthlyDeposit: 5000000,
      icon: 'home',
      color: '#7c6fff'
    },
    {
      id: '2',
      name: 'MacBook Pro M4',
      target: 30000000,
      saved: 5000000,
      eta: 'Mar 2027',
      monthlyDeposit: 1000000,
      icon: 'device-laptop',
      color: '#5b9ef7'
    }
  ],
  milestones: [
    { date: 'Nov 26', label: 'DP Rumah Tercapai', type: 'achievement' },
    { date: 'Jan 27', label: 'Liburan Jepang', type: 'target' }
  ]
};

export const MOCK_SUBSCRIPTIONS_DATA = {
  totalMonthly: 1250000,
  paidThisMonth: 450000,
  subscriptions: [
    { id: '1', name: 'Netflix Premium', amount: 186000, dueDate: '2026-05-15', status: 'upcoming', icon: 'brand-netflix', color: '#e50914' },
    { id: '2', name: 'PLN Token', amount: 300000, dueDate: '2026-05-17', status: 'upcoming', icon: 'bolt', color: '#f5a623' },
    { id: '3', name: 'Indihome', amount: 450000, dueDate: '2026-05-22', status: 'unpaid', icon: 'world', color: '#5b9ef7' },
    { id: '4', name: 'Spotify', amount: 54000, dueDate: '2026-05-02', status: 'paid', icon: 'brand-spotify', color: '#1ed760' }
  ]
};
