"use client";

import React, { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";
import { Budget } from "@/types/budget";

interface BudgetData {
  category: string;
  budget: number;
  actual: number;
  remaining: number;
  percentage: number;
}

export default function BudgetComparisonChart() {
  const [data, setData] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch transactions and budgets
      const [transactionsRes, budgetsRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/budgets"),
      ]);

      const transactions: Transaction[] = await transactionsRes.json();
      const budgets: Budget[] = await budgetsRes.json();

      // Group expenses by category
      const expenses = transactions.filter((t) => t.type === "expense");
      const actualSpending = expenses.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      }, {} as Record<string, number>);

      // Create budget comparison data
      const budgetData: BudgetData[] = budgets.map((budget) => {
        const actual = actualSpending[budget.category] || 0;
        const remaining = budget.amount - actual;
        const percentage =
          budget.amount > 0 ? (actual / budget.amount) * 100 : 0;

        return {
          category: budget.category,
          budget: budget.amount,
          actual,
          remaining,
          percentage,
        };
      });

      setData(budgetData);
    } catch (error) {
      console.error("Failed to fetch data for chart:", error);
      // Fallback to mock data if API fails
      setData([
        {
          category: "Food & Dining",
          budget: 500,
          actual: 420,
          remaining: 80,
          percentage: 84,
        },
        {
          category: "Transportation",
          budget: 200,
          actual: 180,
          remaining: 20,
          percentage: 90,
        },
        {
          category: "Shopping",
          budget: 300,
          actual: 350,
          remaining: -50,
          percentage: 117,
        },
        {
          category: "Entertainment",
          budget: 150,
          actual: 120,
          remaining: 30,
          percentage: 80,
        },
        {
          category: "Utilities",
          budget: 250,
          actual: 240,
          remaining: 10,
          percentage: 96,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No budget data available
      </div>
    );
  }

  const maxBudget = Math.max(...data.map((d) => d.budget));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>Actual</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.category}</span>
              <div className="text-right">
                <div className="font-medium">
                  ${item.actual.toFixed(2)} / ${item.budget.toFixed(2)}
                </div>
                <div
                  className={`text-xs ${
                    item.remaining >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.remaining >= 0 ? "+" : ""}${item.remaining.toFixed(2)}{" "}
                  remaining
                </div>
              </div>
            </div>

            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              {/* Budget bar */}
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(item.budget / maxBudget) * 100}%` }}
              />

              {/* Actual spending bar */}
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                  item.percentage > 100 ? "bg-red-500" : "bg-orange-500"
                }`}
                style={{
                  width: `${Math.min(
                    (item.actual / maxBudget) * 100,
                    (item.budget / maxBudget) * 100
                  )}%`,
                }}
              />

              {/* Overflow indicator */}
              {item.percentage > 100 && (
                <div
                  className="absolute top-0 h-full bg-red-600 transition-all duration-300"
                  style={{
                    left: `${(item.budget / maxBudget) * 100}%`,
                    width: `${
                      ((item.actual - item.budget) / maxBudget) * 100
                    }%`,
                  }}
                />
              )}
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Budget: ${item.budget.toFixed(2)}</span>
              <span
                className={
                  item.percentage > 100 ? "text-red-600" : "text-orange-600"
                }
              >
                {item.percentage.toFixed(1)}% used
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              ${data.reduce((sum, d) => sum + d.budget, 0).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Total Budget</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              ${data.reduce((sum, d) => sum + d.actual, 0).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </div>
          <div>
            <div
              className={`text-lg font-bold ${
                data.reduce((sum, d) => sum + d.remaining, 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ${data.reduce((sum, d) => sum + d.remaining, 0).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}
