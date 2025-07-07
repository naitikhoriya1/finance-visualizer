"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Budget, TransactionCategory } from "@/types/budget";
import { TRANSACTION_CATEGORIES } from "@/types/transaction";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface BudgetFormProps {
  budget?: Budget;
  onSubmit?: (budget: Partial<Budget>) => void;
  onCancel?: () => void;
}

export default function BudgetForm({
  budget,
  onSubmit,
  onCancel,
}: BudgetFormProps) {
  const [formData, setFormData] = useState({
    amount: budget?.amount || "",
    category: (budget?.category as TransactionCategory) || "Food",
    month: budget?.month || new Date().toISOString().slice(0, 7), // YYYY-MM format
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.month) {
      newErrors.month = "Month is required";
    }

    // Validate month format (YYYY-MM)
    if (formData.month && !/^\d{4}-\d{2}$/.test(formData.month)) {
      newErrors.month = "Month must be in YYYY-MM format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const budgetData = {
      amount: parseFloat(formData.amount),
      category: formData.category as TransactionCategory,
      month: formData.month,
    };

    try {
      await onSubmit?.(budgetData);
      setSubmitMessage({
        type: "success",
        text: "Budget set successfully!",
      });
      // Reset form
      setFormData({
        amount: "",
        category: "Food",
        month: new Date().toISOString().slice(0, 7),
      });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Failed to set budget. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleInputChange("category", value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Monthly Budget Amount</Label>
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
        <Label htmlFor="month">Month</Label>
        <Input
          id="month"
          type="month"
          value={formData.month}
          onChange={(e) => handleInputChange("month", e.target.value)}
          className={errors.month ? "border-red-500" : ""}
        />
        {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
      </div>

      {submitMessage && (
        <div
          className={`p-3 rounded-md ${
            submitMessage.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting
            ? "Setting..."
            : budget
            ? "Update Budget"
            : "Set Budget"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
