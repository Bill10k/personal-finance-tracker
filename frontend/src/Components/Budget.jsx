import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import { fetchBudgets, addBudget, updateBudget, deleteBudget } from '../services/api';

function getBarColor(usedPercent) {
  if (usedPercent < 50) return 'bg-green-400';
  if (usedPercent < 85) return 'bg-yellow-400';
  return 'bg-red-500';
}

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [localSpend, setLocalSpend] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch budgets on mount
  useEffect(() => {
    loadBudgets();
    // eslint-disable-next-line
  }, []);

  async function loadBudgets() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const data = await fetchBudgets(token);
      setBudgets(data);
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }

  // Add budget category
  async function handleAddBudget(newCategory) {
    try {
      const token = localStorage.getItem("token");
      await addBudget(token, { name: newCategory.name, budget: newCategory.amount, spent: 0 });
      await loadBudgets();
      setShowAddBudgetModal(false);
    } catch {
      setError("Could not add budget.");
    }
  }

  // Add spending
  async function handleAddSpending(categoryId, amount) {
    if (!amount || amount <= 0) return;
    try {
      const token = localStorage.getItem("token");
      // Find current category
      const cat = budgets.find(b => b.id === categoryId);
      await updateBudget(token, categoryId, { ...cat, spent: cat.spent + amount });
      await loadBudgets();
      setLocalSpend(prev => ({ ...prev, [categoryId]: 0 }));
    } catch {
      setError("Could not update spending.");
    }
  }

  // Reset category
  async function handleResetCategory(categoryId) {
    try {
      const token = localStorage.getItem("token");
      const cat = budgets.find(b => b.id === categoryId);
      await updateBudget(token, categoryId, { ...cat, spent: 0 });
      await loadBudgets();
    } catch {
      setError("Could not reset category.");
    }
  }

  // Delete ALL categories (if you have this endpoint)
  async function handleFullReset() {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(budgets.map(b => deleteBudget(token, b.id)));
      await loadBudgets();
      setShowResetConfirm(false);
    } catch {
      setError("Could not reset all.");
    }
  }

  // Summary
  const totalBudget = budgets.reduce((sum, cat) => sum + Number(cat.budget), 0);
  const totalSpent = budgets.reduce((sum, cat) => sum + Number(cat.spent), 0);
  const remaining = totalBudget - totalSpent;

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

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        {showResetConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-white">Reset All Budgets?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This will clear ALL categories and spending data. This cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-white"
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
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SummaryCard
            label="Total Budget"
            amount={totalBudget}
            color="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200"
          />
          <SummaryCard
            label="Total Spent"
            amount={totalSpent}
            color="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
          />
          <SummaryCard
            label="Remaining"
            amount={remaining}
            color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
          />
        </section>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <section className="space-y-6">
            {budgets.length > 0 ? (
              budgets.map(({ id, name, spent, budget }) => {
                const usedPercent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                const remainingAmount = budget - spent;
                const barColor = getBarColor(usedPercent);

                return (
                  <div key={id} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-6 py-5 shadow flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{name}</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleResetCategory(id)}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                          title="Reset spending for this category"
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
        )}

        {showAddBudgetModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/10 dark:bg-black/30">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-lg shadow-xl border border-white/20 dark:border-gray-600/30 backdrop-blur-lg">
              <AddBudgetForm
                onCancel={() => setShowAddBudgetModal(false)}
                onSave={handleAddBudget}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ...AddBudgetForm and SummaryCard can stay unchanged...
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
