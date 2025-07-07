const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/finance-visualizer");

// Define Transaction schema
const TransactionSchema = new mongoose.Schema(
  {
    amount: Number,
    date: Date,
    description: String,
    category: {
      type: String,
      default: "Other",
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
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

async function updateTransactions() {
  try {
    // Find all transactions without category
    const transactions = await Transaction.find({
      category: { $exists: false },
    });
    console.log(`Found ${transactions.length} transactions without category`);

    if (transactions.length > 0) {
      // Update all transactions to have 'Other' category
      const result = await Transaction.updateMany(
        { category: { $exists: false } },
        { $set: { category: "Other" } }
      );
      console.log(`Updated ${result.modifiedCount} transactions`);
    }

    // Verify the update
    const allTransactions = await Transaction.find({});
    console.log(`Total transactions: ${allTransactions.length}`);
    allTransactions.forEach((t) => {
      console.log(`ID: ${t._id}, Amount: ${t.amount}, Category: ${t.category}`);
    });
  } catch (error) {
    console.error("Error updating transactions:", error);
  } finally {
    mongoose.connection.close();
  }
}

updateTransactions();
