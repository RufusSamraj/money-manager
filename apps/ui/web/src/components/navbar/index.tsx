import { Calendar, BarChart2, Wallet, Settings, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.jpg";

const TopNavBar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("date");

  const navItems = [
    { id: "date", label: "Date", icon: <Calendar size={18} /> },
    { id: "stats", label: "Stats", icon: <BarChart2 size={18} /> },
    { id: "accounts", label: "Accounts", icon: <Wallet size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <nav
      className="
      fixed top-0 left-0 w-full
      bg-white border-b shadow-sm h-16
      flex items-center justify-between
      px-6 select-none
    "
    >
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} className="h-9 w-9 object-contain" alt="logo" />
        <span className="text-xl font-semibold text-gray-800">Money Manager</span>
      </div>

      {/* Center Menu - Desktop only */}
      <div className="flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActive(item.id);
              navigate(`/${item.id === "date" ? "" : item.id}`);
            }}
            className={`flex items-center gap-1 text-sm ${
              active === item.id ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Right - Profile */}
      <div>
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <User size={22} />
        </button>
      </div>
    </nav>
  );
};

export default TopNavBar;
