// src/Components/Chart.jsx
const Chart = ({ data }) => {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-md font-semibold mb-2">Expenses by Category</h3>
        <ul className="space-y-1">
          {data.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              {item.name}: ₵{item.value}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  
  export default Chart
  