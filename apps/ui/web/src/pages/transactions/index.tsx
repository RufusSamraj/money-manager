import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/card";
import { Badge } from "../../components/badge";
import { MoneyText } from "../../components/money-text";
import { ChevronLeft, ChevronRight, Filter, Search, Star, X } from "lucide-react";

export function TransactionsPage() {


	const [transactions, setTransactions] = useState([]);

  useEffect(() => {
  async function loadData() {
    try {
		
      const [txRes] = await Promise.all([
        fetch("http://localhost:3000/api/transactions", {
      credentials: 'include'}),
      ]);

      setTransactions(await txRes.json());

    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }

  loadData();
}, []);

  const [subTab, setSubTab] = useState("Daily");
  const [expandedWeek, setExpandedWeek] = useState(null); // mondayKey like "2025-07-28"
   const [selectedDate, setSelectedDate] = useState(null);

   const [searchQuery, setSearchQuery] = useState("");
const [filterType, setFilterType] = useState(""); // income/expense/transfer
const [filterCategory, setFilterCategory] = useState("");
const [filterAccount, setFilterAccount] = useState("");


  //
  // ----------------------------------------------------------
  // 1) NORMALIZE BACKEND DATA
  // ----------------------------------------------------------
  //
  const normalizedTransactions = useMemo(() => {
    return transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
      category: t.categoryName,
      account: t.accountName,
      date: t.date.split("T")[0],
      month: t.date.slice(0, 7),
    }));
  }, [transactions]);

  //
  // ----------------------------------------------------------
  // 2) AVAILABLE MONTHS (for dropdown)
  // ----------------------------------------------------------
  //
  const availableMonths = useMemo(() => {
    const set = new Set(normalizedTransactions.map((t) => t.month));
    return Array.from(set).sort((a, b) => new Date(b + "-01") - new Date(a + "-01"));
  }, [normalizedTransactions]);

  //
  // ----------------------------------------------------------
  // 3) CURRENT MONTH STATE (default newest)
  // ----------------------------------------------------------
  //
//   const [currentMonth, setCurrentMonth] = useState(
//     availableMonths.length ? availableMonths[0] : null
//   );
const [currentMonth, setCurrentMonth] = useState(null);

useEffect(() => {
  if (!currentMonth && availableMonths.length > 0) {
    setCurrentMonth(availableMonths[0]);   // automatically pick newest month
  }
}, [availableMonths, currentMonth]);

// ----------------------------------------------------------
// GLOBAL FILTER PIPELINE (used everywhere)
// ----------------------------------------------------------
const filteredTransactions = useMemo(() => {
  let data = normalizedTransactions;

  // Search
  if (searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase();
    data = data.filter(t =>
      t.note?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q) ||
      t.account?.toLowerCase().includes(q) ||
      String(t.amount).includes(q) ||
      t.date.includes(q)
    );
  }

  // Type filter
  if (filterType) {
    data = data.filter(t => t.type === filterType);
  }

  // Category filter
  if (filterCategory) {
    data = data.filter(t => t.category === filterCategory);
  }

  // Account filter
  if (filterAccount) {
    data = data.filter(t => t.account === filterAccount);
  }

  return data;
}, [normalizedTransactions, searchQuery, filterType, filterCategory, filterAccount]);



  //
  // ----------------------------------------------------------
  // 4) FILTER TRANSACTIONS FOR SELECTED MONTH
  // ----------------------------------------------------------
  //
