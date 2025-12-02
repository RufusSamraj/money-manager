import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../../components/card";
import { Badge } from "../../components/badge";
import { COLORS } from "../../constants";

/**
 * Props:
 *   - statsTransactions: all transactions from /api/transactions
 *   - categories: all categories from /api/categories
 *
 * Required fields in each transaction:
 *   - amount
 *   - type
 *   - categoryName
 *   - date
 */

export function StatsPage() {

	const [statsTransactions, setTransactions] = useState([]);
	const [categories, setCategories] = useState([]);
  	useEffect(() => {
  async function loadData() {
    try {
		
      const [txRes, catRes] = await Promise.all([
        fetch("http://localhost:3000/api/transactions", {
      credentials: 'include'}),
        fetch("http://localhost:3000/api/categories", {
      credentials: 'include'})
      ]);

      setTransactions(await txRes.json());
      setCategories(await catRes.json());

    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }

  loadData();
}, []);
  const [mode, setMode] = useState("Stats");

  // ----------------------------------------------------------
  // Normalize data
  // ----------------------------------------------------------
  const normalizedTx = useMemo(() => {
    if (!statsTransactions) return [];
    return statsTransactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
      date: t.date.split("T")[0],     // YYYY-MM-DD
      month: t.date.slice(0, 7),      // YYYY-MM
    }));
  }, [statsTransactions]);

  // ----------------------------------------------------------
  // Extract available months
  // ----------------------------------------------------------
  const availableMonths = useMemo(() => {
    const set = new Set(normalizedTx.map((t) => t.month));
    return Array.from(set).sort((a, b) => new Date(b) - new Date(a));
  }, [normalizedTx]);

  // Default to latest month
  const [currentMonth, setCurrentMonth] = useState(null);

  useEffect(() => {
    if (!currentMonth && availableMonths.length > 0) {
      setCurrentMonth(availableMonths[0]);
    }
  }, [availableMonths, currentMonth]);

  // ----------------------------------------------------------
  // Filter for the active month
  // ----------------------------------------------------------
  const monthTx = useMemo(() => {
    if (!currentMonth) return [];
    return normalizedTx.filter((t) => t.month === currentMonth);
  }, [normalizedTx, currentMonth]);

  // ----------------------------------------------------------
  // Calculate category totals for this month
  // ----------------------------------------------------------
  const categoryTotals = useMemo(() => {
    const totals = {};

    monthTx.forEach((t) => {
      if (!t.categoryName) return;

      if (!totals[t.categoryName]) {
        totals[t.categoryName] = {
          name: t.categoryName,
          amount: 0,
        };
      }

      // Only count EXPENSES for category stats
      if (t.type === "expense") {
        totals[t.categoryName].amount += t.amount;
      }
    });

    return Object.values(totals);
  }, [monthTx]);

  // Sum total expenses for pie
  const totalExpense = categoryTotals.reduce((a, c) => a + c.amount, 0);

  // ----------------------------------------------------------
  // Pie chart slice calculations
  // ----------------------------------------------------------
  const slices = useMemo(() => {
    let accumulatedAngle = 0;

    return categoryTotals.map((cat) => {
      const percentage = totalExpense ? cat.amount / totalExpense : 0;
      const angle = percentage * 360;

      const x1 = 50 + 50 * Math.cos(Math.PI * (accumulatedAngle - 90) / 180);
      const y1 = 50 + 50 * Math.sin(Math.PI * (accumulatedAngle - 90) / 180);
      const x2 = 50 + 50 * Math.cos(Math.PI * (accumulatedAngle + angle - 90) / 180);
      const y2 = 50 + 50 * Math.sin(Math.PI * (accumulatedAngle + angle - 90) / 180);

      const largeArc = percentage > 0.5 ? 1 : 0;

      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

      accumulatedAngle += angle;

      // assign color based on position (or category index)
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      return {
        ...cat,
        percentage,
        pathData,
        color,
      };
    });
  }, [categoryTotals, totalExpense]);

  // fallback color palette
  // const COLORS = [
  //   "#FF6B6B", "#4ECDC4", "#556270", "#C7F464",
  //   "#C44DFF", "#FFA600", "#00A8E8", "#E84A5F"
  // ];

  // ----------------------------------------------------------
  // Month label
  // ----------------------------------------------------------
  const monthLabel = (m) => {
    if (!m) return "";
    const d = new Date(m + "-01");
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const goPrev = () => {
    const idx = availableMonths.indexOf(currentMonth);
    if (idx < availableMonths.length - 1) setCurrentMonth(availableMonths[idx + 1]);
  };

  const goNext = () => {
    const idx = availableMonths.indexOf(currentMonth);
    if (idx > 0) setCurrentMonth(availableMonths[idx - 1]);
  };

  return (
    <div className="flex flex-col h-full gap-4">

      {/* TOP BAR */}
      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
        <div className="bg-gray-100 p-1 rounded-md flex">
          {["Stats", "Note"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1 text-xs font-medium rounded transition-all ${
                mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600" onClick={goPrev}>
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-gray-700">{monthLabel(currentMonth)}</span>
          <button className="text-gray-400 hover:text-gray-600" onClick={goNext}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* MODE 1: CATEGORY STATS (Pie + List) */}
      {mode === "Stats" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT: PIE */}
          <Card className="md:col-span-5 flex items-center justify-center p-8">
            <div className="relative w-56 h-56">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {slices.length === 1 ? (
    <circle
      cx="50"
      cy="50"
      r="50"
      fill={slices[0].color}
      stroke="#fff"
      strokeWidth={1}
    />
  ) : (
    slices.map((slice, i) => (
      <path key={i} d={slice.pathData} fill={slice.color} stroke="#fff" />
    ))
  )}
                <circle cx="50" cy="50" r="15" fill="white" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-400">TOTAL</span>
              </div>
            </div>
          </Card>

          {/* RIGHT: LIST */}
          <Card className="md:col-span-7" noPadding>
            {categoryTotals.map((cat) => {
              const pct = totalExpense ? (cat.amount / totalExpense) * 100 : 0;

              return (
                <div
                  key={cat.name}
                  className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">

                    {/* Color bubble with pct% */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: slices.find(s => s.name === cat.name)?.color }}
                    >
                      {pct.toFixed(1)}%
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      {cat.name}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    ₹ {cat.amount.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* MODE 2: BUDGET (Simple dynamic showcase) */}
      {mode === "Budget" && (
        <Card className="max-w-3xl mx-auto w-full p-6">
          <div className="text-center text-gray-400 text-sm">
            Budget system not implemented yet — but it will use real category totals.
          </div>
        </Card>
      )}
    </div>
  );
}
