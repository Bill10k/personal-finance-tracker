import React, { useState } from 'react';

const sampleTransactions = [
  { id: 1, title: 'Grocery shopping', category: 'Food', date: '2024-06-03', amount: -45 },
  { id: 2, title: 'Monthly rent payment', category: 'Rent', date: '2024-06-02', amount: -1200 },
  { id: 3, title: 'Monthly salary', category: 'Salary', date: '2024-06-01', amount: 3500 },
];

export default function History() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'food', 'rent', 'transport', 'entertainment', 'salary'];

  const filteredTransactions = sampleTransactions.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      filterType === 'all' ||
      (filterType === 'income' && tx.amount > 0) ||
      (filterType === 'expense' && tx.amount < 0);
    const matchesCategory =
      filterCategory === 'all' || tx.category.toLowerCase() === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md min-h-screen">
      <h2 className="text-xl font-semibold mb-6">Transaction History</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="search"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow min-w-[200px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions List */}
      <ul className="divide-y divide-gray-200">
        {filteredTransactions.map((tx) => (
          <li
            key={tx.id}
            className="flex justify-between items-center py-4 hover:bg-green-50 rounded-md px-3 transition-colors"
          >
            <div>
              <p className="font-semibold text-gray-800">{tx.title}</p>
              <p className="text-sm text-gray-500">
                {tx.category} · {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>
            <div
              className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {tx.amount > 0 ? '+' : '-'}₵{Math.abs(tx.amount).toLocaleString()}
            </div>
          </li>
        ))}
        {filteredTransactions.length === 0 && (
          <li className="py-6 text-center text-gray-500">No transactions found.</li>
        )}
      </ul>
    </div>
  );
}