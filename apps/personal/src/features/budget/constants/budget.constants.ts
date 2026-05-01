// src/features/budget/constants/budget.constants.ts

export const BUDGET_METHODS_INFO: Record<string, { title: string; description: string }> = {
  '50_30_20': {
    title: '50/30/20 Rule',
    description: 'Membagi pendapatan menjadi: 50% Kebutuhan (makan, sewa, tagihan), 30% Keinginan (hiburan, makan di luar), dan 20% Tabungan & pelunasan utang.'
  },
  'zero_based': {
    title: 'Zero-Based Budgeting (ZBB)',
    description: 'Setiap rupiah pendapatan dialokasikan hingga saldo = 0. Semua pengeluaran harus dijustifikasi dari awal setiap periode.'
  },
  'envelope': {
    title: 'Envelope Method',
    description: 'Uang tunai dibagi ke dalam amplop sesuai kategori. Jika amplop habis, tidak boleh belanja di kategori itu.'
  },
  'pay_yourself_first': {
    title: 'Pay Yourself First',
    description: 'Langsung sisihkan tabungan/investasi di awal sebelum membelanjakan sisa pendapatan.'
  },
  'line_item': {
    title: 'Line-Item Budgeting',
    description: 'Membuat daftar rinci setiap pos pengeluaran secara spesifik — umum dipakai di perusahaan/pemerintahan.'
  },
  'incremental': {
    title: 'Incremental Budgeting',
    description: 'Anggaran dibuat berdasarkan anggaran periode sebelumnya dengan penyesuaian kenaikan/penurunan tertentu.'
  },
  'activity_based': {
    title: 'Activity-Based Budgeting (ABB)',
    description: 'Anggaran disusun berdasarkan aktivitas yang menghasilkan biaya — cocok untuk bisnis yang ingin efisiensi.'
  },
  'rolling': {
    title: 'Rolling/Continuous Budgeting',
    description: 'Anggaran diperbarui secara berkala (misal setiap bulan untuk 12 bulan ke depan), bukan sekali setahun.'
  },
  'value_proposition': {
    title: 'Value Proposition Budgeting',
    description: 'Setiap pengeluaran dievaluasi: apakah memberikan nilai? Jika tidak, dihapus dari anggaran.'
  },
  'cash_flow': {
    title: 'Cash Flow Budgeting',
    description: 'Fokus pada proyeksi arus kas masuk dan keluar untuk memastikan likuiditas di setiap periode.'
  }
};

export interface DefaultBudgetItem {
  name: string;
  percentage: number;
  color: string;
  icon: string;
  category_ids: number[];
}

export const METHOD_DEFAULT_ITEMS: Record<string, DefaultBudgetItem[]> = {
  '50_30_20': [
    { name: 'Needs', percentage: 50, color: 'blue', icon: 'smart-home', category_ids: [] },
    { name: 'Wants', percentage: 30, color: 'orange', icon: 'shopping-cart', category_ids: [] },
    { name: 'Savings', percentage: 20, color: 'green', icon: 'coin', category_ids: [] },
  ],
  'zero_based': [
    { name: 'Housing', percentage: 30, color: 'blue', icon: 'smart-home', category_ids: [] },
    { name: 'Food', percentage: 15, color: 'orange', icon: 'ice-cream', category_ids: [] },
    { name: 'Transport', percentage: 10, color: 'azure', icon: 'car', category_ids: [] },
    { name: 'Utilities', percentage: 10, color: 'yellow', icon: 'bolt', category_ids: [] },
    { name: 'Health', percentage: 5, color: 'red', icon: 'heart', category_ids: [] },
    { name: 'Savings', percentage: 20, color: 'green', icon: 'coin', category_ids: [] },
    { name: 'Others', percentage: 10, color: 'gray', icon: 'hash', category_ids: [] },
  ],
  'pay_yourself_first': [
    { name: 'Savings & Investments', percentage: 30, color: 'green', icon: 'chart-pie', category_ids: [] },
    { name: 'Living Expenses', percentage: 70, color: 'blue', icon: 'wallet', category_ids: [] },
  ],
  'envelope': [
    { name: 'Groceries', percentage: 20, color: 'orange', icon: 'shopping-bag', category_ids: [] },
    { name: 'Rent/Mortgage', percentage: 35, color: 'blue', icon: 'building', category_ids: [] },
    { name: 'Dining Out', percentage: 10, color: 'coffee', icon: 'beer', category_ids: [] },
    { name: 'Transportation', percentage: 10, color: 'azure', icon: 'bus', category_ids: [] },
    { name: 'Savings', percentage: 25, color: 'green', icon: 'coin', category_ids: [] },
  ],
  'line_item': [
    { name: 'Salary/Income', percentage: 100, color: 'green', icon: 'cash', category_ids: [] },
    { name: 'Fixed Expenses', percentage: 60, color: 'blue', icon: 'lock', category_ids: [] },
    { name: 'Variable Expenses', percentage: 30, color: 'orange', icon: 'variable', category_ids: [] },
    { name: 'Discretionary', percentage: 10, color: 'purple', icon: 'gift', category_ids: [] },
  ],
  'incremental': [
    { name: 'Base Operations', percentage: 80, color: 'blue', icon: 'settings', category_ids: [] },
    { name: 'Growth/Adjustments', percentage: 20, color: 'green', icon: 'trending-up', category_ids: [] },
  ],
  'activity_based': [
    { name: 'Core Activities', percentage: 70, color: 'indigo', icon: 'activity', category_ids: [] },
    { name: 'Support Activities', percentage: 30, color: 'cyan', icon: 'lifebuoy', category_ids: [] },
  ],
  'rolling': [
    { name: 'Q1 Allocation', percentage: 25, color: 'blue', icon: 'calendar', category_ids: [] },
    { name: 'Q2 Allocation', percentage: 25, color: 'azure', icon: 'calendar', category_ids: [] },
    { name: 'Q3 Allocation', percentage: 25, color: 'indigo', icon: 'calendar', category_ids: [] },
    { name: 'Q4 Allocation', percentage: 25, color: 'purple', icon: 'calendar', category_ids: [] },
  ],
  'value_proposition': [
    { name: 'High Value', percentage: 60, color: 'green', icon: 'award', category_ids: [] },
    { name: 'Necessary', percentage: 30, color: 'blue', icon: 'check', category_ids: [] },
    { name: 'Low Value/Review', percentage: 10, color: 'red', icon: 'alert-triangle', category_ids: [] },
  ],
  'cash_flow': [
    { name: 'Inflow Buffer', percentage: 10, color: 'green', icon: 'arrow-down-left', category_ids: [] },
    { name: 'Fixed Outflow', percentage: 50, color: 'blue', icon: 'arrow-up-right', category_ids: [] },
    { name: 'Variable Outflow', percentage: 40, color: 'orange', icon: 'refresh', category_ids: [] },
  ]
};

export const DEFAULT_ITEMS = METHOD_DEFAULT_ITEMS['50_30_20'];
