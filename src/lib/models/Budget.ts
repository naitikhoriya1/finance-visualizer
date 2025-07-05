import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  category: string;
  amount: number;
  period: "monthly" | "yearly";
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    period: {
      type: String,
      required: [true, "Period is required"],
      enum: {
        values: ["monthly", "yearly"],
        message: "Period must be either monthly or yearly",
      },
      default: "monthly",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (this: IBudget, value: Date) {
          return !value || value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
BudgetSchema.index({ category: 1 });
BudgetSchema.index({ isActive: 1 });
BudgetSchema.index({ startDate: 1, endDate: 1 });

// Virtual for formatted amount
BudgetSchema.virtual("formattedAmount").get(function () {
  return `$${this.amount.toFixed(2)}`;
});

// Virtual for remaining days (if endDate is set)
BudgetSchema.virtual("remainingDays").get(function () {
  if (!this.endDate) return null;
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Ensure virtuals are serialized
BudgetSchema.set("toJSON", { virtuals: true });
BudgetSchema.set("toObject", { virtuals: true });

export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema);
