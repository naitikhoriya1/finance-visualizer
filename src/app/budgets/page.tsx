"use client";

import React, { useState, useEffect } from "react";
import BudgetForm from "@/components/BudgetForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Budget } from "@/types/budget";
import { useRouter } from "next/navigation";

export default function BudgetsPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const router = useRouter();

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budgets?month=${selectedMonth}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setBudgets(data);
      } else {
        setBudgets([]);
        console.error("API did not return an array:", data);
      }
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (budgetData: Partial<Budget>) => {
    const response = await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    });

    if (response.ok) {
      setActiveTab("list");
      router.refresh();
      fetchBudgets();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add budget");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;

    try {
      const response = await fetch(`/api/budgets?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBudgets((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Monthly Budgets</h1>

      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="month" className="text-sm font-medium">
          Select Month:
        </label>
        <input
          id="month"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            ${totalBudget.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            Total budget for{" "}
            {new Date(selectedMonth + "-01").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Budget List</TabsTrigger>
          <TabsTrigger value="add">Set Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading budgets...</div>
              ) : budgets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No budgets set for this month
                  </p>
                  <Button onClick={() => setActiveTab("add")} className="mt-2">
                    Set Your First Budget
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {budgets.map((budget) => (
                    <Card
                      key={budget._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-green-600">
                                ${budget.amount.toFixed(2)}
                              </span>
                              <Badge variant="outline" className="ml-2">
                                {budget.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Monthly budget
                            </p>
                          </div>

                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(budget._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Set Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetForm onSubmit={handleAddBudget} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
