import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../../index.css";

const dataIncome = [
  { name: "Salary", value: 50000, color: "#4CAF50" },
  { name: "Freelance", value: 20000, color: "#2196F3" },
  { name: "Investments", value: 15000, color: "#FFC107" },
];

const dataExpense = [
  { name: "Rent", value: 15000, color: "#F44336" },
  { name: "Groceries", value: 8000, color: "#9C27B0" },
  { name: "Transport", value: 3000, color: "#FF5722" },
];

export default function StatsTabs() {
  const [activeTab, setActiveTab] = useState("income");

  const selectedData = activeTab === "income" ? dataIncome : dataExpense;
  const total = selectedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("income")}
          className={`px-5 py-2 rounded-xl text-lg font-semibold transition-all ${
            activeTab === "income"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Income: ₹{total}
        </button>

        <button
          onClick={() => setActiveTab("expense")}
          className={`px-5 py-2 rounded-xl text-lg font-semibold transition-all ${
            activeTab === "expense"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Expense: ₹{total}
        </button>
      </div>

      {/* Pie + Grid */}
      <div className="grid grid-cols-2 gap-10">
        {/* Pie Chart */}
        <div className="flex justify-center items-center">
          <PieChart width={350} height={350}>
            <Pie
              data={selectedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {selectedData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4">
          {selectedData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-lg font-medium">{item.name}</span>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold">₹{item.value}</p>
                <p className="text-sm text-gray-500">
                  {((item.value / total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
