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

