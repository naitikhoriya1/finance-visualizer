export type TransactionCategory =
  | "Food"
  | "Rent"
  | "Utilities"
  | "Entertainment"
  | "Transport"
  | "Health"
  | "Other";

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  "Food",
  "Rent",
  "Utilities",
  "Entertainment",
  "Transport",
  "Health",
  "Other",
];

export interface Transaction {
  _id: string;
  amount: number;
  date: Date | string;
  description?: string;
  category: TransactionCategory;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateTransactionRequest {
  amount: number;
  date: Date | string;
  description?: string;
  category: TransactionCategory;
}

export interface UpdateTransactionRequest {
  id: string;
  amount?: number;
  date?: Date | string;
  description?: string;
  category?: TransactionCategory;
}

export interface TransactionFilters {
  search?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionStats {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
}

export interface MonthlyStats {
  month: string;
  amount: number;
  transactionCount: number;
}
