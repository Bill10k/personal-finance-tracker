import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Signup from './Components/signup';
import ForgotPassword from './Components/ForgotPassword';
import Transactions from './Components/Transactions';
import History from './Components/History';
import Budget from './Components/Budget';
import Settings from './Components/Settings';
import EditProfile from './Components/EditProfile';
import { BudgetProvider } from './Components/BudgetContext';


function getPreferredTheme() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dark, setDark] = useState(getPreferredTheme());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const ProtectedLayout = ({ children }) => (
    <div className="flex min-h-screen bg-[#f6f7fb] dark:bg-gray-900 font-sans transition-colors duration-300">
      <Sidebar setIsLoggedIn={setIsLoggedIn} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <BudgetProvider>
        <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : 
            <Login onLoginSuccess={() => setIsLoggedIn(true)} />
          }
        />
        <Route
          path="/signup"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : 
            <Signup onSignupSuccess={() => setIsLoggedIn(true)} />
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/transactions"
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <Transactions />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/history"
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <History />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/edit-profile"
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <EditProfile />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/budget"
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <Budget />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <Settings setIsLoggedIn={setIsLoggedIn} />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
              </Routes>
      </BudgetProvider>
    </div>
  );
}