//   const monthTransactions = useMemo(() => {
//     if (!currentMonth) return [];
//     return normalizedTransactions.filter((tx) => tx.month === currentMonth);
//   }, [normalizedTransactions, currentMonth]);
const monthTransactions = useMemo(() => {
  return filteredTransactions.filter(t => t.month === currentMonth);
}, [filteredTransactions, currentMonth]);

  //
  // ----------------------------------------------------------
  // 5) MONTH LABEL HELPER
  // ----------------------------------------------------------
  //
  function monthLabel(monthKey) {
    if (!monthKey) return "";
    const date = new Date(monthKey + "-01");
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  //
  // ----------------------------------------------------------
  // 6) Prev / Next month helpers (using availableMonths)
  // ----------------------------------------------------------
  //
  function goToPreviousMonth() {
    const idx = availableMonths.indexOf(currentMonth);
    if (idx < availableMonths.length - 1) {
      setCurrentMonth(availableMonths[idx + 1]);
      setExpandedWeek(null);
    }
  }

  function goToNextMonth() {
    const idx = availableMonths.indexOf(currentMonth);
    if (idx > 0) {
      setCurrentMonth(availableMonths[idx - 1]);
      setExpandedWeek(null);
    }
  }

  //
  // ----------------------------------------------------------
  // 7) GROUP BY DAY (for Daily / Monthly expansion)
  // ----------------------------------------------------------
  //
  const groupedByDay = useMemo(() => {
    const grouped = {};
    monthTransactions.forEach((t) => {
      const dateKey = t.date;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(t);
    });
    return Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [monthTransactions]);

  //
  // ----------------------------------------------------------
  // 8) MONTHLY TOTALS (for selected month)
  // ----------------------------------------------------------
  //
  const monthlyIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyTotal = monthlyIncome - monthlyExpense;

  //
  // ----------------------------------------------------------
  // 9) DateGroup component (reusable)
  // ----------------------------------------------------------
  //
  const DateGroup = ({ date, items }) => {
    const d = new Date(date);
    const day = d.getDate();
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
    const formattedDate = d.toLocaleDateString("en-US", { year: "numeric", month: "2-digit" });

    const dailyIncome = items
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const dailyExpense = items
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    return (
      <Card noPadding className="mb-4">
        <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b border-gray-100">
          <div className="flex items-end gap-3">
            <span className="text-2xl font-extrabold text-gray-800 leading-none">{day}</span>
            <div className="flex flex-col gap-0 leading-tight">
              <Badge>{dayName}</Badge>
              <span className="text-[10px] text-gray-400 mt-1">{formattedDate}</span>
            </div>
          </div>

          <div className="flex gap-4">
            {dailyIncome > 0 && (
              <span className="text-sm text-blue-500 font-medium">{dailyIncome.toFixed(2)}</span>
            )}
            {dailyExpense > 0 && (
              <span className="text-sm text-red-500 font-medium">{dailyExpense.toFixed(2)}</span>
            )}
          </div>
        </div>

        <div>
          {items.map((t, idx) => (
            <div
              key={t.id}
              className={`flex justify-between items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                idx !== items.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="text-sm text-gray-400 w-16 shrink-0">{t.category}</span>

                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-gray-800 truncate">{t.note || t.category}</span>
                  <span className="text-xs text-gray-400 truncate">
                    {t.account} {t.toAccount && `→ ${t.toAccount}`}
                  </span>
                </div>
              </div>

              <MoneyText amount={t.amount} type={t.type} className="text-sm" />
            </div>
          ))}
        </div>
      </Card>
    );
  };

  //
  // ----------------------------------------------------------
  // 10) WEEKLY VIEW: helpers to compute Monday start and bounds
  // ----------------------------------------------------------
  //
  function getMonday(date) {
    // given a Date => return a new Date for the Monday of that week (Mon as first day)
    const d = new Date(date);
    const day = d.getDay(); // 0 Sun .. 6 Sat
    const diffToMonday = (day + 6) % 7; // 0->6 => 6 for Sun, 1 for Tue => 1
    const monday = new Date(d);
    monday.setDate(d.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  function monthBounds(monthKey) {
    const first = new Date(monthKey + "-01");
    first.setHours(0, 0, 0, 0);
    const next = new Date(first);
    next.setMonth(first.getMonth() + 1);
    next.setDate(0); // last day of month
    next.setHours(0, 0, 0, 0);
    return { first, last: next };
  }

  //
  // ----------------------------------------------------------
  // 11) BUILD WEEKS for current month (Monday-start)
  // returns [{ mondayKey, items, startLabel, endLabel, income, expense, total }]
  // ----------------------------------------------------------
  //
  const weeksInMonth = useMemo(() => {
    if (!currentMonth) return [];

    // map mondayKey => items
    const map = new Map();
    monthTransactions.forEach((t) => {
      const d = new Date(t.date);
      const monday = getMonday(d);
      const mondayKey = monday.toISOString().split("T")[0];
      if (!map.has(mondayKey)) map.set(mondayKey, []);
      map.get(mondayKey).push(t);
    });

    // sort monday keys descending (most recent week first)
    const mondayKeys = Array.from(map.keys()).sort((a, b) => new Date(b) - new Date(a));

    const { first: monthFirst, last: monthLast } = monthBounds(currentMonth);

    return mondayKeys.map((mKey) => {
      const items = map.get(mKey);

      // compute start/end shown in label: clip to month bounds
      const mondayDate = new Date(mKey);
      const sundayDate = new Date(mondayDate);
      sundayDate.setDate(mondayDate.getDate() + 6);

      const start = mondayDate < monthFirst ? monthFirst : mondayDate;
      const end = sundayDate > monthLast ? monthLast : sundayDate;

      const startLabel = `${start.toLocaleString("en-US", { month: "short" })} ${start.getDate()}`;
      const endLabel = `${end.toLocaleString("en-US", { month: "short" })} ${end.getDate()}`;

      const income = items.filter((x) => x.type === "income").reduce((s, x) => s + x.amount, 0);
      const expense = items.filter((x) => x.type === "expense").reduce((s, x) => s + x.amount, 0);
      const total = income - expense;

      return {
        mondayKey: mKey,
        items,
        startLabel,
        endLabel,
        income,
        expense,
        total,
      };
    });
  }, [monthTransactions, currentMonth]);

  //
  // ----------------------------------------------------------
  // 12) HELPER: buildDayGroups for a given set of items
  // returns [ [date, items], ... ] sorted desc
  // ----------------------------------------------------------
  //
  function buildDayGroups(items) {
    const byDay = {};
    items.forEach((t) => {
      const dayKey = t.date;
      if (!byDay[dayKey]) byDay[dayKey] = [];
      byDay[dayKey].push(t);
    });
    return Object.entries(byDay).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }

    const DayModalRow = ({ t }) => (
    <div className="flex justify-between items-center p-3 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <div className="w-12">
          <span className="block text-xs text-gray-400">{t.category}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">{t.note || t.category}</span>
          <span className="text-xs text-gray-400">{t.account} {t.toAccount && `→ ${t.toAccount}`}</span>
        </div>
      </div>
      <MoneyText amount={t.amount} type={t.type} className="text-sm" />
    </div>
  );

  // ----------------------------------------------------------
  // Calendar generation (Monday-first)
  // ----------------------------------------------------------
  // returns an object { weeks: Array<Array<cell>>, daysInMonth, firstDayIndex }
  // where cell is either null (empty) or { day, dateKey, totals: { income, expense } }
  const calendarForMonth = useMemo(() => {
    if (!currentMonth) return { weeks: [], daysInMonth: 0, firstDayIndex: 0 };

    const [y, m] = currentMonth.split("-").map(Number);
    const firstOfMonth = new Date(y, m - 1, 1);
    const lastOfMonth = new Date(y, m, 0);
    const daysInMonth = lastOfMonth.getDate();

    // Monday-first index: convert JS getDay() (0=Sun..6=Sat) to Monday-first index 0..6
    const firstDayIndex = (firstOfMonth.getDay() + 6) % 7; // 0 => Monday

    // create an array of day cells including leading blanks
    const cells = [];
    // leading empty cells for days before 1st
    for (let i = 0; i < firstDayIndex; i++) cells.push(null);

    // fill days
    for (let day = 1; day <= daysInMonth; day++) {
      const dd = String(day).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const dateKey = `${y}-${mm}-${dd}`;
      // compute totals for the day
      const dayTx = monthTransactions.filter(tx => tx.date === dateKey);
      const income = dayTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expense = dayTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

      cells.push({ day, dateKey, totals: { income, expense }, tx: dayTx });
    }

    // trailing blanks to fill last week
    while (cells.length % 7 !== 0) cells.push(null);

    // chunk into weeks (array of 7)
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return { weeks, daysInMonth, firstDayIndex };
  }, [currentMonth, monthTransactions]);

  // helpers: today and compare
  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  // ----------------------------------------------------------
  // Modal: transactions for selectedDate (array)
  // ----------------------------------------------------------
  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];
    return monthTransactions.filter(t => t.date === selectedDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedDate, monthTransactions]);

  // ----------------------------------------------------------
  // Small helper to format currency label for cell
  // (keeps UI compact)
  // ----------------------------------------------------------
  function tinyLabel(n) {
    if (!n) return null;
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toFixed(0);
  }

  // ----------------------------------------------------------
  // Calendar cell UI component
  // ----------------------------------------------------------
  const CalendarCell = ({ cell }) => {
    if (!cell) return <div className="bg-white min-h-[88px] p-2" />;

    const { day, dateKey, totals, tx } = cell;
    const isToday = dateKey === todayKey;
    const isSelected = dateKey === selectedDate;

    return (
      <div
        onClick={() => setSelectedDate(dateKey)}
        className={`bg-white min-h-[88px] p-2 flex flex-col justify-between cursor-pointer relative transition-colors
          ${isSelected ? "ring-2 ring-blue-200/60" : ""}
          ${isToday ? "shadow-sm" : ""}
          hover:bg-blue-50`}
      >
        <div className="flex items-start justify-between gap-2">
          <span className={`text-xs font-medium ${isToday ? "text-blue-700" : "text-gray-600"}`}>{day}</span>
          <span className="text-[10px] text-gray-400">{tx.length}</span>
        </div>

        <div className="flex flex-col items-end gap-1">
          {/* show small badges for totals (compact) */}
          <div className="flex flex-col items-end gap-0.5">
            {totals.income > 0 && (
              <div className="text-[10px] font-semibold text-blue-600">{tinyLabel(totals.income)}</div>
            )}
            {totals.expense > 0 && (
              <div className="text-[10px] font-semibold text-red-600">-{tinyLabel(totals.expense)}</div>
            )}
          </div>

          {/* small color dots */}
          <div className="flex gap-1 mt-1">
            {totals.income > 0 && <div title={`Income ${totals.income.toFixed(2)}`} className="w-2 h-2 rounded-full bg-blue-500" />}
            {totals.expense > 0 && <div title={`Expense ${totals.expense.toFixed(2)}`} className="w-2 h-2 rounded-full bg-red-500" />}
          </div>
        </div>
      </div>
    );
  };

   function DateModal({ dateKey, onClose }) {
    if (!dateKey) return null;
    const d = new Date(dateKey);
    const pretty = d.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <div className="text-sm font-medium text-gray-800">{pretty}</div>
              <div className="text-xs text-gray-400">{selectedDayTransactions.length} transactions</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { onClose(); }} className="p-1 hover:bg-gray-100 rounded-full text-gray-600"><X size={18} /></button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {selectedDayTransactions.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No transactions</div>
            ) : (
              selectedDayTransactions.map(t => <DayModalRow key={t.id} t={t} />)
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
            <button onClick={() => onClose()} className="px-3 py-2 bg-gray-100 rounded-md text-sm">Close</button>
          </div>
        </div>
      </div>
    );
  }

  //
  // ----------------------------------------------------------
  // 13) CALENDAR GRID (simple placeholder)
  // ----------------------------------------------------------
  //
  const CalendarGrid = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const startOffset = 2;

    return (
      <Card className="h-full flex flex-col" noPadding>
        <div className="grid grid-cols-7 text-center bg-gray-50 border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2 text-xs font-semibold text-gray-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-gray-200 gap-px flex-1">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={i} className="bg-white min-h-[80px]" />
          ))}

          {days.map((day) => (
            <div key={day} className="bg-white min-h-[80px] p-2 hover:bg-blue-50">
              <span className="text-xs font-medium text-gray-500">{day}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  //
  // ----------------------------------------------------------
  // 14) MONTHLY VIEW (reuse groupedByDay)
  // ----------------------------------------------------------
  //
  const MonthlyView = () => {
    return (
      <div className="flex flex-col gap-4">
        {groupedByDay.map(([date, items]) => (
          <DateGroup key={date} date={date} items={items} />
        ))}
      </div>
    );
  };

  // ----------------------------------------------------------
// MONTHLY SUMMARY ANALYTICS (Option C)
// ----------------------------------------------------------
const monthlySummary = useMemo(() => {
  if (!currentMonth) return null;

  const items = monthTransactions;

  // Group by category
  const categoryTotals = {};
  items.forEach(tx => {
    const cat = tx.category || "Uncategorized";
    if (!categoryTotals[cat]) categoryTotals[cat] = 0;
    categoryTotals[cat] += tx.amount * (tx.type === "expense" ? -1 : 1);
  });

  // Convert to sorted list (largest spending first)
  const categoryList = Object.entries(categoryTotals)
    .map(([cat, total]) => ({ category: cat, total }))
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

  // Highest categories
  const biggestExpense = categoryList.filter(c => c.total < 0)[0] || null;
  const biggestIncome = categoryList.filter(c => c.total > 0)[0] || null;

  // Average daily spend
  const daysInMonth = new Date(currentMonth + "-01");
  const totalDays = new Date(daysInMonth.getFullYear(), daysInMonth.getMonth() + 1, 0).getDate();
  const avgDaily = monthTransactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0) / totalDays;

  // Compare to previous month
  const idx = availableMonths.indexOf(currentMonth);
  let prevNet = 0;
  if (idx < availableMonths.length - 1) {
    const prevMonth = availableMonths[idx + 1];
    const prevTx = normalizedTransactions.filter(t => t.month === prevMonth);
    const prevIncome = prevTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const prevExpense = prevTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    prevNet = prevIncome - prevExpense;
  }

  return {
    categoryList,
    biggestExpense,
    biggestIncome,
    avgDaily,
    prevNet
  };
}, [monthTransactions, normalizedTransactions, currentMonth, availableMonths]);


  const SummaryView = () => {
  if (!monthlySummary) return null;

  const {
    categoryList,
    biggestExpense,
    biggestIncome,
    avgDaily,
    prevNet,
  } = monthlySummary;

  const trend = monthlyTotal - prevNet;
  const trendColor = trend >= 0 ? "text-green-500" : "text-red-500";
  const trendArrow = trend >= 0 ? "↑" : "↓";

  return (
    <div className="flex flex-col gap-4">

      {/* Net Summary */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              Net: {monthlyTotal.toFixed(2)}
            </h3>
            <p className="text-gray-400 text-xs">
              Compared to last month
            </p>
          </div>

          <div className={`text-xl font-bold ${trendColor}`}>
            {trendArrow} {Math.abs(trend).toFixed(2)}
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="p-4">
        <h3 className="text-sm font-bold text-gray-600 mb-3">Category Breakdown</h3>

        <div className="flex flex-col gap-2">
          {categoryList.map((c) => (
            <div key={c.category}>
              <div className="flex justify-between text-sm font-medium">
                <span>{c.category}</span>
                <span className={c.total < 0 ? "text-red-500" : "text-blue-500"}>
                  {c.total.toFixed(2)}
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${
                    c.total < 0 ? "bg-red-400" : "bg-blue-400"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (Math.abs(c.total) /
                        Math.max(...categoryList.map((c) => Math.abs(c.total)))) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-4">
        <h3 className="text-sm font-bold text-gray-600 mb-3">Insights</h3>

        <div className="flex flex-col gap-2 text-sm">

          {biggestExpense && (
            <div>
              <span className="font-semibold text-red-500">Biggest Expense:</span>{" "}
              {biggestExpense.category} ({biggestExpense.total.toFixed(2)})
            </div>
          )}

          {biggestIncome && (
            <div>
              <span className="font-semibold text-blue-500">Top Income:</span>{" "}
              {biggestIncome.category} ({biggestIncome.total.toFixed(2)})
            </div>
          )}

          <div>
            <span className="font-semibold text-gray-600">Avg Daily Spend:</span>{" "}
            {avgDaily.toFixed(2)}
          </div>

          <div>
            <span className="font-semibold text-gray-600">Total Transactions:</span>{" "}
            {monthTransactions.length}
          </div>
        </div>
      </Card>
    </div>
  );
};



  //
  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  //
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <Card className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500" onClick={goToPreviousMonth}>
            <ChevronLeft size={18} />
          </button>

          <select
            className="text-lg font-bold text-gray-800 bg-transparent"
            value={currentMonth || ""}
            onChange={(e) => { setCurrentMonth(e.target.value); setExpandedWeek(null); }}
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>{monthLabel(m)}</option>
            ))}
          </select>

          <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500" onClick={goToNextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
            <Search size={14} /> Search
          </button> */}
          <div className="flex items-center gap-2">
  {/* Search Box */}
  <div className="relative">
    <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-8 pr-3 py-1.5 bg-gray-100 rounded-full text-xs outline-none w-40 focus:w-56 transition-all"
    />
  </div>

  {/* Type filter */}
  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
    className="px-2 py-1.5 text-xs rounded-full bg-gray-100"
  >
    <option value="">Type</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
    <option value="transfer">Transfer</option>
  </select>

  {/* Category filter */}
  <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    className="px-2 py-1.5 text-xs rounded-full bg-gray-100"
  >
    <option value="">Category</option>
    {Array.from(new Set(normalizedTransactions.map(t => t.category))).map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>

  {/* Account filter */}
  <select
    value={filterAccount}
    onChange={(e) => setFilterAccount(e.target.value)}
    className="px-2 py-1.5 text-xs rounded-full bg-gray-100"
  >
    <option value="">Account</option>
    {Array.from(new Set(normalizedTransactions.map(t => t.account))).map(acc => (
      <option key={acc} value={acc}>{acc}</option>
    ))}
  </select>
</div>

          {/* <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Star size={16} /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Filter size={16} /></button> */}
        </div>
      </Card>

      {/* Tabs */}
      <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
        {["Daily", "Calendar", "Weekly", "Summary"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`flex-1 py-1.5 rounded-md transition-all ${subTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Summary */}
      <Card className="py-3">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Income</span>
            <span className="font-semibold text-blue-500">{monthlyIncome.toFixed(2)}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Expenses</span>
            <span className="font-semibold text-red-500">{monthlyExpense.toFixed(2)}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
            <span className="font-semibold text-gray-800">{monthlyTotal.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {subTab === "Daily" ? (
          groupedByDay.length ? (
            groupedByDay.map(([date, items]) => <DateGroup key={date} date={date} items={items} />)
          ) : (
            <div className="text-center text-gray-400 mt-20">No transactions</div>
          )
        ) : subTab === "Weekly" ? (
          <div className="flex flex-col gap-4">
            {weeksInMonth.length ? weeksInMonth.map((wk) => {
              const expanded = expandedWeek === wk.mondayKey;
              return (
                <div key={wk.mondayKey}>
                  <Card noPadding className="mb-2">
                    <div
                      className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedWeek(expanded ? null : wk.mondayKey)}
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {wk.startLabel} — {wk.endLabel}
                        </div>
                        <div className="text-xs text-gray-400">{wk.items.length} transactions</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-sm text-blue-500 font-medium">{wk.income.toFixed(2)}</div>
                        <div className="text-sm text-red-500 font-medium">{wk.expense.toFixed(2)}</div>
                        <div className="text-sm text-gray-800 font-semibold">{wk.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>

                  {expanded && (
                    <div className="pl-2">
                      {buildDayGroups(wk.items).map(([date, items]) => (
                        <DateGroup key={date} date={date} items={items} />
                      ))}
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="text-center text-gray-400 mt-20">No transactions</div>
            )}
          </div>
        ) : subTab === "Summary" ? (
  <SummaryView />
): subTab === "Calendar" ? (
          <div className="space-y-4">

            {/* weekday headers (Mon..Sun) */}
            <Card noPadding>
              <div className="grid grid-cols-7 text-center bg-gray-50 border-b">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                  <div key={d} className="py-2 text-xs font-semibold text-gray-400">{d}</div>
                ))}
              </div>

              {/* weeks */}
              <div className="grid grid-cols-7 bg-gray-200 gap-px">
                {calendarForMonth.weeks.length === 0 ? (
                  <div className="col-span-7 p-6 text-center text-gray-400">No data for this month</div>
                ) : calendarForMonth.weeks.map((week, wi) => (
                  <div key={wi} className="contents">
                    {week.map((cell, ci) => (
                      <div key={ci} className="p-0">
                        <CalendarCell cell={cell} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>

            {/* small legend */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Income</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Expense</div>
            </div>
          </div>
        ): (
          <div className="text-center text-gray-400 mt-20">Not implemented yet</div>
        )}
      </div>
      {selectedDate && <DateModal dateKey={selectedDate} onClose={() => setSelectedDate(null)} />}
    </div>
  );
}
