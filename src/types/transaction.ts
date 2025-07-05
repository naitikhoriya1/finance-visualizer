export interface Transaction {
  _id: string;
  amount: number;
  date: Date | string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateTransactionRequest {
  amount: number;
  date: Date | string;
  description?: string;
}

export interface UpdateTransactionRequest {
  id: string;
  amount?: number;
  date?: Date | string;
  description?: string;
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
