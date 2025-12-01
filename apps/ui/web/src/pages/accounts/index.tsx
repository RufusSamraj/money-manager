// hi
import { Plus } from "lucide-react";
import { Card } from "../../components/card";
import { AddAccountModal } from "../../components/modals/add-account";
import { useEffect, useState } from "react";

export function AccountsPage() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
  fetch("http://localhost:3000/api/accounts")
    .then(res => res.json())
    .then(setAccounts);
}, []);

function groupAccounts(accounts) {
  const groups = {};

  accounts.forEach(acc => {
    const g = acc.groupName || "Ungrouped";

    if (!groups[g]) groups[g] = [];

    groups[g].push({
      name: acc.name,
      amount: parseFloat(acc.balance),
      type: acc.balance < 0 ? 'liability' : 'asset'
    });
  });

  return Object.entries(groups).map(([title, items]) => ({
    title,
    items
  }));
}

function computeTotals(accounts) {
  let assets = 0;
  let liabilities = 0;

  accounts.forEach(acc => {
    const amt = parseFloat(acc.balance);
    if (amt >= 0) assets += amt;
    else liabilities += Math.abs(amt);
  });

  return {
    assets,
    liabilities,
    total: assets - liabilities
  };
}

const groups = groupAccounts(accounts);
const totals = computeTotals(accounts);


  async function handleAddAccount(data) {
    await fetch("http://localhost:3000/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        balance: data.amount,
        description: data.description,
        group: data.groupId,  // will fix below
      }),
    });
  }

    return (
      <>
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Accounts</h2>
        <div className="flex gap-2">
          {/* <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-700 shadow-sm transition-colors">
            <Edit2 size={14} /> Edit
          </button> */}
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black rounded-lg text-xs font-medium text-white shadow-sm transition-colors">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
           <div className="flex flex-col items-center gap-1">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Assets</span>
             <span className="text-xl font-bold text-blue-500">$ {totals.assets.toFixed(2)}</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Liabilities</span>
             <span className="text-xl font-bold text-red-500">$ {totals.liabilities.toFixed(2)}</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total</span>
             <span className="text-xl font-bold text-gray-800">$ {totals.total.toFixed(2)}</span>
           </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4 overflow-y-auto">
        {groups.map(group => (
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

    <AddAccountModal
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddAccount}
          />
      </>
  );
}