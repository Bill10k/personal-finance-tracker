// BudgetContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../api";

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    totalSpent: 0,
    categories: [],
  });

  const [error, setError] = useState(null);

  const extractErr = (err) =>
    err?.response?.data ?? err?.data ?? err?.message ?? "Request failed";

  // Fetch from backend on mount
  useEffect(() => {
    async function fetchBudgets() {
      try {
        setError(null);
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("You’re not signed in. Please log in again.");
          setBudgetData({ totalBudget: 0, totalSpent: 0, categories: [] });
          return;
        }
        const response = await getBudgets(token);
        // Expecting [{ id, name, budget, spent }, ...]
        const categories = response.data ?? [];
        const totalBudget = categories.reduce((sum, c) => sum + Number(c.budget || 0), 0);
        const totalSpent = categories.reduce((sum, c) => sum + Number(c.spent || 0), 0);
        setBudgetData({ totalBudget, totalSpent, categories });
      } catch (err) {
        setError(extractErr(err));
        setBudgetData({ totalBudget: 0, totalSpent: 0, categories: [] });
      }
    }
    fetchBudgets();
  }, []);

  // Create budget category
  const addBudgetCategory = async (newCategory) => {
    try {
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You’re not signed in. Please log in again.");
        return;
      }
      // newCategory must be { name, budget, spent? }
      const response = await createBudget(newCategory, token);
      const created = response.data;
      setBudgetData((prev) => {
        const categories = [created, ...prev.categories];
        const totalBudget = categories.reduce((s, c) => s + Number(c.budget || 0), 0);
        return { ...prev, categories, totalBudget };
      });
    } catch (err) {
      setError(extractErr(err));
    }
  };

  // Add spending to a category
  const addSpending = async (categoryId, amount) => {
    try {
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You’re not signed in. Please log in again.");
        return;
      }
      const category = budgetData.categories.find((cat) => cat.id === categoryId);
      if (!category) return;
      const newSpent = Number(category.spent || 0) + Number(amount || 0);

      // Send minimal payload as per BudgetUpdate
      await updateBudget(categoryId, { spent: newSpent }, token);

      setBudgetData((prev) => {
        const categories = prev.categories.map((c) =>
          c.id === categoryId ? { ...c, spent: newSpent } : c
        );
        const totalSpent = categories.reduce((s, c) => s + Number(c.spent || 0), 0);
        return { ...prev, categories, totalSpent };
      });
    } catch (err) {
      setError(extractErr(err));
    }
  };

  // Reset a single category (spent -> 0)
  const resetCategory = async (categoryId) => {
    try {
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You’re not signed in. Please log in again.");
        return;
      }
      await updateBudget(categoryId, { spent: 0 }, token);

      setBudgetData((prev) => {
        const categories = prev.categories.map((c) =>
          c.id === categoryId ? { ...c, spent: 0 } : c
        );
        const totalSpent = categories.reduce((s, c) => s + Number(c.spent || 0), 0);
        return { ...prev, categories, totalSpent };
      });
    } catch (err) {
      setError(extractErr(err));
    }
  };

  // Delete category
  const deleteCategory = async (categoryId) => {
    try {
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You’re not signed in. Please log in again.");
        return;
      }
      await deleteBudget(categoryId, token);

      setBudgetData((prev) => {
        const categories = prev.categories.filter((c) => c.id !== categoryId);
        const totalBudget = categories.reduce((s, c) => s + Number(c.budget || 0), 0);
        const totalSpent = categories.reduce((s, c) => s + Number(c.spent || 0), 0);
        return { ...prev, categories, totalBudget, totalSpent };
      });
    } catch (err) {
      setError(extractErr(err));
    }
  };

  // Reset all budgets (delete all)
  const resetAllBudgets = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You’re not signed in. Please log in again.");
        return;
      }
      await Promise.all(
        budgetData.categories.map((cat) => deleteBudget(cat.id, token))
      );
      setBudgetData({ totalBudget: 0, totalSpent: 0, categories: [] });
    } catch (err) {
      setError(extractErr(err));
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budgetData,
        addBudgetCategory,
        addSpending,
        resetCategory,
        resetAllBudgets,
        deleteCategory,
        error,
        setError,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  return useContext(BudgetContext);
}
