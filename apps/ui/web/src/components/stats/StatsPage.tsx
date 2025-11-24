import { useEffect, useState } from "react";

import ReportTimeline from "./ReportTimeline";
import StatsTabs from "./StatsTabs";
import { getMockStats, StatsResponse } from "./mock/stats";

export default function StatsPage() {
  const [timeline, setTimeline] = useState<"year" | "month" | "week" | "day">("month");
  const [data, setData] = useState<StatsResponse | null>(null);

  useEffect(() => {
    const response = getMockStats(timeline);
    setData(response);
  }, [timeline]);

  return (
    <div className="p-6 flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Statistics</h1>

      {/* Timeline Filter */}
      <ReportTimeline onChange={setTimeline} />

      {/* Pass data to StatsTabs */}
      {data && <StatsTabs data={data} />}
    </div>
  );
}
