"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/types/transaction";

interface ChartData {
  month: string;
  amount: number;
  transactionCount: number;
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
          acc[monthKey] = { month: monthName, amount: 0, transactionCount: 0 };
        }

        acc[monthKey].amount += transaction.amount;
        acc[monthKey].transactionCount += 1;

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

  const formatTooltip = (value: number, name: string) => {
    if (name === "amount") {
      return [`$${value.toFixed(2)}`, "Total Amount"];
    }
    return [value, "Transactions"];
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={formatTooltip}
            labelStyle={{ color: "#374151" }}
          />
          <Bar
            dataKey="amount"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            name="Total Amount"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Monthly Transaction Amounts
      </div>
    </div>
  );
}
