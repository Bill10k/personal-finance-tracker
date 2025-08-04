import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function History() {
  // Get transactions from localStorage or empty array
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('historyTransactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Load transactions from main transactions when component mounts
  useEffect(() => {
    const mainTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const historyTransactions = JSON.parse(localStorage.getItem('historyTransactions') || '[]');
    
    // Only update if there are new transactions not already in history
    const newTransactions = mainTransactions.filter(
      mt => !historyTransactions.some(ht => ht.id === mt.id)
    );
    
    if (newTransactions.length > 0) {
      const updatedHistory = [...newTransactions, ...historyTransactions];
      setTransactions(updatedHistory);
      localStorage.setItem('historyTransactions', JSON.stringify(updatedHistory));
    }
  }, []);

  // State for filters
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterCategory('all');
  };

  // Reset all transactions
  const handleResetAll = () => {
    localStorage.removeItem('historyTransactions'); // Only clear history storage
    setTransactions([]);
    setShowResetConfirm(false);
    resetFilters();
  };

  // Dynamically generate categories from transactions
  const dynamicCategories = [
    'all',
    ...new Set(transactions.map(tx => (tx.category || '').toLowerCase()))
  ];

  // Filter transactions based on current filters
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description?.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      filterType === 'all' ||
      (filterType === 'income' && tx.type === 'income') ||
      (filterType === 'expense' && tx.type === 'expense');
    const matchesCategory =
      filterCategory === 'all' ||
      tx.category?.toLowerCase() === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Transaction History</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>
        <div className="flex gap-2">
          {transactions.length > 0 && (
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl shadow transition"
            >
              <X className="w-4 h-4" />
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {/* Search Input */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none border-none ml-2 py-2 px-1 text-gray-800 dark:text-white w-full"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 px-4 text-gray-700 dark:text-gray-200 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 px-4 text-gray-700 dark:text-gray-200 focus:outline-none"
        >
          {dynamicCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full min-w-[400px] text-sm">
          <thead>
            <tr className="text-left bg-gray-50 dark:bg-gray-800">
              <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
              <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Description</th>
              <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Category</th>
              <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
              <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="py-16 text-center text-gray-400 dark:text-gray-500">
                    <div className="mb-2">No transactions found</div>
                    <span className="text-4xl">🔍</span>
                    <div className="mt-2 text-sm">
                      {transactions.length === 0 
                        ? "Add transactions to get started" 
                        : "Try adjusting your filters"}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                    {tx.description}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {tx.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                        tx.type === 'income'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {tx.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-4 font-bold text-right ${
                      tx.type === 'income'
                        ? 'text-green-600 dark:text-green-300'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}₵{Number(tx.amount).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
  {showResetConfirm && (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/20 dark:bg-black/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-white/20 dark:border-gray-600/30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-bold mb-4 dark:text-white">Reset All Transactions?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This will clear ALL transaction history. This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowResetConfirm(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleResetAll}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Confirm Reset
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
