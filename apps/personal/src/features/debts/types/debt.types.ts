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
