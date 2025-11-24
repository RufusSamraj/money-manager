export interface CategoryStat {
  id: number;
  name: string;
  amount: number;
  color: string;
}

export interface StatsResponse {
  timeline: "year" | "month" | "week" | "day";
  totalIncome: number;
  totalExpense: number;
  incomeCategories: CategoryStat[];
  expenseCategories: CategoryStat[];
}

export function getMockStats(timeline: "year" | "month" | "week" | "day"): StatsResponse {
  if (timeline === "year") {
    return {
      timeline,
      totalIncome: 820000,
      totalExpense: 540000,
      incomeCategories: [
        { id: 1, name: "Salary", amount: 600000, color: "#4CAF50" },
        { id: 2, name: "Freelancing", amount: 150000, color: "#2196F3" },
        { id: 3, name: "Investments", amount: 70000, color: "#FFC107" },
      ],
      expenseCategories: [
        { id: 1, name: "Rent", amount: 200000, color: "#E53935" },
        { id: 2, name: "Groceries", amount: 120000, color: "#8E24AA" },
        { id: 3, name: "Transport", amount: 40000, color: "#FB8C00" },
        { id: 4, name: "Entertainment", amount: 60000, color: "#3949AB" },
        { id: 5, name: "Shopping", amount: 120000, color: "#00ACC1" },
      ],
    };
  }

  if (timeline === "month") {
    return {
      timeline,
      totalIncome: 65000,
      totalExpense: 42000,
      incomeCategories: [
        { id: 1, name: "Salary", amount: 50000, color: "#4CAF50" },
        { id: 2, name: "Freelancing", amount: 12000, color: "#2196F3" },
        { id: 3, name: "Investments", amount: 3000, color: "#FFC107" },
      ],
      expenseCategories: [
        { id: 1, name: "Rent", amount: 15000, color: "#E53935" },
        { id: 2, name: "Groceries", amount: 8000, color: "#8E24AA" },
        { id: 3, name: "Transport", amount: 3000, color: "#FB8C00" },
        { id: 4, name: "Entertainment", amount: 5000, color: "#3949AB" },
        { id: 5, name: "Shopping", amount: 11000, color: "#00ACC1" },
      ],
    };
  }

  if (timeline === "week") {
    return {
      timeline,
      totalIncome: 16000,
      totalExpense: 8000,
      incomeCategories: [
        { id: 1, name: "Salary", amount: 12000, color: "#4CAF50" },
        { id: 2, name: "Freelancing", amount: 2000, color: "#2196F3" },
        { id: 3, name: "Investments", amount: 2000, color: "#FFC107" },
      ],
      expenseCategories: [
        { id: 1, name: "Groceries", amount: 3000, color: "#8E24AA" },
        { id: 2, name: "Transport", amount: 1000, color: "#FB8C00" },
        { id: 3, name: "Food", amount: 2000, color: "#3949AB" },
        { id: 4, name: "Snacks", amount: 2000, color: "#00ACC1" },
      ],
    };
  }

  return {
    timeline: "day",
    totalIncome: 2000,
    totalExpense: 700,
    incomeCategories: [
      { id: 1, name: "Salary", amount: 1500, color: "#4CAF50" },
      { id: 2, name: "Freelancing", amount: 300, color: "#2196F3" },
      { id: 3, name: "Investments", amount: 200, color: "#FFC107" },
    ],
    expenseCategories: [
      { id: 1, name: "Snacks", amount: 200, color: "#00ACC1" },
      { id: 2, name: "Coffee", amount: 150, color: "#FB8C00" },
      { id: 3, name: "Transport", amount: 350, color: "#E53935" },
    ],
  };
}
