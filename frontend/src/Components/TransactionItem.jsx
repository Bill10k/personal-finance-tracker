// src/Components/TransactionItem.jsx
const TransactionItem = ({ description, date, amount, type }) => {
  const formattedAmount = amount.toLocaleString();

  return (
    <div className="flex justify-between bg-white p-3 rounded shadow">
      <div>
        <p className="font-medium">{description}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <p className={`font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
        {type === 'income' ? `+₵${formattedAmount}` : `-₵${formattedAmount}`}
      </p>
    </div>
  );
};

export default TransactionItem;