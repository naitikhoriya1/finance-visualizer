export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date | string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateTransactionRequest {
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date | string;
  description?: string;
}

export interface UpdateTransactionRequest {
  id: string;
  title?: string;
  amount?: number;
  type?: "income" | "expense";
  category?: string;
  date?: Date | string;
  description?: string;
}

export interface TransactionFilters {
  search?: string;
  type?: "income" | "expense" | "all";
  category?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  averageAmount: number;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  netAmount: number;
  transactionCount: number;
}

export interface CategoryStats {
  category: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}
