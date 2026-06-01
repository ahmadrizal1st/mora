export type DebtStatus = 'Jatuh Tempo' | 'Menunggu' | 'Sebagian' | 'Belum Lunas' | 'Lunas'
export type DebtType = 'Utang' | 'Piutang'
export type PriorityType = 'Tinggi' | 'Sedang' | 'Rendah'

export interface DebtRecord {
  id: string
  personName: string
  description: string
  type: DebtType
  amount: number
  amountPaid: number
  status: DebtStatus
  priority: PriorityType
  dueDate: string
  createdAt: string
}

export const MOCK_DEBTS_DATA: DebtRecord[] = [
  {
    id: 'd-1',
    personName: 'Ahmad Rizal',
    description: 'Pinjaman pribadi',
    type: 'Piutang',
    amount: 1500000,
    amountPaid: 0,
    status: 'Menunggu',
    priority: 'Sedang',
    dueDate: '2026-06-12',
    createdAt: '2026-05-15',
  },
  {
    id: 'd-2',
    personName: 'PT Sukses Bersama',
    description: 'Pembayaran proyek',
    type: 'Piutang',
    amount: 5000000,
    amountPaid: 2000000,
    status: 'Sebagian',
    priority: 'Tinggi',
    dueDate: '2026-06-25',
    createdAt: '2026-05-20',
  },
  {
    id: 'd-3',
    personName: 'Bank Mandiri',
    description: 'Pinjaman modal',
    type: 'Utang',
    amount: 2500000,
    amountPaid: 0,
    status: 'Belum Lunas',
    priority: 'Tinggi',
    dueDate: '2026-06-20',
    createdAt: '2026-04-10',
  },
  {
    id: 'd-4',
    personName: 'Budi Santoso',
    description: 'Uang titipan',
    type: 'Piutang',
    amount: 850000,
    amountPaid: 0,
    status: 'Jatuh Tempo',
    priority: 'Sedang',
    dueDate: '2026-05-10', // Past due
    createdAt: '2026-05-01',
  },
  {
    id: 'd-5',
    personName: 'Kartu Kredit BCA',
    description: 'Tagihan bulan Mei',
    type: 'Utang',
    amount: 1250000,
    amountPaid: 0,
    status: 'Belum Lunas',
    priority: 'Sedang',
    dueDate: '2026-06-15',
    createdAt: '2026-05-20',
  },
]

export const MOCK_DEBT_TREND = {
  categories: ['1 Mei', '6 Mei', '11 Mei', '16 Mei', '21 Mei', '26 Mei', '31 Mei'],
  piutang: [6000000, 11000000, 9000000, 7000000, 11000000, 10000000, 13000000],
  utang: [3000000, 4000000, 5000000, 3000000, 5000000, 7000000, 6000000],
}

export const getDebtsSummary = (debts: DebtRecord[]) => {
  const activeDebts = debts.filter((d) => d.type === 'Utang' && d.status !== 'Lunas')
  const activeReceivables = debts.filter((d) => d.type === 'Piutang' && d.status !== 'Lunas')

  const totalDebtAmount = activeDebts.reduce((acc, curr) => acc + curr.amount, 0)
  const totalReceivableAmount = activeReceivables.reduce((acc, curr) => acc + curr.amount, 0)

  return {
    totalDebt: totalDebtAmount,
    totalReceivable: totalReceivableAmount,
    activeDebtCount: activeDebts.length,
    activeReceivableCount: activeReceivables.length,
    netCashflow: totalReceivableAmount - totalDebtAmount,
  }
}
