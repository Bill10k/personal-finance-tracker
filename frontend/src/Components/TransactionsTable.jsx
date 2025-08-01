import React from 'react';

const transactions = [
  { desc: 'Monthly Salary', date: '2024-06-01', amount: 3500, type: 'income' },
  { desc: 'Grocery shopping', date: '2024-06-03', amount: 45, type: 'expense' },
  { desc: 'Rent payment', date: '2024-06-02', amount: 1200, type: 'expense' },
];

export default function TransactionsTable() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Description</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              <td className="py-2">{tx.desc}</td>
              <td>{tx.date}</td>
              <td className={tx.type === 'income' ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                {tx.type === 'income' ? '+' : '-'}₵{tx.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
