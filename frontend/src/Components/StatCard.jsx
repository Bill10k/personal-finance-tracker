import React from 'react';
import { ArrowUpIcon } from 'lucide-react';

export default function StatCard({ label, value, percent, positive }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col items-start">
      <div className="text-gray-500 dark:text-gray-400 text-sm">{label}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
      {percent !== undefined && (
        <div className={`${positive ? "text-green-500" : "text-red-500"} mt-1 flex items-center text-xs`}>
          <ArrowUpIcon className="w-4 h-4 mr-1" /> {percent}
        </div>
      )}
    </div>
  );
}
