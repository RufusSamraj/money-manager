import { useMemo, useState } from "react";
import { Card } from "../../components/card";
import { Badge } from "../../components/badge";
import { MoneyText } from "../../components/money-text";
import { ChevronLeft, ChevronRight, Filter, Search, Star } from "lucide-react";

export function TransactionsPage({ transactions }) {

  const [subTab, setSubTab] = useState('Daily');

  // ----------------------------------------------------------
  // NORMALIZE BACKEND DATA (Fixes: date, amount, category, account)
  // ----------------------------------------------------------
  const normalizedTransactions = useMemo(() => {
    return transactions.map(t => ({
      ...t,
      amount: Number(t.amount),             // numeric string -> number
      category: t.categoryName,             // backend -> UI name
      account: t.accountName,               // backend -> UI name
      date: t.date.split("T")[0],           // remove time, keep YYYY-MM-DD
    }));
  }, [transactions]);

  // ----------------------------------------------------------
  // GROUP TRANSACTIONS BY DAY
  // ----------------------------------------------------------
  const groupedTransactions = useMemo(() => {
    const grouped = {};

    normalizedTransactions.forEach(t => {
      const dateStr = t.date;
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(t);
    });

    return Object.entries(grouped)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [normalizedTransactions]);

  // ----------------------------------------------------------
  // MONTHLY TOTALS
  // ----------------------------------------------------------
  const monthlyIncome = normalizedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = normalizedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyTotal = monthlyIncome - monthlyExpense;

  // ----------------------------------------------------------
  // DATE GROUP COMPONENT
  // ----------------------------------------------------------
  const DateGroup = ({ date, items }) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' });

    const dailyIncome = items.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const dailyExpense = items.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

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
            {dailyIncome > 0 && <span className="text-sm text-blue-500 font-medium">{dailyIncome.toFixed(2)}</span>}
            {dailyExpense > 0 && <span className="text-sm text-red-500 font-medium">{dailyExpense.toFixed(2)}</span>}
          </div>
        </div>

        <div>
          {items.map((t, idx) => (
            <div
              key={t.id}
              className={`flex justify-between items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer 
                ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="text-sm text-gray-400 w-16 shrink-0">{t.category}</span>

                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {t.note || t.category}
                  </span>
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

  // ----------------------------------------------------------
  // CALENDAR GRID (unchanged)
  // ----------------------------------------------------------
  const CalendarGrid = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const startDayOffset = 2;

    return (
      <Card className="h-full flex flex-col" noPadding>
        <div className="grid grid-cols-7 text-center bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-2 text-xs font-semibold text-gray-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-gray-200 gap-px flex-1">
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-white min-h-[80px]" />
          ))}

          {days.map(day => {
            const isToday = false;

            return (
              <div
                key={day}
                className={`bg-white min-h-[80px] p-2 flex flex-col justify-between hover:bg-blue-50 cursor-pointer relative 
                  ${isToday ? 'bg-blue-50/50' : ''}`}
              >
                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full 
                  ${isToday ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  // ----------------------------------------------------------
  // UI LAYOUT
  // ----------------------------------------------------------
  return (
    <div className="flex flex-col h-full gap-4">

      {/* Header */}
      <Card className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"><ChevronLeft size={18} /></button>
          <span className="text-lg font-bold text-gray-800">Transactions</span>
          <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"><ChevronRight size={18} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600">
            <Search size={14} /> Search
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Star size={16} /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Filter size={16} /></button>
        </div>
      </Card>

      {/* Segmented Tabs */}
      <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
        {['Daily', 'Calendar', 'Weekly', 'Monthly', 'Summary'].map(tab => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`flex-1 py-1.5 rounded-md transition-all 
              ${subTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Monthly Summary */}
      <Card className="py-3">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Income</span>
            <span className="font-semibold text-blue-500">{monthlyIncome.toFixed(2)}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Expenses</span>
            <span className="font-semibold text-red-500">{monthlyExpense.toFixed(2)}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total</span>
            <span className="font-semibold text-gray-800">{monthlyTotal.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {subTab === 'Daily' ? (
          groupedTransactions.map(([date, items]) =>
            <DateGroup key={date} date={date} items={items} />
          )
        ) : subTab === 'Calendar' ? (
          <CalendarGrid />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Not implemented yet
          </div>
        )}
      </div>

    </div>
  );
}
