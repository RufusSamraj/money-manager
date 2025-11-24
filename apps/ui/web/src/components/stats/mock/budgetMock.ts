export type BudgetCategory = {
  id: string;
  category: string;
  allocated: number;
  spent: number;
};

export type BudgetResponse = {
  income: number;
  expense: number;
  categories: BudgetCategory[];
};

export const mockBudgetResponse: BudgetResponse = {
  income: 200000,
  expense: 120000,
  categories: [
    {
      id: "1",
      category: "Food",
      allocated: 15000,
      spent: 9800,
    },
    {
      id: "2",
      category: "Transport",
      allocated: 8000,
      spent: 4200,
    },
    {
      id: "3",
      category: "Shopping",
      allocated: 20000,
      spent: 11000,
    },
    {
      id: "4",
      category: "Rent",
      allocated: 30000,
      spent: 30000,
    },
  ],
};
