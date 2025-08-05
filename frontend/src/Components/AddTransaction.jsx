import React, { useState } from "react";
import { useTransactions } from "./TransactionContext"; // ✅ Context for live updates

export default function AddTransaction({ onCancel }) {
  const { addTransaction } = useTransactions(); // ✅ Add function from context

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));

  const categories = ["Food", "Rent", "Transport", "Entertainment", "Salary", "Other"];

  function handleSubmit(e) {
    e.preventDefault();

    if (!amount || !category || !date) {
      alert("Please fill all required fields");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type,
      amount: Number(amount),
      category,
      description,
      date,
      createdAt: new Date().toISOString(), // For recent filter
    };

    addTransaction(newTransaction); // ✅ Add to global state (and localStorage)

    // Reset form
    setType("expense");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().substr(0, 10));

    if (onCancel) onCancel(); // ✅ Close modal if provided
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
          Transaction Type
        </label>
        <div className="flex space-x-6">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="type"
              value="income"
              checked={type === "income"}
              onChange={() => setType("income")}
              className="form-radio text-green-600"
            />
            <span className="ml-2 text-green-600 font-semibold">💰 Income</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={type === "expense"}
              onChange={() => setType("expense")}
              className="form-radio text-red-600"
            />
            <span className="ml-2 text-red-600 font-semibold">💵 Expense</span>
          </label>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
          Amount (₵)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
          Description
        </label>
        <textarea
          rows="3"
          placeholder="Enter transaction description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white resize-none"
        ></textarea>
      </div>

      {/* Date */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className={`flex-1 py-3 rounded-md font-semibold text-white ${
            type === "income"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } transition-colors`}
        >
          Add {type === "income" ? "Income" : "Expense"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-md border border-gray-300 dark:border-gray-700 dark:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
