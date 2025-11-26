import React, { useState, useMemo } from 'react';
import { 
  Search, Star, SlidersHorizontal, ChevronLeft, ChevronRight, 
  LayoutDashboard, PieChart, CreditCard, Settings, Plus, Wallet, 
  Edit2, Filter, X, Check
} from 'lucide-react';

/**
 * MONEY MANAGER APP - WEB DASHBOARD (Tailwind Version)
 * * Features:
 * - Professional Sidebar Layout
 * - Polished UI/UX mimicking high-end component libraries
 * - Interactive Modals & Inputs
 * - "Segmented Control" style tabs
 * - Pure Frontend with Mock Data
 */

// --- Constants & Mock Data ---

const COLORS = {
  expense: '#ff5252',
  income: '#2196f3',
  categoryColors: {
    Food: '#ffcc00',
    Transportation: '#ff9800',
    Shopping: '#e91e63',
    Health: '#cddc39',
    Entertainment: '#9c27b0',
    Housing: '#009688',
    Salary: '#2196f3',
    Gift: '#ffeb3b'
  }
};

const INITIAL_TRANSACTIONS = [
  { id: 1, type: 'expense', date: '2025-07-29', category: 'Food', account: 'Cash', note: 'Brunch with Daniel', amount: 34.39 },
  { id: 2, type: 'expense', date: '2025-07-28', category: 'Shopping', account: 'Credit Card', note: 'IKEA Wardrobe', amount: 315.48 },
  { id: 3, type: 'transfer', date: '2025-07-27', category: 'Transfer', account: 'Bank', toAccount: 'Travel Fund', note: 'Minimum fees', amount: 80.00 },
  { id: 4, type: 'expense', date: '2025-07-24', category: 'Housing', account: 'Bank', note: 'Rent', amount: 1200.00 },
  { id: 5, type: 'income', date: '2025-07-22', category: 'Salary', account: 'Bank', note: 'July Salary', amount: 4500.00 },
  { id: 6, type: 'expense', date: '2025-07-22', category: 'Transportation', account: 'Debit Card', note: 'Gas', amount: 45.00 },
  { id: 7, type: 'expense', date: '2025-07-20', category: 'Entertainment', account: 'Cash', note: 'Movies', amount: 25.00 },
  { id: 8, type: 'expense', date: '2025-07-20', category: 'Food', account: 'Cash', note: 'Groceries', amount: 124.50 },
];

const ACCOUNTS_DATA = {
  assets: 6628.12,
  liabilities: 2082.42,
  total: 4545.70,
  groups: [
    { title: 'Cash', items: [{ name: 'Cash', amount: 68.45 }] },
    { title: 'Accounts', items: [{ name: 'Bank Main', amount: 2768.66 }, { name: 'Savings', amount: 1613.61 }] },
    { title: 'Cards', items: [{ name: 'Credit Card', amount: -1076.39, type: 'liability' }] }
  ]
};

const CATEGORY_STATS = [
  { name: 'Food', amount: 250.00, budget: 300, color: COLORS.categoryColors.Food },
  { name: 'Shopping', amount: 465.48, budget: 400, color: COLORS.categoryColors.Shopping },
  { name: 'Housing', amount: 1200.00, budget: 1200, color: COLORS.categoryColors.Housing },
  { name: 'Transp.', amount: 45.00, budget: 100, color: COLORS.categoryColors.Transportation },
  { name: 'Entert.', amount: 25.00, budget: 50, color: COLORS.categoryColors.Entertainment },
];

// --- Helper Components ---

const MoneyText = ({ amount, type, className = '' }) => {
  const isExpense = type === 'expense' || (type === undefined && amount < 0);
  const colorClass = type === 'income' ? 'text-blue-500' : type === 'transfer' ? 'text-gray-500' : 'text-red-500';
  
  return (
    <span className={`font-medium ${colorClass} ${className} whitespace-nowrap`}>
      {type === 'expense' ? '- ' : ''}$ {Math.abs(amount).toFixed(2)}
    </span>
  );
};

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${noPadding ? '' : 'p-4'} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

