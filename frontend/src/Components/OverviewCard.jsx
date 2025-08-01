// src/Components/OverviewCard.jsx
const OverviewCard = ({ title, value, subText }) => {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-sm text-gray-500">{title}</h4>
        <h2 className="text-2xl font-semibold">{value}</h2>
        <p className="text-xs text-gray-400">{subText}</p>
      </div>
    )
  }
  
  export default OverviewCard
  