import { useState } from "react";

type TimelineType = "year" | "month" | "week" | "day";

interface Props {
  onChange: (type: TimelineType) => void;
}

export default function ReportTimeline({ onChange }: Props) {
  const [active, setActive] = useState<TimelineType>("month");

  const timelineOptions: { label: string; value: TimelineType }[] = [
    { label: "Yearly", value: "year" },
    { label: "Monthly", value: "month" },
    { label: "Weekly", value: "week" },
    { label: "Daily", value: "day" },
  ];

  const handleSelect = (value: TimelineType) => {
    setActive(value);
    onChange(value);
  };

  return (
    <div className="flex gap-3 bg-gray-100 p-2 rounded-xl w-fit">
      {timelineOptions.map((item) => (
        <button
          key={item.value}
          onClick={() => handleSelect(item.value)}
          className={`px-5 py-2 rounded-lg font-medium transition-all text-sm
            ${
              active === item.value
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
