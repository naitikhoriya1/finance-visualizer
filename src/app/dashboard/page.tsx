"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MonthlyBarChart from "@/components/Charts/MonthlyBarChart";
import CategoryPieChart from "@/components/Charts/CategoryPieChart";
import { Transaction } from "@/types/transaction";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        setTransactions([]);
        console.error("API did not return an array:", data);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total monthly expenses
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });
  const totalMonthlyExpenses = monthlyTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  // Most recent transactions (sorted by date desc)
  const mostRecent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Transaction Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? "-" : `$${totalMonthlyExpenses.toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "-" : monthlyTransactions.length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {loading || monthlyTransactions.length === 0
                ? "-"
                : `$${(
                    totalMonthlyExpenses / monthlyTransactions.length
                  ).toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Transaction Amounts</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyBarChart />
        </CardContent>
      </Card>

      {/* Category Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryPieChart />
        </CardContent>
      </Card>

      {/* Most Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Most Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : mostRecent.length === 0 ? (
            <div className="text-muted-foreground">No transactions found</div>
          ) : (
            <ul className="divide-y">
              {mostRecent.map((t) => (
                <li
                  key={t._id}
                  className="py-2 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold">
                      ${t.amount.toFixed(2)}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {t.category}
                    </Badge>
                    {t.description && (
                      <span className="ml-2 text-muted-foreground text-sm">
                        {t.description}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(t.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
