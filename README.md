# Finance Visualizer

A modern web application for tracking personal finances with beautiful visualizations and insights.

## Features

- 📊 **Dashboard**: Summary cards and interactive charts
- 💰 **Transaction Management**: Add, edit, and delete transactions
- 📈 **Visual Analytics**: Monthly bar charts, category pie charts, and budget comparisons
- 🎯 **Budget Tracking**: Set and monitor category budgets
- 🔍 **Search & Filter**: Find transactions quickly with advanced filtering

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Charts**: Custom SVG-based visualizations
- **Icons**: Lucide React

## Project Structure

```
finance-visualizer/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Dashboard page with charts
│   │   ├── transactions/       # Transaction management page
│   │   ├── api/
│   │   │   ├── transactions/   # Transaction CRUD API
│   │   │   └── budgets/        # Budget CRUD API
│   │   ├── layout.tsx          # Root layout with navigation
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Charts/             # Chart components
│   │   │   ├── MonthlyBarChart.tsx
│   │   │   ├── CategoryPieChart.tsx
│   │   │   └── BudgetComparisonChart.tsx
│   │   ├── TransactionForm.tsx # Transaction form component
│   │   ├── TransactionList.tsx # Transaction list component
│   │   └── Navigation.tsx      # Main navigation
│   ├── lib/
│   │   ├── db.ts              # MongoDB connection
│   │   └── models/
│   │       ├── Transaction.ts  # Transaction model
│   │       └── Budget.ts       # Budget model
│   └── types/
│       ├── transaction.ts      # Transaction type definitions
│       └── budget.ts           # Budget type definitions
├── public/
│   └── images/                 # Static images
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd finance-visualizer
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/finance-visualizer
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-visualizer
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions` - Update a transaction
- `DELETE /api/transactions?id=<id>` - Delete a transaction

### Budgets

- `GET /api/budgets` - Get all active budgets
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets` - Update a budget
- `DELETE /api/budgets?id=<id>` - Delete a budget

## Data Models

### Transaction

```typescript
{
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Budget

```typescript
{
  _id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Features in Detail

### Dashboard

- Summary cards showing total income, expenses, net savings, and budget status
- Monthly bar chart comparing income vs expenses
- Category pie chart showing expense distribution
- Budget comparison chart tracking actual vs planned spending

### Transaction Management

- Add new transactions with title, amount, type, category, and date
- Edit existing transactions inline
- Delete transactions with confirmation
- Search and filter by type, category, and date range
- Responsive design for mobile and desktop

### Charts

- **Monthly Bar Chart**: Shows income and expenses by month with net calculations
- **Category Pie Chart**: Displays expense distribution with percentages and amounts
- **Budget Comparison**: Compares actual spending against budgeted amounts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
