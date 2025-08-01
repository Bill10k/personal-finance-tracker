
import React from 'react';

export default function NavTabs({ activeTab, setActiveTab, userName }) {
  const tabs = ['Dashboard', 'Add Transaction', 'History', 'Budget'];
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-10">
        <div className="text-2xl font-bold text-emerald-600 flex items-center space-x-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span>Susu App</span>
        </div>
        <ul className="flex space-x-8 text-gray-700 font-semibold">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer py-2 px-3 rounded-md ${
                activeTab === tab
                  ? 'text-white bg-emerald-600 shadow'
                  : 'hover:text-emerald-600 hover:bg-emerald-100'
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-gray-600 font-medium">Welcome back, {userName}</div>
    </nav>
  );
}