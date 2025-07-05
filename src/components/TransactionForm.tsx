"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Transaction } from "@/types/transaction";

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit?: (transaction: Partial<Transaction>) => void;
  onCancel?: () => void;
}

export default function TransactionForm({
  transaction,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: transaction?.amount || "",
    date: transaction?.date
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    description: transaction?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transactionData = {
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
      description: formData.description || undefined,
    };

    onSubmit?.(transactionData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => handleInputChange("amount", e.target.value)}
          placeholder="0.00"
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          className={errors.date ? "border-red-500" : ""}
        />
        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Add any additional details..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {transaction ? "Update Transaction" : "Add Transaction"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
