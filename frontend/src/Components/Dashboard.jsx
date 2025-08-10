import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import StatCard from "./StatCard";
import MoneyFlowChart from "./MoneyFlowChart";
import BudgetDonut from "./BudgetDonut";
import SavingsGoals from "./SavingsGoals";
import { Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";
import { getDashboardSummary, getTransactions } from "../api";
import { parseServerError } from "../utils/errors";

function normalizeTxn(apiTxn) {
  // backend returns ISO `timestamp`
  const iso = apiTxn.timestamp || apiTxn.date || apiTxn.createdAt;
  const day = iso ? new Date(iso).toISOString().slice(0, 10) : "";
  return {
    id: apiTxn.id,
    type: apiTxn.type,
    description: apiTxn.description || "",
    category: apiTxn.category ?? "",
    amount: Number(apiTxn.amount),
    date: day,
    _ts: iso ? new Date(iso).getTime() : 0, // for sorting/filtering
  };
}

export default function Dashboard() {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    savings_rate: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // Axios instance already includes Authorization header
        const [sumRes, txRes] = await Promise.all([
          getDashboardSummary(),
          getTransactions(),
        ]);

        if (!mounted) return;

        const inc = Number(sumRes.data?.income || 0);
        const exp = Number(sumRes.data?.expenses || 0);
        const bal = Number(sumRes.data?.balance || inc - exp);
        const savingsRate =
          inc > 0 ? Number((((inc - exp) / inc) * 100).toFixed(1)) : 0;

        setSummary({
          income: inc,
          expenses: exp,
          balance: bal,
          savings_rate:
            sumRes.data?.savings_rate != null
              ? Number(sumRes.data.savings_rate)
              : savingsRate,
        });

        const list = Array.isArray(txRes.data)
          ? txRes.data.map(normalizeTxn)
          : [];
        const nowMs = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

        const recent = list
          .filter((t) => t._ts && nowMs - t._ts <= sevenDaysMs)
          .sort((a, b) => b._ts - a._ts)
          .slice(0, 10);

        setRecentTransactions(recent);
      } catch (e) {
        if (!mounted) return;
        setErr(parseServerError(e) || "Failed to load dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Total Balance",
        value: `₵${summary.balance.toLocaleString()}`,
        trend: summary.balance >= 0 ? "up" : "down",
        icon: Wallet,
        gradient: "from-blue-500 to-purple-600",
      },
      {
        title: "Total Income",
        value: `₵${summary.income.toLocaleString()}`,
        trend: "up",
        icon: TrendingUp,
        gradient: "from-green-500 to-emerald-600",
      },
      {
        title: "Total Expenses",
        value: `₵${summary.expenses.toLocaleString()}`,
        trend: "down",
        icon: TrendingDown,
        gradient: "from-red-500 to-pink-600",
      },
      {
        title: "Savings Rate",
        value: `${summary.savings_rate}%`,
        trend: "up",
        icon: Target,
        gradient: "from-orange-500 to-yellow-600",
      },
    ],
    [summary]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Header />

          {err && (
            <div className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl p-3">
              {err}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                label={stat.title}
                value={stat.value}
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
                Expenses vs Income
              </h3>
              <MoneyFlowChart />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
              <BudgetDonut />
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
                  recentTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            t.type === "income"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {t.type === "income" ? (
                            <TrendingUp className="w-6 h-6" />
                          ) : (
                            <TrendingDown className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {t.description || t.category || "Transaction"}
                          </p>
                          <p className="text-sm text-gray-500">{t.date}</p>
                        </div>
                      </div>
                      <div
                        className={`font-bold ${
                          t.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}₵{t.amount}
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
