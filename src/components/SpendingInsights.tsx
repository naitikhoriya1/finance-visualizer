"use client";

import React, { useEffect, useState } from "react";
import { Budget } from "@/types/budget";
import { Transaction } from "@/types/transaction";

interface Insight {
  category: string;
  status: "over" | "ontrack";
  difference: number;
  budget: number;
  actual: number;
}

export default function SpendingInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    fetchInsights();
  }, [selectedMonth]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // Fetch budgets for the selected month
      const budgetsResponse = await fetch(
        `/api/budgets?month=${selectedMonth}`
      );
      const budgets: Budget[] = await budgetsResponse.json();

      // Fetch transactions for the selected month
      const transactionsResponse = await fetch("/api/transactions");
      const transactions: Transaction[] = await transactionsResponse.json();

      // Filter transactions for the selected month
      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        const transactionMonth = transactionDate.toISOString().slice(0, 7);
        return transactionMonth === selectedMonth;
      });

      // Calculate actual spending by category
      const actualByCategory = monthTransactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      }, {} as Record<string, number>);

      // Generate insights
      const insights: Insight[] = budgets.map((budget) => {
        const actual = actualByCategory[budget.category] || 0;
        const difference = actual - budget.amount;
        return {
          category: budget.category,
          status: actual > budget.amount ? "over" : "ontrack",
          difference: Math.abs(difference),
          budget: budget.amount,
          actual,
        };
      });

      setInsights(insights);
    } catch (error) {
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-4 mb-2">
        <label htmlFor="insights-month" className="text-sm font-medium">
          Insights for:
        </label>
        <input
          id="insights-month"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
      </div>
      {loading ? (
        <div>Loading insights...</div>
      ) : insights.length === 0 ? (
        <div className="text-muted-foreground">
          No budgets set for this month.
        </div>
      ) : (
        <ul className="space-y-1">
          {insights.map((insight) => (
            <li key={insight.category}>
              {insight.status === "over" ? (
                <span className="text-red-600 font-medium">
                  You&apos;ve exceeded your budget in {insight.category} by ₹
                  {insight.difference.toLocaleString()}
                </span>
              ) : (
                <span className="text-green-700 font-medium">
                  You&apos;re on track in {insight.category}
                  {insight.budget - insight.actual > 0 && (
                    <>
                      {" "}
                      (₹{(
                        insight.budget - insight.actual
                      ).toLocaleString()}{" "}
                      left)
                    </>
                  )}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
