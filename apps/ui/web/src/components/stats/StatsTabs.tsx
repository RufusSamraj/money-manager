import { useState } from "react";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import { StatsResponse } from "./mock/stats";

interface Props {
  data: StatsResponse;
}

export default function StatsTabs({ data }: Props) {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");

  const selectedData = activeTab === "income" ? data.incomeCategories : data.expenseCategories;

  const total = activeTab === "income" ? data.totalIncome : data.totalExpense;

  const chartData = selectedData.map((item) => ({
    name: item.name,
    value: item.amount,
    color: item.color,
  }));

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
          Income: ₹{data.totalIncome}
        </button>

        <button
          onClick={() => setActiveTab("expense")}
          className={`px-5 py-2 rounded-xl text-lg font-semibold transition-all ${
            activeTab === "expense"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Expense: ₹{data.totalExpense}
        </button>
      </div>

      {/* Pie + Grid */}
      <div className="grid grid-cols-2 gap-10">
        {/* Pie Chart */}
        <div className="flex justify-center items-center">
          <PieChart width={350} height={350}>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={120} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4">
          {selectedData.map((item, index) => {
            const percentage = ((item.amount / total) * 100).toFixed(1);
            return (
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
                  <p className="text-lg font-semibold">₹{item.amount}</p>
                  <p className="text-sm text-gray-500">{percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
