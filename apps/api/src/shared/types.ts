export type TransactionSource = "pdf" | "manual";
export type TransactionType = "income" | "expense";

export interface TransactionEntity {
  id: string;
  userId: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  source: TransactionSource;
  type: TransactionType;
  categoryId?: string;
  categoryLabel?: string;
  confidence?: number;
  createdAt: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  percentage: number;
}

export interface RecurringPayment {
  id: string;
  description: string;
  amount: number;
  nextDate: string;
  category: string;
}

export interface DashboardSummary {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  changePercentage: number;
  topCategories: CategorySummary[];
  recurringPayments: RecurringPayment[];
}

export interface TransactionSuggestion {
  id: string;
  description: string;
  amount: number;
  currency: string;
  detectedCategory?: string;
  confidence: number;
  createdAt: string;
}

