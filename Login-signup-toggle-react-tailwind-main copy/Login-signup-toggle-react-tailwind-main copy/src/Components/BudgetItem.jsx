// src/Components/BudgetItem.jsx
const BudgetItem = ({ category, spent, limit }) => {
    const percent = Math.round((spent / limit) * 100)
  
    return (
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm font-medium">{category}</p>
        <div className="w-full bg-gray-200 h-2 rounded mt-1 mb-1">
          <div
            className="h-2 bg-green-500 rounded"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">₵{spent} / ₵{limit} — {percent}% used</p>
      </div>
    )
  }
  
  export default BudgetItem
  