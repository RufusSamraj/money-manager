import { 
  Search, Star, SlidersHorizontal, ChevronLeft, ChevronRight, 
  LayoutDashboard, PieChart, CreditCard, Settings, Plus, Wallet, 
  Edit2, Filter, X, Check, Upload, LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { API_BASE_URL } from '../../lib/constants';

export function Sidebar({ isModalOpen, setIsModalOpen, excelModal, setExcelModal }) {

  const [activeTab, setActiveTab] = useState('Trans');
  const location = useLocation();

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);


  useEffect(() => {
    const current = navItems.find(item => item.route === location.pathname);
    if (current) {
      setActiveTab(current.id);
    }
  }, [location.pathname]);

  const navItems = [
    { id: 'Trans', icon: LayoutDashboard, label: 'Dashboard', route: '/' },
    { id: 'Stats', icon: PieChart, label: 'Statistics', route: '/stats' },
    { id: 'Accounts', icon: CreditCard, label: 'Accounts', route: '/accounts' },
    { id: 'Settings', icon: Settings, label: 'Settings', route: '/settings' },
  ];

  async function handleLogout() {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";  
  }

  return (
    <aside className="w-64 bg-surface border-r border-soft flex flex-col shrink-0 z-20">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-soft">
        <div className="w-8 h-8 bg-red-500 rounded-lg text-white flex items-center justify-center shadow-lg mr-3">
          <Wallet size={18} strokeWidth={2.5} />
        </div>
        <span className="font-extrabold text-xl text-main tracking-tight">
          MoneyMgr
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        
        <div className="text-[10px] uppercase font-bold text-subtle px-3 mb-2 tracking-wider">
          Menu
        </div>

        {navItems.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <Link to={tab.route} key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                  transition-all duration-200 group
                  ${isActive 
                    ? "bg-red-50 text-red-600" 
                    : "text-muted hover:bg-surface-100 hover:text-main"
                  }
                `}
              >
                <tab.icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive 
                    ? "text-red-500" 
                    : "text-subtle group-hover:text-muted"
                  }
                />
                {tab.label}
              </button>
            </Link>
          );
        })}

      </nav>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-soft">

        {/* New Transaction */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-surface-50 text-main 
                     hover:bg-red-600 hover:text-white py-3 rounded-xl shadow-lg cursor-pointer
                     transition-all active:scale-95 font-medium text-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          New Transaction
        </button>

        {/* Upload Excel */}
        <button 
          onClick={() => setExcelModal(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-surface-50 text-main 
                     hover:bg-red-600 hover:text-white py-3 rounded-xl shadow-lg cursor-pointer
                     transition-all active:scale-95 font-medium text-sm"
        >
          <Upload size={18} strokeWidth={2.5} />
          Upload excel
        </button>

        <button
          onClick={toggleTheme}
          className="mt-4 w-full flex items-center justify-center gap-2 
                    bg-surface-50 text-main hover:bg-surface-100 
                    py-3 rounded-xl shadow transition-all active:scale-95 font-medium text-sm"
        >
  <Moon size={18} className="dark:hidden" />
  <Sun size={18} className="hidden dark:block" />
  <span className="dark:hidden">Dark Mode</span>
  <span className="hidden dark:block">Light Mode</span>
</button>


        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 
                     hover:bg-red-600 text-white py-3 rounded-xl shadow-lg cursor-pointer
                     transition-all active:scale-95 font-medium text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </aside>
  );
}
