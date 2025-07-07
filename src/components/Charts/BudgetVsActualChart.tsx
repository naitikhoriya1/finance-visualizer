"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/types/transaction";
import { Budget } from "@/types/budget";

interface BudgetVsActualData {
  category: string;
  budget: number;
  actual: number;
  difference: number;
  percentageUsed: number;
}

export default function BudgetVsActualChart() {
  const [data, setData] = useState<BudgetVsActualData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
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

      // Create chart data
      const chartData: BudgetVsActualData[] = budgets.map((budget) => {
        const actual = actualByCategory[budget.category] || 0;
        const difference = budget.amount - actual;
        const percentageUsed =
          budget.amount > 0 ? (actual / budget.amount) * 100 : 0;

        return {
          category: budget.category,
          budget: budget.amount,
          actual,
          difference,
          percentageUsed,
        };
      });

      // Add categories that have spending but no budget
      Object.keys(actualByCategory).forEach((category) => {
        const hasBudget = budgets.some((b) => b.category === category);
        if (!hasBudget) {
          chartData.push({
            category,
            budget: 0,
            actual: actualByCategory[category],
            difference: -actualByCategory[category],
            percentageUsed: 0,
          });
        }
      });

      setData(chartData);
    } catch (error) {
      console.error("Failed to fetch data for chart:", error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budget = payload[0]?.value || 0;
      const actual = payload[1]?.value || 0;
      const difference = budget - actual;
      const percentageUsed = budget > 0 ? (actual / budget) * 100 : 0;

      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">Budget: ${budget.toFixed(2)}</p>
          <p className="text-green-600">Actual: ${actual.toFixed(2)}</p>
          <p
            className={`${difference >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            Difference: ${Math.abs(difference).toFixed(2)}{" "}
            {difference >= 0 ? "saved" : "over"}
          </p>
          {budget > 0 && (
            <p
              className={`${
                percentageUsed <= 100 ? "text-green-600" : "text-red-600"
              }`}
            >
              Used: {percentageUsed.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
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
        No budget data available for this month
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="chart-month" className="text-sm font-medium">
          Select Month:
        </label>
        <input
          id="chart-month"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="budget"
            fill="#3B82F6"
            name="Budget"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="actual"
            fill="#10B981"
            name="Actual"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Budget</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${data.reduce((sum, item) => sum + item.budget, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Total Spent</h3>
          <p className="text-2xl font-bold text-green-600">
            ${data.reduce((sum, item) => sum + item.actual, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Net Difference</h3>
          <p
            className={`text-2xl font-bold ${
              data.reduce((sum, item) => sum + item.difference, 0) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            $
            {Math.abs(
              data.reduce((sum, item) => sum + item.difference, 0)
            ).toFixed(2)}
            {data.reduce((sum, item) => sum + item.difference, 0) >= 0
              ? " saved"
              : " over"}
          </p>
        </div>
      </div>
    </div>
  );
}
