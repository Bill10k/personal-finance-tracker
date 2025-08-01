import React, { useEffect, useState } from 'react';
import { fetchGoals, addGoal, updateGoal, deleteGoal } from '../services/api';

export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', saved: '' });

  useEffect(() => {
    fetchGoals()
      .then(setGoals)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setNewGoal({ ...newGoal, [e.target.name]: e.target.value });

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;
    const created = await addGoal({ ...newGoal, target: Number(newGoal.target), saved: Number(newGoal.saved) || 0 });
    setGoals((g) => [...g, created]);
    setNewGoal({ name: '', target: '', saved: '' });
  };

  const handleUpdateGoal = async (id, saved) => {
    const updated = await updateGoal(id, { saved: Number(saved) });
    setGoals((g) => g.map(goal => goal.id === id ? updated : goal));
  };

  const handleDeleteGoal = async (id) => {
    await deleteGoal(id);
    setGoals((g) => g.filter(goal => goal.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Savings Goals</h2>
      <form onSubmit={handleAddGoal} className="flex gap-2 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Goal name"
          value={newGoal.name}
          onChange={handleChange}
          className="flex-1 border border-gray-300 rounded px-2 py-1"
        />
        <input
          type="number"
          name="target"
          placeholder="Target ₵"
          value={newGoal.target}
          onChange={handleChange}
          min="0"
          className="w-28 border border-gray-300 rounded px-2 py-1"
        />
        <button type="submit" className="bg-violet-600 text-white px-3 rounded">Add</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : goals.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No savings goals yet.</div>
      ) : (
        goals.map((goal) => {
          const percent = Math.min((goal.saved / goal.target) * 100, 100);
          return (
            <div key={goal.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <span>{goal.name}</span>
                <span className="text-sm">{percent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                <span>₵{goal.saved} of ₵{goal.target} saved</span>
                <span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Add ₵"
                    className="w-16 border border-gray-300 rounded px-1 text-xs"
                    onBlur={e => handleUpdateGoal(goal.id, e.target.value)}
                  />
                  <button onClick={() => handleDeleteGoal(goal.id)} className="ml-2 text-red-500 hover:underline text-xs">
                    Delete
                  </button>
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
