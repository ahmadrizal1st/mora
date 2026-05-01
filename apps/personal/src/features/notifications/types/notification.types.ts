export interface NotificationData {
  status: 'success' | 'error';
  title: string;
  message: string;
  url?: string;
  extra_data?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  is_starred: boolean;
  label?: string;
  created_at: string;
}

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'starred'
  | 'archive'
  | 'budgeting'
  | 'saving'
  | 'credit'
  | 'expense'
  | 'income';

export interface NotificationParams {
  page?: number;
  per_page?: number;
  filter?: NotificationFilter;
}
