import { BudgetResponse } from "../mock/budgetMock";
import BudgetCategoryCard from "./BudgetCategoryCard";
import BudgetHeader from "./BudgetHeader";
import BudgetTimeline from "./BudgetTimeline";

type Props = {
  data: BudgetResponse;
};

export default function BudgetView({ data }: Props) {
  const remaining = data.income - data.expense;

  return (
    <div className="mt-4 space-y-6">
      <BudgetHeader remaining={remaining} />

      <BudgetTimeline />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.categories.map((cat) => (
          <BudgetCategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
