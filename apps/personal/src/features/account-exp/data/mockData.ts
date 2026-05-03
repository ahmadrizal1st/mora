export const BUDGET_DATA = [
  {
    type: 'Bank BCA',
    name: 'Tabungan Utama',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg',
    num: '•••• •••• •••• 4821',
    bal: '24.850.000',
    chg: '▲ +2,4%',
    chgPos: true,
    inc: '+8.500.000',
    incSub: '3 transaksi',
    exp: '-3.240.000',
    expSub: '18 transaksi',
    color: '#7c6fff',
    tx: [
      { ico: '🛒', bg: 'rgba(91,158,247,.2)', n: 'Indomaret', c: 'Shopping', a: '-85.000', d: 'Hari ini', p: false },
      { ico: '💼', bg: 'rgba(62,207,142,.2)', n: 'Gaji Mei', c: 'Income', a: '+8.500.000', d: 'Hari ini', p: true },
      { ico: '🍜', bg: 'rgba(124,111,255,.2)', n: 'Warung Makan', c: 'Food', a: '-45.000', d: 'Kemarin', p: false },
      { ico: '⚡', bg: 'rgba(245,166,35,.2)', n: 'PLN Token', c: 'Bills', a: '-200.000', d: '1 Mei', p: false },
      { ico: '🚗', bg: 'rgba(62,207,142,.2)', n: 'Shell Pertamina', c: 'Transport', a: '-150.000', d: '30 Apr', p: false }
    ],
    cats: [
      { ico: '🍜', bg: 'rgba(124,111,255,.2)', n: 'Food', pct: 70, v: '1,1 jt', col: '#7c6fff' },
      { ico: '🛍️', bg: 'rgba(91,158,247,.2)', n: 'Shopping', pct: 52, v: '810 rb', col: '#5b9ef7' },
      { ico: '🚗', bg: 'rgba(62,207,142,.2)', n: 'Transport', pct: 38, v: '648 rb', col: '#3ecf8e' },
      { ico: '💡', bg: 'rgba(245,166,35,.2)', n: 'Bills', pct: 28, v: '682 rb', col: '#f5a623' }
    ],
    goals: [
      { ico: '✈️', n: 'Liburan Bali', c: 3200000, t: 5000000, col: '#7c6fff' },
      { ico: '📱', n: 'iPhone 16', c: 8000000, t: 15000000, col: '#5b9ef7' },
      { ico: '🏠', n: 'DP Rumah', c: 45000000, t: 200000000, col: '#3ecf8e' }
    ]
  },
  {
    type: 'GoPay',
    name: 'Dompet Digital',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
    num: '085-1234-5678',
    bal: '1.250.000',
    chg: '▼ -0,8%',
    chgPos: false,
    inc: '+500.000',
    incSub: '1 top up',
    exp: '-620.000',
    expSub: '12 transaksi',
    color: '#3ecf8e',
    tx: [
      { ico: '🛵', bg: 'rgba(62,207,142,.2)', n: 'GoFood', c: 'Food', a: '-55.000', d: 'Hari ini', p: false },
      { ico: '🚌', bg: 'rgba(91,158,247,.2)', n: 'GoRide', c: 'Transport', a: '-18.000', d: 'Hari ini', p: false },
      { ico: '💰', bg: 'rgba(62,207,142,.2)', n: 'Top Up GoPay', c: 'Income', a: '+500.000', d: 'Kemarin', p: true }
    ],
    cats: [
      { ico: '🍜', bg: 'rgba(62,207,142,.2)', n: 'Food', pct: 60, v: '328 rb', col: '#3ecf8e' },
      { ico: '🚗', bg: 'rgba(91,158,247,.2)', n: 'Transport', pct: 35, v: '175 rb', col: '#5b9ef7' },
      { ico: '🎬', bg: 'rgba(224,92,122,.2)', n: 'Entertain', pct: 22, v: '59 rb', col: '#e05c7a' },
      { ico: '🛒', bg: 'rgba(124,111,255,.2)', n: 'Other', pct: 10, v: '58 rb', col: '#7c6fff' }
    ],
    goals: [
      { ico: '🎮', n: 'Gaming Setup', c: 1500000, t: 4000000, col: '#3ecf8e' },
      { ico: '📚', n: 'Kursus Online', c: 800000, t: 2000000, col: '#7c6fff' }
    ]
  },
  {
    type: 'OVO',
    name: 'OVO Cash',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg',
    num: '085-9876-5432',
    bal: '875.000',
    chg: '▲ +1,2%',
    chgPos: true,
    inc: '+300.000',
    incSub: '1 top up',
    exp: '-215.000',
    expSub: '5 transaksi',
    color: '#f5a623',
    tx: [
      { ico: '☕', bg: 'rgba(245,166,35,.2)', n: 'Kopi Kenangan', c: 'Food', a: '-35.000', d: 'Hari ini', p: false },
      { ico: '💰', bg: 'rgba(62,207,142,.2)', n: 'Cashback OVO', c: 'Cashback', a: '+12.500', d: 'Hari ini', p: true },
      { ico: '🛍️', bg: 'rgba(91,158,247,.2)', n: 'Tokopedia', c: 'Shopping', a: '-178.000', d: '30 Apr', p: false },
      { ico: '💰', bg: 'rgba(62,207,142,.2)', n: 'Top Up OVO', c: 'Income', a: '+300.000', d: '29 Apr', p: true }
    ],
    cats: [
      { ico: '🛍️', bg: 'rgba(245,166,35,.2)', n: 'Shopping', pct: 78, v: '178 rb', col: '#f5a623' },
      { ico: '🍜', bg: 'rgba(124,111,255,.2)', n: 'Food', pct: 32, v: '35 rb', col: '#7c6fff' },
      { ico: '🚌', bg: 'rgba(62,207,142,.2)', n: 'Transport', pct: 5, v: '2 rb', col: '#3ecf8e' },
      { ico: '💡', bg: 'rgba(91,158,247,.2)', n: 'Other', pct: 0, v: '0 rb', col: '#5b9ef7' }
    ],
    goals: [
      { ico: '👗', n: 'Fashion Budget', c: 600000, t: 1500000, col: '#f5a623' }
    ]
  },
  {
    type: 'Bank Mandiri',
    name: 'Tabungan Bisnis',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg',
    num: '•••• •••• •••• 9134',
    bal: '7.340.000',
    chg: '▲ +0,1%',
    chgPos: true,
    inc: '+12.000.000',
    incSub: '4 transaksi',
    exp: '-5.800.000',
    expSub: '8 transaksi',
    color: '#5b9ef7',
    tx: [
      { ico: '💼', bg: 'rgba(62,207,142,.2)', n: 'Transfer Client', c: 'Income', a: '+4.500.000', d: 'Hari ini', p: true },
      { ico: '🖥️', bg: 'rgba(91,158,247,.2)', n: 'Hosting Server', c: 'Business', a: '-1.200.000', d: 'Kemarin', p: false },
      { ico: '📦', bg: 'rgba(245,166,35,.2)', n: 'Supplier', c: 'Business', a: '-2.300.000', d: '30 Apr', p: false },
      { ico: '💼', bg: 'rgba(62,207,142,.2)', n: 'Freelance', c: 'Income', a: '+7.500.000', d: '28 Apr', p: true },
      { ico: '📊', bg: 'rgba(124,111,255,.2)', n: 'SaaS Tools', c: 'Business', a: '-300.000', d: '27 Apr', p: false }
    ],
    cats: [
      { ico: '🖥️', bg: 'rgba(91,158,247,.2)', n: 'Business', pct: 82, v: '3,8 jt', col: '#5b9ef7' },
      { ico: '📦', bg: 'rgba(245,166,35,.2)', n: 'Ops', pct: 45, v: '2,0 jt', col: '#f5a623' },
      { ico: '💼', bg: 'rgba(62,207,142,.2)', n: 'Tax', pct: 10, v: '0 rb', col: '#3ecf8e' },
      { ico: '💡', bg: 'rgba(124,111,255,.2)', n: 'Other', pct: 5, v: '0 rb', col: '#7c6fff' }
    ],
    goals: [
      { ico: '🏢', n: 'Modal Usaha', c: 15000000, t: 50000000, col: '#5b9ef7' },
      { ico: '📈', n: 'Reksa Dana', c: 5000000, t: 20000000, col: '#3ecf8e' }
    ]
  },
  {
    type: 'Dana',
    name: 'Dana Personal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg',
    num: '085-7654-3210',
    bal: '420.000',
    chg: '▲ +3,1%',
    chgPos: true,
    inc: '+200.000',
    incSub: '1 transfer',
    exp: '-145.000',
    expSub: '4 transaksi',
    color: '#e05c7a',
    tx: [
      { ico: '💳', bg: 'rgba(245,166,35,.2)', n: 'Tagihan Air', c: 'Bills', a: '-85.000', d: 'Hari ini', p: false },
      { ico: '💰', bg: 'rgba(62,207,142,.2)', n: 'Transfer Masuk', c: 'Income', a: '+200.000', d: 'Kemarin', p: true },
      { ico: '🍕', bg: 'rgba(124,111,255,.2)', n: 'Grab Food', c: 'Food', a: '-60.000', d: '30 Apr', p: false },
      { ico: '🎫', bg: 'rgba(224,92,122,.2)', n: 'Bioskop', c: 'Entertain', a: '-55.000', d: '29 Apr', p: false }
    ],
    cats: [
      { ico: '💡', bg: 'rgba(245,166,35,.2)', n: 'Bills', pct: 55, v: '85 rb', col: '#f5a623' },
      { ico: '🍕', bg: 'rgba(124,111,255,.2)', n: 'Food', pct: 38, v: '60 rb', col: '#7c6fff' },
      { ico: '🎬', bg: 'rgba(91,158,247,.2)', n: 'Fun', pct: 10, v: '0 rb', col: '#5b9ef7' },
      { ico: '🛒', bg: 'rgba(62,207,142,.2)', n: 'Other', pct: 5, v: '0 rb', col: '#3ecf8e' }
    ],
    goals: [
      { ico: '🎓', n: 'Biaya Pendidikan', c: 2500000, t: 10000000, col: '#e05c7a' }
    ]
  }
];

export const BILLS_DATA = [
  { ico: '🌐', name: 'Indihome Internet', due: 'Jatuh tempo 10 Mei', amt: '350.000' },
  { ico: '🏠', name: 'Sewa Apartemen', due: 'Jatuh tempo 15 Mei', amt: '4.500.000' },
  { ico: '🛡️', name: 'Prudential Insurance', due: 'Jatuh tempo 20 Mei', amt: '850.000' }
];
