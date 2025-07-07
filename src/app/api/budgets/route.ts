import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Budget from "@/lib/models/Budget";

const ALLOWED_CATEGORIES = [
  "Food",
  "Rent",
  "Utilities",
  "Entertainment",
  "Transport",
  "Health",
  "Other",
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    let query = {};
    if (month) {
      query = { month };
    }

    const budgets = await Budget.find(query).sort({ category: 1 });
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    if (!body.category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!body.month) {
      return NextResponse.json({ error: "Month is required" }, { status: 400 });
    }

    // Validate month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(body.month)) {
      return NextResponse.json(
        { error: "Month must be in YYYY-MM format" },
        { status: 400 }
      );
    }

    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      category: body.category,
      month: body.month,
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: "Budget already exists for this category and month" },
        { status: 409 }
      );
    }

    const budget = new Budget(body);
    const savedBudget = await budget.save();
    return NextResponse.json(savedBudget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      {
        error: "Failed to create budget",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;

    // Validate category if provided
    if (
      updateData.category &&
      !ALLOWED_CATEGORIES.includes(updateData.category)
    ) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Validate month format if provided
    if (updateData.month && !/^\d{4}-\d{2}$/.test(updateData.month)) {
      return NextResponse.json(
        { error: "Month must be in YYYY-MM format" },
        { status: 400 }
      );
    }

    const budget = await Budget.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }

    const budget = await Budget.findByIdAndDelete(id);

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
