import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#16a34a', '#fbbf24', '#6366f1', '#f87171', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

export default function BudgetDonut({ budgetData = { categories: [] } }) {
  const chartData = budgetData.categories
    .filter(category => category.budget > 0) // Only show categories with budget
    .map(category => ({
      name: category.name,
      value: category.budget
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center justify-center min-h-[340px]">
        <h2 className="text-lg font-semibold mb-3 text-center dark:text-gray-100">
          Budget Breakdown
        </h2>
        <p className="text-gray-500 dark:text-gray-400">No budget data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center min-h-[340px]">
      <h2 className="text-lg font-semibold mb-3 text-center dark:text-gray-100">
        Budget Breakdown
      </h2>
      <PieChart width={180} height={180}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          dataKey="value"
          labelLine={false}
        >
          {chartData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <div className="mt-5 flex flex-col items-center space-y-1">
        {chartData.map((entry, idx) => (
          <div key={entry.name} className="flex items-center text-sm">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="font-medium mr-1 text-gray-800 dark:text-gray-100">
              {entry.name}
            </span>
            <span className="text-gray-500 dark:text-gray-300">
              ₵{entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}