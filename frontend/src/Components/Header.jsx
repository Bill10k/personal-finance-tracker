import React from 'react';

export default function Header() {
  return (
    <header className="flex items-center mb-8">
      <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
        Personal Finance Tracker
      </h1>
      <div className="flex items-center space-x-4 ml-auto">
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          Welcome back, <span className="font-semibold">Kobby</span>
        </span>
        
        {/* Add Widget Button */}
        
      </div>
    </header>
  );
}
