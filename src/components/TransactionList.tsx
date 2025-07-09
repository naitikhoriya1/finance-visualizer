"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/types/transaction";
import TransactionForm from "./TransactionForm";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
  });
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleEdit = async (transactionData: Partial<Transaction>) => {
    if (!editingTransaction) return;

    try {
      const response = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTransaction._id,
          ...transactionData,
        }),
      });

      if (response.ok) {
        const updatedTransaction = await response.json();
        setTransactions((prev) =>
          prev.map((t) =>
            t._id === editingTransaction._id ? updatedTransaction : t
          )
        );
        setEditingTransaction(null);
      }
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        ?.toLowerCase()
        .includes(filter.search.toLowerCase()) || false;
    return matchesSearch;
  });

  if (loading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search Filter */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by description..."
          value={filter.search}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, search: e.target.value }))
          }
          className="flex-1"
        />
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card
              key={transaction._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-blue-600">
                        ${transaction.amount.toFixed(2)}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {transaction.category}
                      </Badge>
                    </div>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {transaction.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(transaction._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <Dialog
          open={!!editingTransaction}
          onOpenChange={(open) => {
            if (!open) setEditingTransaction(null);
          }}
        >
          <DialogContent
            showCloseButton={true}
            className="fixed bottom-0 left-0 right-0 top-auto mx-auto w-full max-w-md rounded-t-2xl p-6 animate-slideUp z-50 border-none shadow-2xl bg-background"
            style={{
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
              paddingBottom: "env(safe-area-inset-bottom, 1.5rem)",
            }}
          >
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={handleEdit}
              onCancel={() => setEditingTransaction(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
