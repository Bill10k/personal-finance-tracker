import Header from './Header';
import StatCard from './StatCard';
import MoneyFlowChart from './MoneyFlowChart';
import BudgetDonut from './BudgetDonut';
import SavingsGoals from './SavingsGoals';
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useTransactions } from "./TransactionContext";
import { useBudget } from './BudgetContext';

export default function Dashboard() {
  const { budgetData } = useBudget();
  const { transactions } = useTransactions();
  const now = new Date();

  // ✅ Compute stats from transactions
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalBalance = totalIncome - totalExpenses;

  const savingsRate = totalIncome > 0
    ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)
    : 0;

  const recentTransactions = transactions
    .filter((tx) => {
      const txDate = new Date(tx.createdAt || tx.date);
      const diffDays = (now - txDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    })
    .slice(0, 10);

  const stats = [
    {
      title: 'Total Balance',
      value: `₵${totalBalance.toLocaleString()}`,
      change: '', // TODO: calculate % change later
      trend: totalBalance >= 0 ? 'up' : 'down',
      icon: Wallet,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Total Income',
      value: `₵${totalIncome.toLocaleString()}`,
      change: '',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Expenses',
      value: `₵${totalExpenses.toLocaleString()}`,
      change: '',
      trend: 'down',
      icon: TrendingDown,
      gradient: 'from-red-500 to-pink-600'
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      change: '',
      trend: 'up',
      icon: Target,
      gradient: 'from-orange-500 to-yellow-600'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Header />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                label={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={stat.icon}
                gradient={stat.gradient}
              />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Income vs Expenses
              </h3>
              <MoneyFlowChart />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
              <BudgetDonut budgetData={budgetData} />
            </div>
          </div>

          {/* Recent Transactions + Savings Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Transactions
                </h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentTransactions.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No recent transactions
                  </p>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            transaction.type === 'income'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-6 h-6" />
                          ) : (
                            <TrendingDown className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description || transaction.category}
                          </p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div
                        className={`font-bold ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}₵
                        {transaction.amount}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Savings Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
              <SavingsGoals />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
