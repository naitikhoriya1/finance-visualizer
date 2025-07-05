"use client";

import React, { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";

interface ChartData {
  month: string;
  income: number;
  expenses: number;
}

export default function MonthlyBarChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/transactions");
      const transactions: Transaction[] = await response.json();

      // Group transactions by month
      const monthlyData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        const monthName = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthName, income: 0, expenses: 0 };
        }

        if (transaction.type === "income") {
          acc[monthKey].income += transaction.amount;
        } else {
          acc[monthKey].expenses += transaction.amount;
        }

        return acc;
      }, {} as Record<string, ChartData>);

      // Convert to array and sort by month
      const chartData = Object.values(monthlyData).sort((a, b) => {
        const [aMonth, aYear] = a.month.split(" ");
        const [bMonth, bYear] = b.month.split(" ");
        return (
          new Date(`${aMonth} 1, ${aYear}`).getTime() -
          new Date(`${bMonth} 1, ${bYear}`).getTime()
        );
      });

      setData(chartData);
    } catch (error) {
      console.error("Failed to fetch data for chart:", error);
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
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => Math.max(d.income, d.expenses)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Expenses</span>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.month}</span>
              <span className="text-muted-foreground">
                Net: ${(item.income - item.expenses).toFixed(2)}
              </span>
            </div>

            <div className="flex gap-1 h-6">
              {/* Income bar */}
              <div
                className="bg-green-500 rounded-l transition-all duration-300"
                style={{
                  width: `${(item.income / maxValue) * 100}%`,
                  minWidth: item.income > 0 ? "4px" : "0",
                }}
                title={`Income: $${item.income.toFixed(2)}`}
              />

              {/* Expenses bar */}
              <div
                className="bg-red-500 rounded-r transition-all duration-300"
                style={{
                  width: `${(item.expenses / maxValue) * 100}%`,
                  minWidth: item.expenses > 0 ? "4px" : "0",
                }}
                title={`Expenses: $${item.expenses.toFixed(2)}`}
              />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Income: ${item.income.toFixed(2)}</span>
              <span>Expenses: ${item.expenses.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
