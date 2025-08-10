import React, { useState, useEffect } from "react";
import { Trash2, RefreshCw, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddTransaction from "./AddTransaction";
import { useTransactions } from "./TransactionContext";
import {
  getTransactions,
  createTransactionAPI,
  deleteTransactionAPI,
} from "../api";
import { parseServerError } from "../utils/errors";

// Adjust this ONLY if your backend returns a different date field.
// Your DB shows a `timestamp` column, so we normalize from `timestamp`.
function normalizeTxn(apiTxn) {
  return {
    id: apiTxn.id,
    date: apiTxn.timestamp
      ? new Date(apiTxn.timestamp).toISOString().slice(0, 10)
      : "",
    description: apiTxn.description || "",
    category: apiTxn.category ?? "",
    amount: Number(apiTxn.amount),
    type: apiTxn.type,
  };
}

export default function Transactions() {
  const {
    transactions,
    setTransactions,
    addTransaction,
    deleteTransaction,
    resetTransactions,
  } = useTransactions();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transactions from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getTransactions(); // axios instance should inject token
        const list = Array.isArray(res.data) ? res.data.map(normalizeTxn) : [];
        setTransactions(list);
      } catch (err) {
        setError(parseServerError(err) || "Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setTransactions]);

  // Add Transaction (called by AddTransaction onSuccess)
  async function handleAddTransaction(newTxn) {
    try {
      setError("");
      // Backend expects `timestamp` ISO string. If your backend expects `transaction_date`,
      // change the key name here accordingly.
      const payload = {
        amount: Number(newTxn.amount),
        type: newTxn.type, // 'income' | 'expense'
        category: newTxn.category,
        description: newTxn.description || "",
        account_id: newTxn.account_id ?? 1,
        timestamp:
          newTxn.timestamp ||
          new Date(
            (newTxn.dateOnly || new Date().toISOString().slice(0, 10)) +
              "T00:00:00"
          ).toISOString(),
      };

      const res = await createTransactionAPI(payload);
      addTransaction(normalizeTxn(res.data));
      setShowAddModal(false);
    } catch (err) {
      setError(parseServerError(err) || "Failed to add transaction.");
    }
  }

  // Delete transaction
  async function handleDeleteTransaction(id) {
    try {
      setError("");
      await deleteTransactionAPI(id);
      deleteTransaction(id);
    } catch (err) {
      setError(parseServerError(err) || "Failed to delete transaction.");
    }
  }

  // Reset all (client-side context)
  function handleResetAll() {
    resetTransactions();
    setShowResetConfirm(false);
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl font-sans">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              Transactions
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Track your income and expenses.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl shadow transition"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Reset All</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-violet-600 hover:bg-violet-800 text-white px-5 py-2 rounded-xl shadow font-semibold transition"
            >
              <Plus size={18} className="sm:hidden" />
              <span className="hidden sm:inline">+ Add Transaction</span>
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-3 text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        {/* Loading / Table */}
        {loading ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow overflow-hidden">
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((txn) => (
                      <tr
                        key={txn.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {txn.date || "-"}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {txn.description}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {txn.category}
                        </td>
                        <td
                          className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                            txn.type === "income"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {txn.type === "income" ? "+" : "-"}₵{txn.amount}
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 capitalize">
                          {txn.type}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteTransaction(txn.id)}
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
                <p>No transactions yet. Click "Add Transaction" to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Add Transaction Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <AddTransaction
                  onCancel={() => setShowAddModal(false)}
                  onSuccess={handleAddTransaction}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Modal */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="text-lg font-bold mb-4 dark:text-white">
                  Reset All Transactions?
                </h3>
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
    </div>
  );
}
