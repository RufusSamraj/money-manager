import { useEffect, useState } from "react";
import { COLORS } from "../../constants";
import { X } from "lucide-react";

export function AddAccountModal({ isOpen, onClose, onAdd }) {

    const [group, setGroup] = useState('Food');
    const [groups, setGroups] = useState([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
  fetch("http://localhost:3000/api/account-groups", {
      credentials: 'include'})
    .then(res => res.json())
    .then(setGroups);
}, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
           <h3 className="font-bold text-gray-800">New Account</h3>
           <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
             <X size={20} />
           </button>
        </div>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">

          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500">Name</label>
             <input 
               type="text" 
               placeholder=""
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all"
             />
          </div>

          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500">Amount</label>
             <div className="relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
               <input 
                 type="number"
                 placeholder="0.00"
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className={`w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
               />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500">Description</label>
             <input 
               type="text" 
               placeholder=""
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all"
             />
          </div>

          <div className="space-y-2">
             <label className="text-xs font-semibold text-gray-500">Group</label>
             <div className="grid grid-cols-4 gap-2">
               {/* {Object.keys(COLORS.categoryColors).map(cat => (
                 <button
                   key={cat}
                   onClick={() => setGroup(cat)}
                   className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                     group === cat 
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
               {groups.map(g => (
  <button
    key={g.id}
    onClick={() => setGroup(g.id)}
    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
      group === g.id
        ? 'bg-gray-50 border-gray-300'
        : 'bg-white border-transparent hover:bg-gray-50'
    }`}
  >
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gray-900">
      {g.name[0]}
    </div>
    <span className="text-[10px] text-gray-500">{g.name}</span>
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
                    name,
                    amount: parseFloat(amount),
                    groupId: group,
                    description,
                });
                onClose();
             }}
             className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg font-medium shadow-lg transition-all active:scale-95"
           >
             Save
           </button>
        </div>

      </div>
    </div>
  );

}