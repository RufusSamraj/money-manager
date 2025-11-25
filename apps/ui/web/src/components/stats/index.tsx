import BudgetView from "./BudgetView/BudgetView";
import StatsView from "./StatsView";
import { mockBudgetResponse } from "./mock/budgetMock";
// import { mockStatsResponse } from "./mock/stats";
import { useState } from "react";

export default function StatsTab() {
  const [tab, setTab] = useState<"stats" | "budget">("stats");

  return (
    <div className="p-4">
      <div className="flex gap-4 border-b pb-2">
        <button
          className={`pb-1 ${tab === "stats" ? "border-b-2 border-black" : ""}`}
          onClick={() => setTab("stats")}
        >
          Stats
        </button>

        <button
          className={`pb-1 ${tab === "budget" ? "border-b-2 border-black" : ""}`}
          onClick={() => setTab("budget")}
        >
          Budget
        </button>
      </div>

      {/* {tab === "stats" && <StatsView data={mockStatsResponse} />} */}
      {tab === "budget" && <BudgetView data={mockBudgetResponse} />}
    </div>
  );
}
