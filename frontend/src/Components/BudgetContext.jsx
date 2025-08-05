import React, { createContext, useContext, useState, useEffect } from 'react';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgetData, setBudgetData] = useState(() => {
    const saved = localStorage.getItem('budgetData');
    return saved ? JSON.parse(saved) : {
      totalBudget: 0,
      totalSpent: 0,
      categories: []
    };
  });

  // Recalculate totals whenever categories change
  useEffect(() => {
    const calculated = {
      totalBudget: budgetData.categories.reduce((sum, cat) => sum + (cat.budget || 0), 0),
      totalSpent: budgetData.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0),
      categories: budgetData.categories
    };
    
    if (calculated.totalBudget !== budgetData.totalBudget || 
        calculated.totalSpent !== budgetData.totalSpent) {
      setBudgetData(calculated);
    }
  }, [budgetData.categories]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
  }, [budgetData]);

  // Budget management functions
  const addBudgetCategory = (newCategory) => {
    const newId = budgetData.categories.length > 0 
      ? Math.max(...budgetData.categories.map(c => c.id)) + 1 
      : 1;
    
    setBudgetData(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: newId,
          name: newCategory.name,
          spent: 0,
          budget: newCategory.amount
        }
      ]
    }));
  };

  const addSpending = (categoryId, amount) => {
    if (!amount || amount <= 0) return;
    
    setBudgetData(prev => {
      const updatedCategories = prev.categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, spent: (cat.spent || 0) + amount }
          : cat
      );
      
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };

  const deleteCategory = (categoryId) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };

  const resetCategory = (categoryId) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId ? { ...cat, spent: 0 } : cat
      )
    }));
  };

  const resetAllBudgets = () => {
    setBudgetData({
      totalBudget: 0,
      totalSpent: 0,
      categories: []
    });
  };

  const value = {
    budgetData,
    addBudgetCategory,
    addSpending,
    deleteCategory,   // ✅ Added here
    resetCategory,
    resetAllBudgets
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
