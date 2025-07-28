import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const stats = [
  { label: 'Total Balance', value: '₵2,255', sub: '+6.4% from income' },
  { label: 'Total Income', value: '₵3,500', sub: '0 transactions this month' },
  { label: 'Total Expenses', value: '₵1,245', sub: '0 transactions this month' },
  { label: 'Savings Rate', value: '64.4%', sub: '₵2,250 saved so far' },
];

const expensesByCategoryData = [
  { name: 'Rent', value: 96, color: '#EF4444' },  // red-500
  { name: 'Food', value: 4, color: '#FB923C' },   // orange-400
];

const budgetOverview = [
  { name: 'Food', spent: 245, budget: 500 },
  { name: 'Transportation', spent: 120, budget: 200 },
  { name: 'Entertainment', spent: 75, budget: 300 },
  { name: 'Rent', spent: 500, budget: 500 },
];

const recentTransactions = [
  { desc: 'Monthly Salary', date: '6/1/2024', amount: 3500, income: true },
  { desc: 'Grocery shopping', date: '6/3/2024', amount: 45, income: false },
  { desc: 'Monthly rent payment', date: '6/2/2024', amount: 1200, income: false },
];

export default function Dashboard() {
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={expensesByCategoryData[index].color}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${expensesByCategoryData[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-600">Susu App</h1>
        <div className="text-gray-600">Welcome back, Kobby</div>
      </header>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-lg shadow p-5 flex flex-col justify-center">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-3xl font-semibold mt-1">{value}</span>
            <span className="text-xs text-gray-400 mt-1">{sub}</span>
          </div>
        ))}
      </div>

      {/* Main Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Expenses by Category */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={expensesByCategoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {expensesByCategoryData.map(({ name, color }) => (
                <Cell key={name} fill={color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => {
                const entry = expensesByCategoryData.find(d => d.name === value);
                return <span style={{ color: entry?.color || '#000' }}>{value}</span>;
              }}
            />
            <Tooltip />
          </PieChart>
        </section>

        {/* Budget Overview */}
        <section className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
          {budgetOverview.map(({ name, spent, budget }) => {
            const usedPercent = Math.min((spent / budget) * 100, 100);
            return (
              <div key={name}>
                <div className="flex justify-between font-semibold text-gray-800 mb-1">
                  <span>{name}</span>
                  <span>₵{spent} / ₵{budget}</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-4 bg-black rounded-full transition-all"
                    style={{ width: `${usedPercent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1">{usedPercent.toFixed(0)}% used</div>
              </div>
            );
          })}
        </section>
      </div>

      {/* Recent Transactions */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <ul className="divide-y divide-gray-200">
          {recentTransactions.map(({ desc, date, amount, income }) => (
            <li
              key={desc}
              className="flex justify-between items-center py-3 hover:bg-green-50 transition-colors cursor-pointer"
            >
              <div>
                <p className="font-semibold text-gray-800">{desc}</p>
                <p className="text-sm text-gray-500">{date}</p>
              </div>
              <div className={income ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                {income ? `+₵${amount}` : `-₵${amount}`}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}