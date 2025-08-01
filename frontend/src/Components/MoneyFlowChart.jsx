import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', income: 2500, expense: 1400 },
  { month: 'Feb', income: 2700, expense: 1500 },
  { month: 'Mar', income: 2450, expense: 1380 },
  { month: 'Apr', income: 2800, expense: 1600 },
];

export default function MoneyFlowChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
     <BarChart data={data} barGap={6}>
        <XAxis 
          dataKey="month" 
          tick={{ fill: '#6b7280' }} // Gray text for X-axis
        />
        <YAxis 
          tick={{ fill: '#6b7280' }} // Gray text for Y-axis
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#f9fafb',
            borderColor: '#e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
        />
        <Bar 
          dataKey="income" 
          name="Income" 
          fill="#4f46e5"  // Indigo-600
          radius={[6, 6, 0, 0]} 
        />
        <Bar 
          dataKey="expense" 
          name="Expense" 
          fill="#71717a"  // Zinc-500
          radius={[6, 6, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
