"use client";

import React, { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const colors = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

export default function CategoryPieChart() {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/transactions");
      const transactions: Transaction[] = await response.json();

      console.log("Fetched transactions:", transactions);

      // Check if transactions is an array
      if (!Array.isArray(transactions)) {
        console.error("Transactions is not an array:", transactions);
        setData([]);
        return;
      }

      // Group by category
      const categoryData = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      }, {} as Record<string, number>);

      console.log("Category data:", categoryData);

      const total = Object.values(categoryData).reduce(
        (sum, amount) => sum + amount,
        0
      );

      console.log("Total amount:", total);

      const chartData: CategoryData[] = Object.entries(categoryData)
        .map(([category, amount], index) => ({
          category,
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0,
          color: colors[index % colors.length],
        }))
        .sort((a, b) => b.amount - a.amount);

      console.log("Chart data:", chartData);
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
        No expense data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pie Chart Visualization */}
      <div className="relative w-48 h-48 mx-auto">
        <svg
          width="192"
          height="192"
          viewBox="0 0 192 192"
          className="transform -rotate-90"
        >
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
          />

          {data.map((item, index) => {
            const previousItems = data.slice(0, index);
            const previousTotal = previousItems.reduce(
              (sum, d) => sum + d.percentage,
              0
            );
            const startAngle = (previousTotal / 100) * 360;
            const endAngle = ((previousTotal + item.percentage) / 100) * 360;

            const startRadians = (startAngle * Math.PI) / 180;
            const endRadians = (endAngle * Math.PI) / 180;

            const x1 = 96 + 80 * Math.cos(startRadians);
            const y1 = 96 + 80 * Math.sin(startRadians);
            const x2 = 96 + 80 * Math.cos(endRadians);
            const y2 = 96 + 80 * Math.sin(endRadians);

            const largeArcFlag = item.percentage > 50 ? 1 : 0;

            const pathData = [
              `M ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "L 96 96",
              "Z",
            ].join(" ");

            return (
              <path
                key={item.category}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{data.length}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium">{item.category}</span>
            </div>
            <div className="text-right">
              <div className="font-medium">${item.amount.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
