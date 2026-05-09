// ─── Portfolio Holdings ────────────────────────────────────────────────────
export const MOCK_PORTFOLIO_DATA = {
  totalValue: 285_750_000,
  totalCost: 230_000_000,
  totalGain: 55_750_000,
  gainPercent: 24.24,
  dayChange: 1_850_000,
  dayChangePercent: 0.65,

  holdings: [
    {
      id: '1',
      ticker: 'BBCA',
      name: 'Bank Central Asia',
      sector: 'Perbankan',
      type: 'saham',
      shares: 500,
      avgCost: 9_200,
      currentPrice: 10_350,
      value: 5_175_000,
      gain: 575_000,
      gainPercent: 12.5,
      color: '#3ecf8e',
      logo: 'B',
    },
    {
      id: '2',
      ticker: 'TLKM',
      name: 'Telkom Indonesia',
      sector: 'Telekomunikasi',
      type: 'saham',
      shares: 2_000,
      avgCost: 3_800,
      currentPrice: 3_510,
      value: 7_020_000,
      gain: -580_000,
      gainPercent: -7.63,
      color: '#e05c7a',
      logo: 'T',
    },
    {
      id: '3',
      ticker: 'ANTM',
      name: 'Aneka Tambang',
      sector: 'Pertambangan',
      type: 'saham',
      shares: 10_000,
      avgCost: 1_650,
      currentPrice: 2_090,
      value: 20_900_000,
      gain: 4_400_000,
      gainPercent: 26.67,
      color: '#f5a623',
      logo: 'A',
    },
    {
      id: '4',
      ticker: 'SBIC',
      name: 'Sucorinvest Sharia',
      sector: 'Reksa Dana',
      type: 'reksadana',
      shares: 50_000,
      avgCost: 1_920,
      currentPrice: 2_150,
      value: 107_500_000,
      gain: 11_500_000,
      gainPercent: 11.98,
      color: '#7c6fff',
      logo: 'R',
    },
    {
      id: '5',
      ticker: 'CRYPTO-ETH',
      name: 'Ethereum',
      sector: 'Kripto',
      type: 'kripto',
      shares: 0.5,
      avgCost: 48_000_000,
      currentPrice: 62_500_000,
      value: 31_250_000,
      gain: 7_250_000,
      gainPercent: 30.21,
      color: '#627eea',
      logo: 'Ξ',
    },
    {
      id: '6',
      ticker: 'XAUUSD',
      name: 'Emas Logam Mulia',
      sector: 'Komoditas',
      type: 'emas',
      shares: 50,
      avgCost: 1_020_000,
      currentPrice: 1_132_000,
      value: 56_600_000,
      gain: 5_600_000,
      gainPercent: 10.98,
      color: '#f59f00',
      logo: 'Au',
    },
    {
      id: '7',
      ticker: 'OBL-SBR012',
      name: 'SBR012 Obligasi Negara',
      sector: 'Obligasi',
      type: 'obligasi',
      shares: 1,
      avgCost: 25_000_000,
      currentPrice: 25_750_000,
      value: 25_750_000,
      gain: 750_000,
      gainPercent: 3.0,
      color: '#5b9ef7',
      logo: 'S',
    },
  ],
};

// ─── Asset Allocation ──────────────────────────────────────────────────────
export const MOCK_ALLOCATION_DATA = [
  { name: 'Saham', value: 33_095_000, percent: 11.58, color: '#3ecf8e' },
  { name: 'Reksa Dana', value: 107_500_000, percent: 37.62, color: '#7c6fff' },
  { name: 'Kripto', value: 31_250_000, percent: 10.94, color: '#627eea' },
  { name: 'Emas', value: 56_600_000, percent: 19.81, color: '#f59f00' },
  { name: 'Obligasi', value: 25_750_000, percent: 9.01, color: '#5b9ef7' },
];

