import { NavLink } from "react-router-dom";
import { BarChart3, CalendarDays, Wallet, Settings, User } from "lucide-react";

export default function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm flex justify-around py-3 z-50">
      <NavLink
        to="/date"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-black" : "text-gray-500"}`
        }
      >
        <CalendarDays className="w-6 h-6 mb-1" />
        Date
      </NavLink>

      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-black" : "text-gray-500"}`
        }
      >
        <BarChart3 className="w-6 h-6 mb-1" />
        Stats
      </NavLink>

      <NavLink
        to="/accounts"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-black" : "text-gray-500"}`
        }
      >
        <Wallet className="w-6 h-6 mb-1" />
        Accounts
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-black" : "text-gray-500"}`
        }
      >
        <Settings className="w-6 h-6 mb-1" />
        Settings
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-black" : "text-gray-500"}`
        }
      >
        <User className="w-6 h-6 mb-1" />
        Profile
      </NavLink>
    </div>
  );
}
