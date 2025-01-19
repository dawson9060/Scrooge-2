export interface User {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  monthly_budget: number;
}

export interface RecurringExpense {
  id: number;
  user_id: string;
  created_at: string;
  type: string;
  amount: number | null;
  expense_name: string;
  day: string | null;
}

export interface UniqueExpense {
  id: number;
  user_id: string;
  created_at: string;
  amount: number;
  expense_name: string;
  type: string;
}

export interface Reminder {
  id: number;
  user_id: string;
  created_at: string;
  date: string;
  name: string;
  date_timestamp: number;
}
