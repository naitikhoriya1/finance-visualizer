import { TransactionCategory } from "./transaction";

export interface Budget {
  _id: string;
  category: TransactionCategory;
  amount: number;
  month: string; // Format: "YYYY-MM"
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateBudgetRequest {
  category: TransactionCategory;
  amount: number;
  month: string;
}

export interface UpdateBudgetRequest {
  id: string;
  category?: TransactionCategory;
  amount?: number;
  month?: string;
}

export interface BudgetComparison {
  category: string;
  budget: number;
  actual: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

export interface BudgetStats {
  category: TransactionCategory;
  budget: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}

export interface BudgetPeriod {
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}
