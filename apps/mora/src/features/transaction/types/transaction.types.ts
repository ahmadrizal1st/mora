export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Currency {
  id: number;
  code: string;
  symbol: string;
  name: string;
  rate_to_idr: number;
  is_default: boolean;
  is_active: boolean;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  balance_raw: number;
  currency_id: number;
  currency?: Currency;
  color: string;
  type: 'cash' | 'bank' | 'e-wallet' | 'investment';
  is_credit: boolean;
  credit_limit: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  tx_type: TransactionType;
  icon?: string;
  color: string;
  is_default: boolean;
}

export interface Tag {
  id: number;
  user_id: number;
  name: string;
  color: string;
}

export interface Status {
  id: number;
  name: string;
  color: string;
}

export interface RecurringType {
  id: number;
  name: string;
  interval_days: number;
}

export interface Transaction {
  id: number;
  user_id: number;
  type: TransactionType;
  amount_raw: number;
  currency_id: number;
  currency?: Currency;
  rate_snapshot: number;
  amount_in_default: number;
  account_id: number;
  account?: Account;
  to_account_id?: number | null;
  to_account?: Account;
  category_id?: number | null;
  category?: Category;
  status_id?: number | null;
  status?: Status;
  recurring_type_id?: number;
  recurring_type?: RecurringType;
  tx_date: string;
  merchant?: string;
  notes?: string;
  dynamic_fields?: Record<string, unknown>;
  tags?: Tag[];
  created_at: string;
}

export interface TransactionSummary {
  total_income: number;
  total_expense: number;
  net_balance: number;
  transaction_count: number;
  income_trend: number;
  expense_trend: number;
  count_trend: number;
  balance_trend: number;
}

export interface TransactionHistory {
  income: number[];
  income_labels: string[];
  expense: number[];
  expense_labels: string[];
  count: number[];
  count_labels: string[];
}

export interface TransactionFilters {
  type?: TransactionType;
  account_id?: number;
  category_id?: number;
  status_id?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export type CreateTransactionDTO = Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'account' | 'to_account' | 'category' | 'status' | 'currency' | 'recurring_type' | 'tags' | 'rate_snapshot' | 'amount_in_default' | 'currency_id'> & {
  tag_ids?: number[];
  currency_id?: number;
};

export type UpdateTransactionDTO = Partial<CreateTransactionDTO>;

export type CreateAccountDTO = Omit<Account, 'id' | 'user_id' | 'created_at' | 'currency'>;
export type UpdateAccountDTO = Partial<CreateAccountDTO>;

export type CreateTagDTO = Omit<Tag, 'id' | 'user_id'>;
