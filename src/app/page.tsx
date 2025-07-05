import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center py-12 space-y-6">
        <div className="text-6xl mb-4">📈</div>
        <h1 className="text-4xl font-bold tracking-tight">
          Finance Visualizer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track your finances with beautiful visualizations. Monitor income, expenses, 
          and budgets with intuitive charts and insights.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">
              View Dashboard
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="outline" size="lg">
              Manage Transactions
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
        <Card>
          <CardHeader>
            <div className="text-3xl mb-2">📊</div>
            <CardTitle>Visual Analytics</CardTitle>
            <CardDescription>
              Beautiful charts and graphs to understand your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Monthly income vs expenses</li>
              <li>• Category breakdown with pie charts</li>
              <li>• Budget comparison tracking</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-3xl mb-2">💰</div>
            <CardTitle>Transaction Management</CardTitle>
            <CardDescription>
              Easy-to-use interface for adding and managing your transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Add income and expenses</li>
              <li>• Categorize transactions</li>
              <li>• Search and filter options</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-3xl mb-2">🎯</div>
            <CardTitle>Budget Tracking</CardTitle>
            <CardDescription>
              Set budgets and track your progress against financial goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Set category budgets</li>
              <li>• Real-time budget monitoring</li>
              <li>• Over-budget alerts</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">$12,345</div>
            <div className="text-sm text-muted-foreground">Total Income</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">$8,234</div>
            <div className="text-sm text-muted-foreground">Total Expenses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">$4,111</div>
            <div className="text-sm text-muted-foreground">Net Savings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">82%</div>
            <div className="text-sm text-muted-foreground">Budget Used</div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6">
          Start tracking your finances today and gain better insights into your spending habits.
        </p>
        <Link href="/transactions">
          <Button size="lg">
            Add Your First Transaction
          </Button>
        </Link>
      </div>
    </div>
  );
}
