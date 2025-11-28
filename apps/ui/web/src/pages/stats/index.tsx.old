import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card } from "../../components/card";
import { Badge } from "../../components/badge";
import { CATEGORY_STATS } from "../../constants";

export function StatsPage() {
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
}