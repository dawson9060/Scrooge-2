export interface User {
    id: string;
    full_name: string;
    avatar_url: string;
    email: string;
    job_title: string;
    logo: string;
    monthly_budget: number,
};

export interface RecurringExpense {
    id: number,
    user_id: string,
    created_at: string,
    type: string,
    amount: number,
    expense_name: string,
    day: string,
}

export interface UniqueExpense {
    id: number,
    user_id: string,
    created_at: string,
    amount: number,
    expense_name: string,
    type: string,
};

export interface Reminder {
    id: number,
    user_id: string,
    created_at: string,
    date: string,
    name: string,
    date_timestamp: number,
}