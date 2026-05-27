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
    color: 'purple',
    tx: [
      { ico: 'shopping-cart', color: 'blue', n: 'Indomaret', c: 'Shopping', a: '-85.000', d: 'Hari ini', p: false },
      { ico: 'briefcase', color: 'green', n: 'Gaji Mei', c: 'Income', a: '+8.500.000', d: 'Hari ini', p: true },
      { ico: 'soup', color: 'purple', n: 'Warung Makan', c: 'Food', a: '-45.000', d: 'Kemarin', p: false },
      { ico: 'bolt', color: 'orange', n: 'PLN Token', c: 'Bills', a: '-200.000', d: '1 Mei', p: false },
      { ico: 'car', color: 'green', n: 'Shell Pertamina', c: 'Transport', a: '-150.000', d: '30 Apr', p: false }
    ],
    cats: [
      { ico: 'soup', color: 'purple', n: 'Food', pct: 70, v: '1,1 jt' },
      { ico: 'shopping-cart', color: 'blue', n: 'Shopping', pct: 52, v: '810 rb' },
      { ico: 'car', color: 'green', n: 'Transport', pct: 38, v: '648 rb' },
      { ico: 'bulb', color: 'orange', n: 'Bills', pct: 28, v: '682 rb' }
    ],
    goals: [
      { ico: 'plane', n: 'Liburan Bali', c: 3200000, t: 5000000, col: 'purple' },
      { ico: 'device-mobile', n: 'iPhone 16', c: 8000000, t: 15000000, col: 'blue' },
      { ico: 'home', n: 'DP Rumah', c: 45000000, t: 200000000, col: 'green' }
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
    color: 'green',
    tx: [
      { ico: 'bike', color: 'green', n: 'GoFood', c: 'Food', a: '-55.000', d: 'Hari ini', p: false },
      { ico: 'bike', color: 'blue', n: 'GoRide', c: 'Transport', a: '-18.000', d: 'Hari ini', p: false },
      { ico: 'coin', color: 'green', n: 'Top Up GoPay', c: 'Income', a: '+500.000', d: 'Kemarin', p: true }
    ],
    cats: [
      { ico: 'soup', color: 'green', n: 'Food', pct: 60, v: '328 rb' },
      { ico: 'car', color: 'blue', n: 'Transport', pct: 35, v: '175 rb' },
      { ico: 'movie', color: 'pink', n: 'Entertain', pct: 22, v: '59 rb' },
      { ico: 'shopping-cart', color: 'purple', n: 'Other', pct: 10, v: '58 rb' }
    ],
    goals: [
      { ico: 'device-gamepad-2', n: 'Gaming Setup', c: 1500000, t: 4000000, col: 'green' },
      { ico: 'book', n: 'Kursus Online', c: 800000, t: 2000000, col: 'purple' }
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
    color: 'orange',
    tx: [
      { ico: 'coffee', color: 'orange', n: 'Kopi Kenangan', c: 'Food', a: '-35.000', d: 'Hari ini', p: false },
      { ico: 'coin', color: 'green', n: 'Cashback OVO', c: 'Cashback', a: '+12.500', d: 'Hari ini', p: true },
      { ico: 'shopping-cart', color: 'blue', n: 'Tokopedia', c: 'Shopping', a: '-178.000', d: '30 Apr', p: false },
      { ico: 'coin', color: 'green', n: 'Top Up OVO', c: 'Income', a: '+300.000', d: '29 Apr', p: true }
    ],
    cats: [
      { ico: 'shopping-cart', color: 'orange', n: 'Shopping', pct: 78, v: '178 rb' },
      { ico: 'soup', color: 'purple', n: 'Food', pct: 32, v: '35 rb' },
      { ico: 'car', color: 'green', n: 'Transport', pct: 5, v: '2 rb' },
      { ico: 'bulb', color: 'blue', n: 'Other', pct: 0, v: '0 rb' }
    ],
    goals: [
      { ico: 'hanger', n: 'Fashion Budget', c: 600000, t: 1500000, col: 'orange' }
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
    color: 'blue',
    tx: [
      { ico: 'briefcase', color: 'green', n: 'Transfer Client', c: 'Income', a: '+4.500.000', d: 'Hari ini', p: true },
      { ico: 'building', color: 'blue', n: 'Hosting Server', c: 'Business', a: '-1.200.000', d: 'Kemarin', p: false },
      { ico: 'building', color: 'orange', n: 'Supplier', c: 'Business', a: '-2.300.000', d: '30 Apr', p: false },
      { ico: 'briefcase', color: 'green', n: 'Freelance', c: 'Income', a: '+7.500.000', d: '28 Apr', p: true },
      { ico: 'chart-line', color: 'purple', n: 'SaaS Tools', c: 'Business', a: '-300.000', d: '27 Apr', p: false }
    ],
    cats: [
      { ico: 'building', color: 'blue', n: 'Business', pct: 82, v: '3,8 jt' },
      { ico: 'building', color: 'orange', n: 'Ops', pct: 45, v: '2,0 jt' },
      { ico: 'briefcase', color: 'green', n: 'Tax', pct: 10, v: '0 rb' },
      { ico: 'bulb', color: 'purple', n: 'Other', pct: 5, v: '0 rb' }
    ],
    goals: [
      { ico: 'building', n: 'Modal Usaha', c: 15000000, t: 50000000, col: 'blue' },
      { ico: 'chart-line', n: 'Reksa Dana', c: 5000000, t: 20000000, col: 'green' }
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
    color: 'pink',
    tx: [
      { ico: 'credit-card', color: 'orange', n: 'Tagihan Air', c: 'Bills', a: '-85.000', d: 'Hari ini', p: false },
      { ico: 'coin', color: 'green', n: 'Transfer Masuk', c: 'Income', a: '+200.000', d: 'Kemarin', p: true },
      { ico: 'pizza', color: 'purple', n: 'Grab Food', c: 'Food', a: '-60.000', d: '30 Apr', p: false },
      { ico: 'ticket', color: 'pink', n: 'Bioskop', c: 'Entertain', a: '-55.000', d: '29 Apr', p: false }
    ],
    cats: [
      { ico: 'bulb', color: 'orange', n: 'Bills', pct: 55, v: '85 rb' },
      { ico: 'pizza', color: 'purple', n: 'Food', pct: 38, v: '60 rb' },
      { ico: 'ticket', color: 'blue', n: 'Fun', pct: 10, v: '0 rb' },
      { ico: 'shopping-cart', color: 'green', n: 'Other', pct: 5, v: '0 rb' }
    ],
    goals: [
      { ico: 'school', n: 'Biaya Pendidikan', c: 2500000, t: 10000000, col: 'pink' }
    ]
  }
];

export const BILLS_DATA = [
  { ico: 'world', name: 'Indihome Internet', due: 'Jatuh tempo 10 Mei', amt: '350.000' },
  { ico: 'home', name: 'Sewa Apartemen', due: 'Jatuh tempo 15 Mei', amt: '4.500.000' },
  { ico: 'shield-check', name: 'Prudential Insurance', due: 'Jatuh tempo 20 Mei', amt: '850.000' }
];
