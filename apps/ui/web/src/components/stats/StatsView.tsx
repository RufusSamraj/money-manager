import BudgetView from "./BudgetView/BudgetView";
import StatsTabs from "./StatsTabs";
import StatsView from "./StatsView";
import { mockBudgetResponse } from "./mock/budgetMock";
import { mockStatsResponse } from "./mock/stats";
import { useState } from "react";

export default function StatsIndex() {
  const [tab, setTab] = useState<"stats" | "budget">("stats");

  return (
    <div className="p-4">
      <StatsTabs tab={tab} setTab={setTab} />

      {tab === "stats" && <StatsView data={mockStatsResponse} />}
      {tab === "budget" && <BudgetView data={mockBudgetResponse} />}
    </div>
  );
}
