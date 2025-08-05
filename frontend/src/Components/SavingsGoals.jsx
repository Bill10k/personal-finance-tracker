import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function SavingsGoals() {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [localAdd, setLocalAdd] = useState({});
  const [localDeduct, setLocalDeduct] = useState({}); // ✅ For deduction

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalName || !goalTarget || Number(goalTarget) <= 0) return;

    const newGoal = {
      id: Date.now(),
      name: goalName,
      saved: 0,
      target: Number(goalTarget)
    };

    setGoals((prev) => [...prev, newGoal]);
    setGoalName('');
    setGoalTarget('');
    setShowModal(false);
  };

  const handleAddSavedAmount = (goalId, amount) => {
    if (!amount || amount <= 0) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, saved: Math.min(g.saved + amount, g.target) } : g
      )
    );
    setLocalAdd((prev) => ({ ...prev, [goalId]: '' }));
  };

  const handleDeductAmount = (goalId, amount) => {
    if (!amount || amount <= 0) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, saved: Math.max(g.saved - amount, 0) } : g
      )
    );
    setLocalDeduct((prev) => ({ ...prev, [goalId]: '' }));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const getBarColor = (percent) => {
    if (percent < 50) return 'bg-green-500';
    if (percent < 85) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No goals yet. Add one to get started!</p>
      ) : (
        goals.map((goal) => {
          const percent = Math.min((goal.saved / goal.target) * 100, 100);
          return (
            <div key={goal.id} className="mb-4">
              <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200 mb-1">
                <span>{goal.name}</span>
                <span>{percent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full ${getBarColor(percent)} transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                ₵{goal.saved.toLocaleString()} of ₵{goal.target.toLocaleString()} saved
              </div>
              {/* Add & Deduct fields */}
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  min="0"
                  placeholder="₵ Add"
                  value={localAdd[goal.id] || ''}
                  onChange={(e) =>
                    setLocalAdd((prev) => ({ ...prev, [goal.id]: Number(e.target.value) }))
                  }
                  className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => handleAddSavedAmount(goal.id, localAdd[goal.id] || 0)}
                  className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="₵ Deduct"
                  value={localDeduct[goal.id] || ''}
                  onChange={(e) =>
                    setLocalDeduct((prev) => ({ ...prev, [goal.id]: Number(e.target.value) }))
                  }
                  className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => handleDeductAmount(goal.id, localDeduct[goal.id] || 0)}
                  className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded"
                >
                  Deduct
                </button>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded"
                  title="Delete Goal"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Modal with Framer Motion */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-white/10 dark:bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-white/20 dark:border-gray-600/30 backdrop-blur-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Goal</h3>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-2">Goal Name</label>
                  <input
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., New Laptop"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-2">Target Amount (₵)</label>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 1200"
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                  >
                    Add Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
