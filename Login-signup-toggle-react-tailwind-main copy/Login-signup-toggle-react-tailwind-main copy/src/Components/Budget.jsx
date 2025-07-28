import React from 'react';

const budgetData = {
  totalBudget: 2500,
  totalSpent: 1745,
  categories: [
    { id: 1, name: 'Food', spent: 245, budget: 500 },
    { id: 2, name: 'Transportation', spent: 120, budget: 200 },
    { id: 3, name: 'Entertainment', spent: 180, budget: 300 },
    { id: 4, name: 'Rent', spent: 1200, budget: 1500 },
  ],
};

export default function Budget() {
  const remaining = budgetData.totalBudget - budgetData.totalSpent;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Budget Overview</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition-colors">
          + Add Budget
        </button>
      </header>

      <section className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 rounded-lg p-4 text-center">
          <p className="text-gray-700 font-semibold">Total Budget</p>
          <p className="text-2xl font-bold text-green-800">₵{budgetData.totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-red-100 rounded-lg p-4 text-center">
          <p className="text-gray-700 font-semibold">Total Spent</p>
          <p className="text-2xl font-bold text-red-700">₵{budgetData.totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <p className="text-gray-700 font-semibold">Remaining</p>
          <p className="text-2xl font-bold text-blue-700">₵{remaining.toLocaleString()}</p>
        </div>
      </section>

      <section className="space-y-6">
        {budgetData.categories.map(({ id, name, spent, budget }) => {
          const usedPercent = Math.min((spent / budget) * 100, 100);
          const remainingAmount = budget - spent;

          return (
            <div key={id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{name}</h3>
                <button className="text-gray-500 hover:text-gray-700" aria-label={`Edit ${name} budget`}>
                  ✏️
                </button>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full mb-2 overflow-hidden">
                <div
                  className="h-4 rounded-full bg-black transition-all"
                  style={{ width: `${usedPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>₵{spent.toLocaleString()} spent</span>
                <span>₵{budget.toLocaleString()} budget</span>
              </div>
              <p className="text-sm text-gray-600">{usedPercent.toFixed(1)}% used</p>
              <p className="text-sm text-blue-700">₵{remainingAmount.toLocaleString()} remaining</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}