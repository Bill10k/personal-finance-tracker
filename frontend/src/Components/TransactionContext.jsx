import React, { createContext, useContext, useState, useEffect } from "react";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  // ✅ Sync to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ✅ Add transaction
  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  // ✅ Delete transaction
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  // ✅ Reset all transactions
  const resetTransactions = () => {
  setTransactions([]); // Clear state
  localStorage.setItem("transactions", JSON.stringify([])); // Clear only main transactions
};

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, deleteTransaction, resetTransactions }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}
