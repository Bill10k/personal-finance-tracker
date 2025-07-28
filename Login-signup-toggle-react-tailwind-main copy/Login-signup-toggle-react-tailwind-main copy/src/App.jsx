import React, { useState } from 'react';
import Dashboard from './Components/Dashboard';
import AddTransaction from './Components/AddTransaction';
import History from './Components/History';
import Budget from './Components/Budget';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Tab config matching your inspiration UI:
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'addTransaction', label: 'Add Transaction' },
    { id: 'history', label: 'History' },
    { id: 'budget', label: 'Budget' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white shadow flex justify-between items-center px-6 py-4">
        <div className="text-green-600 font-bold text-xl flex items-center space-x-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 17a2 2 0 104 0 2 2 0 00-4 0zM3 7h18M4 7a2 2 0 012-2h12a2 2 0 012 2m-2 10h-2m-4 0h-2m-4 0H5"
            />
          </svg>
          <span>Susu App</span>
        </div>
        <div className="text-gray-700">Welcome back, Kobby</div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-white flex border-b border-gray-200">
        {tabs.map(({ id, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 text-center py-3 font-semibold transition-colors ${
                isActive
                  ? 'bg-green-600 text-white border-b-4 border-green-600'
                  : 'bg-white text-gray-700 hover:text-green-600'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="p-6 max-w-6xl mx-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'addTransaction' && <AddTransaction />}
        {activeTab === 'history' && <History />}
        {activeTab === 'budget' && <Budget />}
      </main>
    </div>
  );
}