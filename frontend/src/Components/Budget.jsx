import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getBudgets, deleteBudget, getCategories } from "../api";
import AddBudget from "./AddBudget";
import { parseServerError } from "../utils/errors";

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const categoryNameById = useMemo(() => {
    const map = new Map();
    for (const c of categories) map.set(c.id, c.name);
    return map;
  }, [categories]);

  async function fetchAll() {
    setLoading(true);
    setErr("");
    try {
      const [b, c] = await Promise.all([getBudgets(), getCategories()]);
      setBudgets(Array.isArray(b.data) ? b.data : []);
      setCategories(Array.isArray(c.data) ? c.data : []);
    } catch (e) {
      setErr(parseServerError(e) || "Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleDelete(id) {
    try {
      setErr("");
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      setErr(parseServerError(e) || "Failed to delete budget.");
    }
  }

  const formatMoney = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return "₵0.00";
    return `₵${n.toFixed(2)}`;
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl font-sans">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Budgets</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Plan monthly, weekly, or yearly spend for each category.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdd(true)}
              className="bg-violet-600 hover:bg-violet-800 text-white px-5 py-2 rounded-xl shadow font-semibold transition"
            >
              <Plus size={18} className="sm:hidden" />
              <span className="hidden sm:inline">+ Add Budget</span>
            </button>
          </div>
        </header>

        {/* Error */}
        {err && <div className="mb-3 text-red-600 dark:text-red-400 font-medium">{err}</div>}

        {/* Loading / Table */}
        {loading ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow overflow-hidden">
            {budgets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {budgets.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {categoryNameById.get(b.category_id) || `#${b.category_id}`}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                          {formatMoney(b.amount)}
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 capitalize">
                          {b.period || "-"}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 px-4 text-gray-500 dark:text-gray-400">
                <p>No budgets yet. Click "Add Budget" to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Add Budget Modal */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <AddBudget onBudgetAdded={fetchAll} onCancel={() => setShowAdd(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
