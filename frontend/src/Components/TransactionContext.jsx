import React, { createContext, useContext, useState, useEffect } from "react";
import { getTransactions, createTransactionAPI, deleteTransactionAPI } from "../api"; // <-- import API

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load from backend on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await getTransactions(token);
        setTransactions(response.data);
      } catch (err) {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ✅ Add transaction (API and state)
  const addTransaction = async (transaction) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await createTransactionAPI(transaction, token);
      setTransactions((prev) => [response.data, ...prev]);
    } catch (err) {
      // handle error (show toast, set error state, etc)
    }
  };

  // ✅ Delete transaction (API and state)
  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await deleteTransactionAPI(id, token);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      // handle error
    }
  };

  // ✅ Reset all transactions (frontend only or backend if endpoint exists)
  const resetTransactions = () => {
    setTransactions([]);
    // Optionally: call backend to delete all if such an endpoint exists
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        deleteTransaction,
        resetTransactions,
        loading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}