// --- Views ---

const TransactionsView = ({ transactions }) => {
  const [subTab, setSubTab] = useState('Daily');
  
  const groupedTransactions = useMemo(() => {
    const grouped = {};
    transactions.forEach(t => {
      const dateStr = t.date;
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(t);
    });
    return Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [transactions]);

  const monthlyIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const monthlyTotal = monthlyIncome - monthlyExpense;

  const DateGroup = ({ date, items }) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' });

    const dailyIncome = items.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const dailyExpense = items.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

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
              className={`flex justify-between items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''}`}
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
          {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`} className="bg-white min-h-[80px]" />)}
          {days.map(day => {
            const hasData = [20, 22, 24, 28, 29].includes(day);
            const isToday = day === 29;
            return (
              <div 
                key={day} 
                className={`bg-white min-h-[80px] p-2 flex flex-col justify-between hover:bg-blue-50 cursor-pointer relative ${isToday ? 'bg-blue-50/50' : ''}`}
              >
                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>
                  {day}
                </span>
                {hasData && (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[10px] text-blue-500 font-medium">450</span>
                    <span className="text-[10px] text-red-500 font-medium">120</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header Controls */}
      <Card className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
           <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"><ChevronLeft size={18} /></button>
           <span className="text-lg font-bold text-gray-800">Jul 2025</span>
           <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"><ChevronRight size={18} /></button>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 transition-colors">
             <Search size={14} /> Search
           </button>
           <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Star size={16} /></button>
           <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Filter size={16} /></button>
        </div>
      </Card>

      {/* Segmented Control Tabs */}
      <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
        {['Daily', 'Calendar', 'Weekly', 'Monthly', 'Summary'].map(tab => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              subTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {subTab === 'Daily' ? (
          groupedTransactions.map(([date, items]) => (
            <DateGroup key={date} date={date} items={items} />
          ))
        ) : subTab === 'Calendar' ? (
          <CalendarGrid />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Not implemented in this demo
          </div>
        )}
      </div>
    </div>
  );
};

const StatsView = () => {
  const [mode, setMode] = useState('Stats');
  
  const total = CATEGORY_STATS.reduce((acc, curr) => acc + curr.amount, 0);
  let accumulatedAngle = 0;

  const slices = CATEGORY_STATS.map((cat) => {
    const percentage = cat.amount / total;
    const angle = percentage * 360;
    const x1 = 50 + 50 * Math.cos(Math.PI * (accumulatedAngle - 90) / 180);
    const y1 = 50 + 50 * Math.sin(Math.PI * (accumulatedAngle - 90) / 180);
    const x2 = 50 + 50 * Math.cos(Math.PI * (accumulatedAngle + angle - 90) / 180);
    const y2 = 50 + 50 * Math.sin(Math.PI * (accumulatedAngle + angle - 90) / 180);
    const largeArc = percentage > 0.5 ? 1 : 0;
    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
    accumulatedAngle += angle;
    return { ...cat, pathData, percentage };
  });

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
         <div className="bg-gray-100 p-1 rounded-md flex">
           {['Stats', 'Budget', 'Note'].map(m => (
             <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1 text-xs font-medium rounded transition-all ${
                  mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
             >
               {m}
             </button>
           ))}
         </div>
         <div className="flex items-center gap-2">
           <button className="text-gray-400 hover:text-gray-600"><ChevronLeft size={16} /></button>
           <span className="text-sm font-medium text-gray-700">Jul 2025</span>
           <button className="text-gray-400 hover:text-gray-600"><ChevronRight size={16} /></button>
         </div>
      </div>

      {mode === 'Stats' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-5 flex items-center justify-center p-8">
             <div className="relative w-56 h-56">
                <svg viewBox="0 0 100 100" className="w-full h-full transform hover:scale-105 transition-transform duration-300">
                  {slices.map((slice, i) => (
                    <path key={i} d={slice.pathData} fill={slice.color} stroke="#fff" strokeWidth="1" />
                  ))}
                  <circle cx="50" cy="50" r="15" fill="white" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL</span>
                </div>
             </div>
          </Card>
          
          <Card className="md:col-span-7" noPadding>
             {CATEGORY_STATS.map((cat, i) => {
                const pct = ((cat.amount / total) * 100).toFixed(1);
                return (
                  <div key={cat.name} className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ backgroundColor: cat.color }}>
                         {pct}%
                       </div>
                       <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                     </div>
                     <span className="text-sm font-semibold text-gray-800">$ {cat.amount.toFixed(2)}</span>
                  </div>
                );
             })}
          </Card>
        </div>
      )}

      {mode === 'Budget' && (
        <Card className="max-w-3xl mx-auto w-full p-6">
           <div className="flex justify-between items-end mb-8">
             <div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Remaining (Monthly)</span>
               <div className="text-3xl font-bold text-gray-900 leading-tight mt-1">- $ 26.00</div>
             </div>
             <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 flex items-center gap-1 transition-colors">
               Budget Setting <ChevronRight size={12}/>
             </button>
           </div>

           <div className="space-y-6">
             {CATEGORY_STATS.map((cat) => {
               const percent = Math.min((cat.amount / cat.budget) * 100, 100);
               const isOver = cat.amount > cat.budget;
               
               return (
                 <div key={cat.name}>
                   <div className="flex justify-between items-center mb-1.5">
                     <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                     <Badge color={isOver ? 'red' : 'blue'}>
                       {Math.round((cat.amount / cat.budget) * 100)}%
                     </Badge>
                   </div>
                   <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-blue-500'}`} 
                        style={{ width: `${percent}%` }}
                      />
                   </div>
                   <div className="flex justify-between text-xs text-gray-400">
                     <span>$ {cat.amount.toFixed(2)}</span>
                     <span>Left: $ {(cat.budget - cat.amount).toFixed(2)}</span>
                   </div>
                 </div>
               );
             })}
           </div>
        </Card>
      )}
    </div>
  );
};

