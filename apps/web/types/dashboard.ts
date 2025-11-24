export type DashboardSummary = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  changePercentage: number;
  topCategories: {
    category: string;
    total: number;
    percentage: number;
  }[];
  recurringPayments: {
    id: string;
    description: string;
    amount: number;
    nextDate: string;
    category: string;
  }[];
};

export type TransactionSuggestion = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  detectedCategory?: string;
  confidence: number;
  createdAt: string;
};

