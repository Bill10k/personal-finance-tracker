// src/services/api.js

import axios from "axios";
const API_BASE = "http://127.0.0.1:8000"; // Change if deploying elsewhere

// --- Helper: Get Authorization Header ---
function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- AUTH ---
export const loginUser = (credentials) =>
  axios.post(`${API_BASE}/auth/login`, credentials);

export const registerUser = (userData) =>
  axios.post(`${API_BASE}/auth/register`, userData);

// --- TRANSACTIONS ---
export const fetchTransactions = () =>
  axios.get(`${API_BASE}/transactions/`, {
    headers: getAuthHeader(),
  });

export const addTransaction = (txData) =>
  axios.post(`${API_BASE}/transactions/`, txData, {
    headers: getAuthHeader(),
  });

// --- BUDGETS ---
export const fetchBudgets = async (token) =>
  axios.get(`${API_BASE}/budgets/`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);

export const addBudget = async (token, data) =>
  axios.post(`${API_BASE}/budgets/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);

export const updateBudget = async (token, id, data) =>
  axios.put(`${API_BASE}/budgets/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);

export const deleteBudget = async (token, id) =>
  axios.delete(`${API_BASE}/budgets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);


// --- SAVINGS GOALS (if you have this endpoint) ---
export const fetchGoals = async () => {
  const res = await axios.get(`${API_BASE}/savings-goals/`, { headers: getAuthHeader() });
  return res.data;
};
export const addGoal = async (goal) => {
  const res = await axios.post(`${API_BASE}/savings-goals/`, goal, { headers: getAuthHeader() });
  return res.data;
};
export const updateGoal = async (id, update) => {
  const res = await axios.put(`${API_BASE}/savings-goals/${id}`, update, { headers: getAuthHeader() });
  return res.data;
};
export const deleteGoal = async (id) => {
  await axios.delete(`${API_BASE}/savings-goals/${id}`, { headers: getAuthHeader() });
};

// --- DASHBOARD SUMMARY (if backend provides this) ---
export const fetchDashboard = () =>
  axios.get(`${API_BASE}/dashboard/`, {
    headers: getAuthHeader(),
  });
