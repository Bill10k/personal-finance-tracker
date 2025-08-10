import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} from "../api";
import { parseServerError } from "../utils/errors";

export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [localAdd, setLocalAdd] = useState({});
  const [localDeduct, setLocalDeduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all goals
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getSavingsGoals();
        setGoals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(parseServerError(err) || "Failed to load savings goals.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Add new goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError("");

    const name = goalName.trim();
    const target = Number(goalTarget);
    if (!name || !target || target <= 0) {
      setError("Please enter a valid name and target amount.");
      return;
    }

    try {
      const res = await createSavingsGoal({ name, target, saved: 0 });
      setGoals((prev) => [...prev, res.data]);
      setGoalName("");
      setGoalTarget("");
      setShowModal(false);
    } catch (err) {
      setError(parseServerError(err) || "Failed to add savings goal.");
    }
  };

  // Update saved amount helper
  const updateSaved = async (goalId, nextSaved) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const clamped = Math.max(0, Math.min(Number(nextSaved) || 0, Number(goal.target) || 0));
    try {
      await updateSavingsGoal(goalId, { saved: clamped });
      setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, saved: clamped } : g)));
    } catch (err) {
      setError(parseServerError(err) || "Failed to update savings.");
    }
  };

  // Add saved
  const handleAddSavedAmount = async (goalId) => {
    const amt = Number(localAdd[goalId]);
    if (!amt || amt <= 0) return;
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    await updateSaved(goalId, (Number(goal.saved) || 0) + amt);
    setLocalAdd((prev) => ({ ...prev, [goalId]: "" }));
  };

  // Deduct saved
  const handleDeductAmount = async (goalId) => {
    const amt = Number(localDeduct[goalId]);
    if (!amt || amt <= 0) return;
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    await updateSaved(goalId, (Number(goal.saved) || 0) - amt);
    setLocalDeduct((prev) => ({ ...prev, [goalId]: "" }));
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    setError("");
    try {
      await deleteSavingsGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (err) {
      setError(parseServerError(err) || "Failed to delete goal.");
    }
  };

  const getBarColor = (percent) => {
    if (percent < 50) return "bg-violet-200";
    if (percent < 85) return "bg-violet-400";
    return "bg-violet-600";
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

      {error && <div className="text-red-600 mb-3">{error}</div>}

      {loading ? (
        <p className="text-gray-500 text-sm text-center">Loading...</p>
      ) : goals.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No goals yet. Add one to get started!</p>
      ) : (
        goals.map((goal) => {
          const saved = Number(goal.saved) || 0;
          const target = Number(goal.target) || 0;
          const percent = target > 0 ? Math.min((saved / target) * 100, 100) : 0;

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
                ₵{saved.toLocaleString()} of ₵{target.toLocaleString()} saved
              </div>

              {/* Add & Deduct */}
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  min="0"
                  placeholder="₵ Add"
                  value={localAdd[goal.id] ?? ""}
                  onChange={(e) =>
                    setLocalAdd((prev) => ({ ...prev, [goal.id]: e.target.value }))
                  }
                  className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => handleAddSavedAmount(goal.id)}
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
                  value={localDeduct[goal.id] ?? ""}
                  onChange={(e) =>
                    setLocalDeduct((prev) => ({ ...prev, [goal.id]: e.target.value }))
                  }
                  className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => handleDeductAmount(goal.id)}
                  className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded"
                >
                  Deduct
                </button>

                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="ml-auto text-red-500 hover:text-red-700 p-1 rounded"
                  title="Delete Goal"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Modal */}
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
                    min="0"
                    step="0.01"
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
