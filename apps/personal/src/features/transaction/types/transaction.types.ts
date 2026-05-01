export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
}

export interface CreditAccount {
  id: string;
  account_id: string;
  user_id: string;
  limit_amount: number;
  interest_rate?: number;
  billing_cycle_day?: number;
  due_date_day?: number;
  minimum_payment?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  balance_raw?: number;
  currency_id: string;
  currency?: Currency;
  color: string;
  account_type: 'cash' | 'bank' | 'e-wallet' | 'investment' | 'credit' | 'saving' | 'loan';
  transactions_count?: number;
  incoming_transfers_count?: number;
  history?: {
    balance: number[];
    income: number[];
    expense: number[];
    labels: string[];
  };
  created_at: string;
}

export interface AccountFilters {
  group_by?: 'day' | 'week' | 'month' | 'year';
  filter?: {
    name?: string;
    account_type?: string;
    currency_id?: string;
  };
  sort?: string;
}

export interface AccountResponse {
  data: Account[];
  status?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color: string;
  user_id?: string | null;
  parent_id?: string | null;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface Status {
  id: string;
  name: string;
  color: string;
}

export interface RecurringType {
  id: string;
  name: string;
  interval_days: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount_raw: number;
  currency_id: string;
  currency?: Currency;
  exchange_rate: number;
  amount_in_default: number;
  account_id: string;
  account?: Account;
  to_account_id?: string | null;
  to_account?: Account;
  category_id?: string | null;
  category?: Category;
  budget_item_id?: string | null;
  status_id?: string | null;
  status?: Status;
  recurring_type_id?: string | null;
  recurring_type?: RecurringType;
  document_extraction_id?: string | null;
  split_bill_id?: string | null;
  tx_date: string;
  merchant?: string;
  notes?: string;
  input_method: 'manual' | 'image' | 'file' | 'audio' | 'automation';
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
  prev_income?: number[];
  prev_expense?: number[];
  prev_count?: number[];
}

export interface TransactionFilters {
  type?: TransactionType;
  account_id?: string;
  category_id?: string;
  status_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
  tag_ids?: string[];
  group_by?: 'day' | 'week' | 'month' | 'year';
}

export type CreateTransactionDTO = Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'account' | 'to_account' | 'category' | 'status' | 'currency' | 'recurring_type' | 'tags' | 'exchange_rate' | 'amount_in_default' | 'currency_id'> & {
  tag_ids?: string[];
  currency_id?: string;
};

export type UpdateTransactionDTO = Partial<CreateTransactionDTO>;

export type CreateAccountDTO = Omit<Account, 'id' | 'user_id' | 'created_at' | 'currency' | 'balance_raw' | 'transactions_count' | 'incoming_transfers_count' | 'history'>;
export type UpdateAccountDTO = Partial<CreateAccountDTO>;

export type CreateTagDTO = Omit<Tag, 'id' | 'user_id'>;
