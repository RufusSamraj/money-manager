import { BudgetCategory } from "../mock/budgetMock";

export default function BudgetCategoryCard({ category }: { category: BudgetCategory }) {
  const percent = Math.min((category.spent / category.allocated) * 100, 100);

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <div className="font-semibold">{category.category}</div>

      <div className="mt-2">
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-black rounded-full" style={{ width: `${percent}%` }} />
        </div>
        <div className="text-sm mt-1">
          {percent.toFixed(0)}% used — ₹{category.spent.toLocaleString()} / ₹
          {category.allocated.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