const AccountsView = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Accounts</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-700 shadow-sm transition-colors">
            <Edit2 size={14} /> Edit
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black rounded-lg text-xs font-medium text-white shadow-sm transition-colors">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
           <div className="flex flex-col items-center gap-1">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Assets</span>
             <span className="text-xl font-bold text-blue-500">$ {ACCOUNTS_DATA.assets.toFixed(2)}</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Liabilities</span>
             <span className="text-xl font-bold text-red-500">$ {ACCOUNTS_DATA.liabilities.toFixed(2)}</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total</span>
             <span className="text-xl font-bold text-gray-800">$ {ACCOUNTS_DATA.total.toFixed(2)}</span>
           </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4 overflow-y-auto">
        {ACCOUNTS_DATA.groups.map(group => (
          <Card key={group.title} noPadding>
             <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
               <span className="text-xs font-bold text-gray-400 uppercase">{group.title}</span>
             </div>
             {group.items.map((item, idx) => (
               <div key={idx} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className={`text-sm font-semibold ${item.type === 'liability' ? 'text-red-500' : 'text-blue-500'}`}>
                    $ {Math.abs(item.amount).toFixed(2)}
                  </span>
               </div>
             ))}
          </Card>
        ))}
        
        <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-medium hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all">
           + Add New Account
        </button>
      </div>
    </div>
  );
};