// ─── Watchlist ─────────────────────────────────────────────────────────────
export const MOCK_WATCHLIST = [
  { ticker: 'GOTO', name: 'GoTo Gojek Tokopedia', price: 67, change: -3.2, volume: '1.2B', logo: 'G', sector: 'Teknologi' },
  { ticker: 'BRIS', name: 'Bank Syariah Indonesia', price: 2_060, change: 1.8, volume: '450M', logo: 'B', sector: 'Perbankan' },
  { ticker: 'INDF', name: 'Indofood Sukses Makmur', price: 7_225, change: 0.4, volume: '320M', logo: 'I', sector: 'Konsumer' },
  { ticker: 'ASII', name: 'Astra International', price: 4_820, change: -0.9, volume: '220M', logo: 'A', sector: 'Otomotif' },
  { ticker: 'BTC-IDR', name: 'Bitcoin', price: 1_485_000_000, change: 2.7, volume: '88B', logo: '₿', sector: 'Kripto' },
];

// ─── Performance History (12 months) ──────────────────────────────────────
export const MOCK_PERFORMANCE_SERIES = {
  portfolio: [210, 215, 222, 218, 235, 240, 248, 255, 260, 272, 281, 285.75],
  benchmark: [200, 204, 208, 205, 212, 218, 222, 228, 232, 240, 248, 255],
  months: ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
};

// ─── Top Movers (Intraday) ─────────────────────────────────────────────────
export const MOCK_TOP_MOVERS = {
  gainers: [
    { ticker: 'ANTM', price: 2_090, change: 6.63, logo: 'A' },
    { ticker: 'BRIS', price: 2_060, change: 4.56, logo: 'B' },
    { ticker: 'NICL', price: 1_325, change: 3.91, logo: 'N' },
  ],
  losers: [
    { ticker: 'GOTO', price: 67, change: -3.2, logo: 'G' },
    { ticker: 'ASII', price: 4_820, change: -2.05, logo: 'A' },
    { ticker: 'TLKM', price: 3_510, change: -1.38, logo: 'T' },
  ],
};

// ─── Dividend Calendar ─────────────────────────────────────────────────────
export const MOCK_DIVIDENDS = [
  { ticker: 'BBCA', date: '15 Mei 2026', amount: 45_000, status: 'upcoming' },
  { ticker: 'ANTM', date: '28 Mei 2026', amount: 210_000, status: 'upcoming' },
  { ticker: 'TLKM', date: '10 Apr 2026', amount: 130_000, status: 'paid' },
];

// ─── Risk Profile ──────────────────────────────────────────────────────────
export const MOCK_RISK_PROFILE = {
  score: 65,
  level: 'Aggressive Growth',
  description: 'Portfolio Anda didominasi oleh aset berisiko tinggi dengan potensi imbal hasil yang besar.',
  allocation: {
    high: 42, // Saham, Kripto
    medium: 38, // Reksa Dana, Emas
    low: 20, // Obligasi, Cash
  },
};

// ─── Wealth Goals ──────────────────────────────────────────────────────────
export const MOCK_WEALTH_GOALS = [
  { id: '1', name: 'Dana Pensiun', target: 2_000_000_000, current: 150_000_000, color: '#7c6fff', icon: 'pension' },
  { id: '2', name: 'Pendidikan Anak', target: 500_000_000, current: 85_000_000, color: '#5b9ef7', icon: 'school' },
  { id: '3', name: 'Beli Rumah ke-2', target: 1_200_000_000, current: 50_750_000, color: '#f59f00', icon: 'home' },
];

// ─── Monthly Income Projection ──────────────────────────────────────────────
export const MOCK_INCOME_PROJECTION = [
  { month: 'Jan', amount: 450_000 },
  { month: 'Feb', amount: 520_000 },
  { month: 'Mar', amount: 480_000 },
  { month: 'Apr', amount: 650_000 },
  { month: 'Mei', amount: 850_000 },
  { month: 'Jun', amount: 920_000 },
];
