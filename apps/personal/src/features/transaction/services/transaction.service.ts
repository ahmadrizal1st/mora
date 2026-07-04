import api from '@/shared/api/client'
import { type PaginatedResponse } from '@/shared/types/common.types'
import {
  type Transaction,
  type TransactionFilters,
  type TransactionSummary,
  type TransactionHistory,
  type CreateTransactionDTO,
  type UpdateTransactionDTO,
} from '../types/transaction.types'

function buildSortParam(filters?: TransactionFilters): string {
  if (filters?.sort_by) {
    const dir = filters.sort_dir === 'asc' ? '' : '-'
    return `${dir}${filters.sort_by}`
  }
  return '-created_at'
}

export const transactionService = {
  async getTransactions(params?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    const { ...rest } = params ?? {}
    const queryParams = { ...rest, sort: buildSortParam(params) }

    const response = await api.get<{
      data: Transaction[]
      meta: { current_page: number; last_page: number; per_page: number; total: number }
    }>('/transactions', { params: queryParams })

    return {
      data: response.data.data,
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      per_page: response.data.meta.per_page,
      total: response.data.meta.total,
      from: (response.data.meta.current_page - 1) * response.data.meta.per_page + 1,
      to: Math.min(
        response.data.meta.current_page * response.data.meta.per_page,
        response.data.meta.total
      ),
      prev_page_url: null,
      next_page_url: null,
      path: '/transactions',
    }
  },

  async getTransaction(id: string): Promise<Transaction> {
    const response = await api.get<{ data: Transaction }>(`/transactions/${id}`)
    return response.data.data
  },

  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    const response = await api.post<{ data: Transaction }>('/transactions', data)
    return response.data.data
  },

  async updateTransaction(id: string, data: UpdateTransactionDTO): Promise<Transaction> {
    const response = await api.put<{ data: Transaction }>(`/transactions/${id}`, data)
    return response.data.data
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`)
  },

  async getSummary(params?: {
    date_from?: string
    date_to?: string
    account_id?: string
    group_by?: string
  }): Promise<TransactionSummary> {
    const response = await api.get<{ data: TransactionSummary }>('/transactions-summary', {
      params,
    })
    return response.data.data
  },

  async getChartData(params?: TransactionFilters): Promise<Transaction[]> {
    const response = await api.get<PaginatedResponse<Transaction>>('/transactions', {
      params: {
        ...params,
        per_page: 500,
        page: 1,
      },
    })
    return response.data.data
  },

  async getHistory(params?: {
    date_from?: string
    date_to?: string
    account_id?: string
    group_by?: string
  }): Promise<TransactionHistory> {
    const response = await api.get<{ data: TransactionHistory }>('/transactions-history', {
      params,
    })
    return response.data.data
  },

  async getStatistics(): Promise<any> {
    const response = await api.get<{ data: any }>('/transactions-statistics')
    return response.data.data
  },

  async getRecap(params?: {
    date_from?: string
    date_to?: string
  }): Promise<{
    income: number
    expense: number
    total_tx: number
    saving_rate: number
    kategori_juara: string
    pengeluaran_terbesar: string
    hari_paling_boros: string
    hari_tanpa_belanja: number
    waktu_paling_boros: string
    dompet_paling_sering: string
    kepatuhan_anggaran: string
    pinjaman_terbesar_ke: string
    perubahan_dibanding_bulan_lalu: string
  }> {
    const response = await api.get<{ data: any }>('/reports/recap', {
      params,
    })
    return response.data.data
  },
}
