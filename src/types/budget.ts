export interface Budget {
  _id: string;
  category: string;
  amount: number;
  period: "monthly" | "yearly";
  startDate: Date | string;
  endDate?: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateBudgetRequest {
  category: string;
  amount: number;
  period?: "monthly" | "yearly";
  startDate?: Date | string;
  endDate?: Date | string;
  isActive?: boolean;
}

export interface UpdateBudgetRequest {
  id: string;
  category?: string;
  amount?: number;
  period?: "monthly" | "yearly";
  startDate?: Date | string;
  endDate?: Date | string;
  isActive?: boolean;
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
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overBudgetCategories: number;
  underBudgetCategories: number;
  averageUtilization: number;
}

export interface BudgetPeriod {
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}
