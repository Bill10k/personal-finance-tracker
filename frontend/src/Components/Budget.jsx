import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from './BudgetContext';

const initialBudgetData = {
  totalBudget: 0,
  totalSpent: 0,
  categories: [],
};

function getBarColor(usedPercent) {
  if (usedPercent < 50) return 'bg-green-400';
  if (usedPercent < 85) return 'bg-yellow-400';
  return 'bg-red-500';
}

export default function Budget() {
  const { 
    budgetData, 
    addBudgetCategory, 
    addSpending, 
    resetCategory, 
    resetAllBudgets,
    deleteCategory,
  } = useBudget();
  
  // Keep your local state for modals and form inputs
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [localSpend, setLocalSpend] = useState({});

  // Update your handlers to use context functions
  const handleAddBudget = (newCategory) => {
    addBudgetCategory(newCategory);
    setShowAddBudgetModal(false);
  };

  const handleAddSpending = (categoryId, amount) => {
    if (!amount || amount <= 0) return;
    addSpending(categoryId, amount);
    setLocalSpend(prev => ({ ...prev, [categoryId]: 0 }));
  };

  const handleResetCategory = (categoryId) => {
    resetCategory(categoryId);
  };

  const handleFullReset = () => {
    resetAllBudgets();
    setShowResetConfirm(false);
  };

  const remaining = budgetData.totalBudget - budgetData.totalSpent;

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl font-sans">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Budget Overview</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Track your spending & goals by category.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl shadow transition"
              title="Reset all budgets"
            >
              <RefreshCw size={18} />
              <span>Reset All</span>
            </button>
            <button
              className="bg-violet-600 hover:bg-violet-800 text-white px-5 py-2 rounded-xl shadow font-semibold transition"
              onClick={() => setShowAddBudgetModal(true)}
            >
              + Add Budget
            </button>
          </div>
        </header>

        <AnimatePresence>
  {showResetConfirm && (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Reset All Budgets?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This will clear ALL categories and spending data. This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowResetConfirm(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleFullReset}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Confirm Reset
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SummaryCard
            label="Total Budget"
            amount={budgetData.totalBudget}
            color="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200"
          />
          <SummaryCard
            label="Total Spent"
            amount={budgetData.totalSpent}
            color="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
          />
          <SummaryCard
            label="Remaining"
            amount={remaining}
            color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
          />
        </section>

        <section className="space-y-6">
          {budgetData.categories.length > 0 ? (
            budgetData.categories.map(({ id, name, spent, budget }) => {
              const usedPercent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
              const remainingAmount = budget - spent;
              const barColor = getBarColor(usedPercent);

              return (
                <div key={id} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-6 py-5 shadow flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{name}</h3>
                    <div className="flex items-center gap-2">
                          <button 
  onClick={() => deleteCategory(id)}
  className="text-gray-400 hover:text-red-500 transition p-1"
  title="Delete this category"
>
  <Trash2 size={18} />
</button>

                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="₵"
                          value={localSpend[id] || ''}
                          onChange={(e) => setLocalSpend(prev => ({ ...prev, [id]: Number(e.target.value) }))}
                          className="w-20 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-black dark:text-white bg-white dark:bg-gray-700"
                        />
                        <button 
                          onClick={() => handleAddSpending(id, localSpend[id] || 0)}
                          className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                        >
                          Add Spend
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-4 rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${usedPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>₵{spent.toLocaleString()} spent</span>
                    <span>₵{budget.toLocaleString()} budget</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      {budget > 0 ? `${usedPercent.toFixed(1)}% used` : 'No budget set'}
                    </span>
                    <span className="text-green-600 dark:text-green-300">
                      ₵{remainingAmount.toLocaleString()} left
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No budget categories yet. Click "Add Budget" to get started!</p>
            </div>
          )}
        </section>

        <AnimatePresence>
  {showAddBudgetModal && (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/10 dark:bg-black/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-lg shadow-xl border border-white/20 dark:border-gray-600/30 backdrop-blur-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AddBudgetForm
          onCancel={() => setShowAddBudgetModal(false)}
          onSave={handleAddBudget}
        />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </div>
  );
}

function AddBudgetForm({ onCancel, onSave }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    onSave({
      name,
      amount: Number(amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add New Budget</h3>
      
      <div>
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
          Category Name
        </label>
        <input
          type="text"
          placeholder="e.g. Groceries, Utilities"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
          Budget Amount (₵)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="flex-1 py-3 rounded-md font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
        >
          Add Budget
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-md border border-gray-300 dark:border-gray-700 dark:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function SummaryCard({ label, amount, color }) {
  return (
    <div className={`rounded-xl p-6 shadow flex flex-col items-center justify-center ${color}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1">₵{amount.toLocaleString()}</p>
    </div>
  );
}