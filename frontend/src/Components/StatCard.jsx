import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, change, trend, icon: Icon, gradient }) {
  // Determine glow color based on gradient
  const glowColor = gradient?.includes('blue')
    ? '#3b82f6'
    : gradient?.includes('green')
    ? '#10b981'
    : gradient?.includes('red')
    ? '#ef4444'
    : '#f59e0b';

  return (
    <div className="group relative">
      {/* Glow background on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
        style={{ background: `linear-gradient(135deg, ${glowColor}, transparent)` }}
      />
      
      {/* Card */}
      <div className="relative backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          {/* Icon inside gradient background */}
          <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
            {Icon && <Icon className="w-6 h-6 text-white" />}
          </div>
          
          {/* Change and trend */}
          <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {change}
          </div>
        </div>

        {/* Label and value */}
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
