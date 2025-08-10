import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000", // backend base URL
  withCredentials: false,
});

// Attach token automatically from localStorage for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// TRANSACTIONS
export const getTransactions = () => api.get("/transactions/");
export const createTransactionAPI = (transaction) => api.post("/transactions/", transaction);
export const deleteTransactionAPI = (id) => api.delete(`/transactions/${id}`);

// Categories
export const getCategories = () => api.get("/categories/");
export const createCategory = (data) => api.post("/categories/", data);

// BUDGETS
export const getBudgets = () => api.get("/budgets/");
export const createBudget = (data) => api.post("/budgets/", data);
export const updateBudget = (id, data) => api.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

// SAVINGS GOALS
export const getSavingsGoals = () => api.get("/savings-goals/");
export const createSavingsGoal = (data) => api.post("/savings-goals/", data);
export const updateSavingsGoal = (id, data) => api.put(`/savings-goals/${id}`, data);
export const deleteSavingsGoal = (id) => api.delete(`/savings-goals/${id}`);

// DASHBOARD
export const getDashboardSummary = () => api.get("/dashboard/");
