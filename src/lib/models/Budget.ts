import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  category: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Rent",
        "Utilities",
        "Entertainment",
        "Transport",
        "Health",
        "Other",
      ],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique budget per category per month
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

// Virtual for formatted amount
BudgetSchema.virtual("formattedAmount").get(function () {
  return `$${this.amount.toFixed(2)}`;
});

// Ensure virtuals are serialized
BudgetSchema.set("toJSON", { virtuals: true });
BudgetSchema.set("toObject", { virtuals: true });

export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema);
