import { 
  Search, Star, SlidersHorizontal, ChevronLeft, ChevronRight, 
  LayoutDashboard, PieChart, CreditCard, Settings, Plus, Wallet, 
  Edit2, Filter, X, Check
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export function Sidebar({ isModalOpen, setIsModalOpen }) {


    const [activeTab, setActiveTab] = useState('Trans');

      // const [isModalOpen, setIsModalOpen] = useState(false);

    const navItems = [
    { id: 'Trans', icon: LayoutDashboard, label: 'Dashboard', route: '/' },
    { id: 'Stats', icon: PieChart, label: 'Statistics', route: '/stats' },
    { id: 'Accounts', icon: CreditCard, label: 'Accounts', route: '/accounts' },
    { id: 'Settings', icon: Settings, label: 'Settings', route: '/settings' },
  ];

  return (
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
              <Link to={tab.route}>
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
              </Link>
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
  )
}