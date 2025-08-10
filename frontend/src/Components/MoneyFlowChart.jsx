import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTransactions } from "./TransactionContext";

export default function MoneyFlowChart() {
  const { transactions } = useTransactions();

  // ✅ Compute chart data only when transactions change
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Normalize date and sort
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Extract unique days
    const uniqueDays = new Set(sorted.map(tx => tx.date));
    const groupByDay = uniqueDays.size <= 7; // ✅ Adaptive grouping

    const dataMap = new Map();

    for (let tx of sorted) {
      const date = new Date(tx.date);
      const key = groupByDay
        ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) // e.g., "Aug 4"
        : date.toLocaleDateString("en-US", { month: "short" }); // e.g., "Aug"

      if (!dataMap.has(key)) {
        dataMap.set(key, { name: key, income: 0, expense: 0 });
      }
      const item = dataMap.get(key);
      if (tx.type === "income") {
        item.income += tx.amount;
      } else {
        item.expense += tx.amount;
      }
    }

    return Array.from(dataMap.values());
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        No data available for chart
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Money Flow
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} barGap={6}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#6b7280" }} // Gray-500
          />
          <YAxis
            tick={{ fill: "#6b7280" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              borderColor: "#e5e7eb",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            labelStyle={{ color: "#374151", fontWeight: "bold" }} // Gray-700
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          
          <Bar
            dataKey="expense"
            name="Expense"
            fill="#71717a" // Zinc-500
            radius={[6, 6, 0, 0]}
          />
            <Bar
            dataKey="income"
            name="Income"
            fill="#4f46e5" // Indigo-600
            radius={[6, 6, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