// --- Modals ---

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Food');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
           <h3 className="font-bold text-gray-800">New Transaction</h3>
           <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
             <X size={20} />
           </button>
        </div>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
          {/* Type Segmented Control */}
          <div className="bg-gray-100 p-1 rounded-lg flex">
             {[
               { label: 'Income', value: 'income', color: 'bg-blue-500' },
               { label: 'Expense', value: 'expense', color: 'bg-red-500' },
               { label: 'Transfer', value: 'transfer', color: 'bg-gray-600' },
             ].map(t => (
               <button 
                 key={t.value}
                 onClick={() => setType(t.value)}
                 className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                   type === t.value ? `${t.color} text-white shadow-sm` : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 {t.label}
               </button>
             ))}
          </div>

          <div className="flex gap-4">
             <div className="flex-1 space-y-1">
               <label className="text-xs font-semibold text-gray-500">Date</label>
               <input 
                 type="date" 
                 defaultValue="2025-07-29"
                 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" 
               />
             </div>
             <div className="flex-1 space-y-1">
               <label className="text-xs font-semibold text-gray-500">Time</label>
               <input 
                 type="text" 
                 defaultValue="12:50 PM"
                 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" 
               />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500">Account</label>
             <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all bg-white">
               <option>Cash</option>
               <option>Bank</option>
               <option>Credit Card</option>
             </select>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500">Amount</label>
             <div className="relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
               <input 
                 type="number"
                 placeholder="0.00"
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className={`w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all ${
                    type === 'expense' 
                      ? 'text-red-500 focus:ring-red-100 focus:border-red-300' 
                      : 'text-blue-500 focus:ring-blue-100 focus:border-blue-300'
                 }`}
               />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500">Note</label>
             <input 
               type="text" 
               placeholder="What is this for?"
               value={note}
               onChange={(e) => setNote(e.target.value)}
               className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all"
             />
          </div>

          <div className="space-y-2">
             <label className="text-xs font-semibold text-gray-500">Category</label>
             <div className="grid grid-cols-4 gap-2">
               {Object.keys(COLORS.categoryColors).map(cat => (
                 <button
                   key={cat}
                   onClick={() => setCategory(cat)}
                   className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                     category === cat 
                       ? 'bg-gray-50 border-gray-300' 
                       : 'bg-white border-transparent hover:bg-gray-50'
                   }`}
                 >
                   <div 
                     className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                     style={{ backgroundColor: COLORS.categoryColors[cat] }}
                   >
                     {cat[0]}
                   </div>
                   <span className="text-[10px] text-gray-500">{cat}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
           <button 
             onClick={() => {
                if (!amount) return;
                onAdd({
                  id: Date.now(),
                  type,
                  amount: parseFloat(amount),
                  category,
                  account: 'Cash',
                  note,
                  date: new Date().toISOString().split('T')[0]
                });
                onClose();
             }}
             className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg font-medium shadow-lg transition-all active:scale-95"
           >
             Save Transaction
           </button>
        </div>

      </div>
    </div>
  );
};


// --- Main Layout ---

export default function MoneyManagerApp() {
  const [activeTab, setActiveTab] = useState('Trans');
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTransaction = (newTx) => {
    setTransactions([newTx, ...transactions]);
  };

  const navItems = [
    { id: 'Trans', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Stats', icon: PieChart, label: 'Statistics' },
    { id: 'Accounts', icon: CreditCard, label: 'Accounts' },
    { id: 'Settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <div className="w-8 h-8 bg-red-500 rounded-lg text-white flex items-center justify-center shadow-lg shadow-red-200 mr-3">
             <Wallet size={18} strokeWidth={2.5} />
           </div>
           <span className="font-extrabold text-xl text-gray-900 tracking-tight">MoneyMgr</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase font-bold text-gray-400 px-3 mb-2 tracking-wider">Menu</div>
          {navItems.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon 
                  size={18} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'} 
                />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95 font-medium text-sm"
           >
             <Plus size={18} strokeWidth={2.5} />
             New Transaction
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
        <div className="flex-1 overflow-hidden p-6 relative">
           {activeTab === 'Trans' && <TransactionsView transactions={transactions} />}
           {activeTab === 'Stats' && <StatsView />}
           {activeTab === 'Accounts' && <AccountsView />}
           {activeTab === 'Settings' && (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <Settings size={48} className="mb-4 opacity-20" />
               <p>Settings Panel Placeholder</p>
             </div>
           )}
        </div>
      </main>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
      />

    </div>
  );
}