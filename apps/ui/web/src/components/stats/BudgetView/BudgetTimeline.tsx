import { useState } from "react";

const filters = ["Daily", "Weekly", "Monthly", "Yearly"] as const;

export default function BudgetTimeline() {
  const [selected, setSelected] = useState<"Daily" | "Weekly" | "Monthly" | "Yearly">("Monthly");

  return (
    <div className="flex gap-3">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setSelected(f)}
          className={`px-3 py-1 rounded-full text-sm border ${
            selected === f ? "bg-black text-white" : ""
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
