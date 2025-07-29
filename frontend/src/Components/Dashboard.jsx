import React, { useState, useEffect } from "react";
import Header from './Header';
import StatCard from './StatCard';
import MoneyFlowChart from './MoneyFlowChart';
import BudgetDonut from './BudgetDonut';
import TransactionsTable from './TransactionsTable';
import SavingsGoals from './SavingsGoals';
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savings_rate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/summary", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setStats(res.data);
      } catch (err) {
        // Optionally, handle error
        console.error("Error fetching dashboard summary:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 p-8">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard label="Total Balance" value={loading ? "Loading..." : `₵${stats.balance.toLocaleString()}`} />
          <StatCard label="Total Income" value={loading ? "Loading..." : `₵${stats.income.toLocaleString()}`} />
          <StatCard label="Total Expenses" value={loading ? "Loading..." : `₵${stats.expenses.toLocaleString()}`} />
          <StatCard label="Savings Rate" value={loading ? "Loading..." : `${stats.savings_rate?.toFixed(1) ?? 0}%`} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MoneyFlowChart />
            <TransactionsTable />
          </div>
          <div className="space-y-6">
            <BudgetDonut />
            <SavingsGoals />
          </div>
        </div>
      </main>
    </div>
  );
}
