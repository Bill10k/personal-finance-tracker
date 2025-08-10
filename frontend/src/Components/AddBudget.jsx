import React, { useEffect, useMemo, useState } from "react";
import { getCategories, createBudget } from "../api";
import { parseServerError } from "../utils/errors";

export default function AddBudget({ onBudgetAdded, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category_id: "",
    amount: "",
    period: "monthly",
  });
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingCats(true);
      setError("");
      try {
        const res = await getCategories();
        if (mounted) setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (mounted) setError(parseServerError(e) || "Failed to load categories.");
      } finally {
        if (mounted) setLoadingCats(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.category_id) return setError("Please select a category.");
    if (!form.amount || Number(form.amount) <= 0) return setError("Enter a valid amount.");

    setSubmitting(true);
    try {
      const payload = {
        category_id: Number(form.category_id),
        amount: Number(form.amount),
        period: form.period || null,
      };
      await createBudget(payload);

      // Let parent refresh budgets
      onBudgetAdded?.();
      onCancel?.();

      // Reset if staying open
      setForm({ category_id: "", amount: "", period: "monthly" });
    } catch (e2) {
      setError(parseServerError(e2) || "Failed to create budget.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold dark:text-white">Add Budget</h3>
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1 dark:text-gray-200">Category</label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={onChange}
          disabled={loadingCats}
          required
          className="w-full border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="" disabled>
            {loadingCats ? "Loading categories..." : "Select a category"}
          </option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1 dark:text-gray-200">Amount (₵)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="amount"
          value={form.amount}
          onChange={onChange}
          required
          className="w-full border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 dark:text-gray-200">Period</label>
        <select
          name="period"
          value={form.period}
          onChange={onChange}
          className="w-full border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="monthly">monthly</option>
          <option value="weekly">weekly</option>
          <option value="yearly">yearly</option>
          <option value="custom">custom</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
