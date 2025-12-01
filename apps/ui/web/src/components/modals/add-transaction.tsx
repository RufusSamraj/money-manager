import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function AddTransactionModal({ isOpen, onClose, onAdd }) {

  const [type, setType] = useState('expense');
  const [date, setDate] = useState("");
const [time, setTime] = useState("");
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Food');

  const [categories, setCategories] = useState([]);
const [accounts, setAccounts] = useState([]);


useEffect(() => {
  // fetch categories
  fetch("http://localhost:3000/api/categories", {
    credentials: "include",
  })
    .then(res => res.json())
    .then(setCategories);

  // fetch accounts and set default selection
  fetch("http://localhost:3000/api/accounts", {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      setAccounts(data);
      if (data.length > 0) {
        setAccount(data[0].id);   // 👈 DEFAULT ACCOUNT SET HERE
      }
    });
}, []);


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
                 value={date}
  onChange={(e) => setDate(e.target.value)}
                //  defaultValue={`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}`}
                 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" 
               />
             </div>
             <div className="flex-1 space-y-1">
               <label className="text-xs font-semibold text-gray-500">Time</label>
               <input 
                 type="time"
                 value={time}
  onChange={(e) => setTime(e.target.value)}
                //  defaultValue={`${new Date().getHours()}:${new Date().getMinutes()}`}
                 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" 
               />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500">Account</label>
             <select   value={account}
  onChange={(e) => setAccount(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all bg-white">
               {/* <option>Cash</option>
               <option>Bank</option>
               <option>Credit Card</option> */}
               {accounts.map(acc => (
  <option key={acc.id} value={acc.id}>
    {acc.name}
  </option>
))}
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
               {/* {Object.keys(COLORS.categoryColors).map(cat => (
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
               ))} */}
               {categories.map(cat => (
  <button
    key={cat.id}
    onClick={() => setCategory(cat.id)}
    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
      category === cat.id 
        ? 'bg-gray-50 border-gray-300' 
        : 'bg-white border-transparent hover:bg-gray-50'
    }`}
  >
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gray-900"
    >
      {cat.name[0]}
    </div>
    <span className="text-[10px] text-gray-500">{cat.name}</span>
  </button>
))}
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
           <button 
             onClick={() => {
                if (!amount || !category || !account) return;

  const isoDate = `${date}T${time}`;

  onAdd({
    type,
    amount: parseFloat(amount),
    category,
    account,
    note,
    date: isoDate
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

}