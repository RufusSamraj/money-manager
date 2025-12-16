import { Settings, Folder } from "lucide-react";
import { Link } from "react-router";

export function SettingsPage() {
  return (
    <div className="h-full flex flex-col gap-6 p-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-sm text-gray-500">
          Manage preferences and configuration
        </p>
      </div>

      {/* Settings list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <Link
          to="/categories"
          className="
            flex items-center justify-between px-5 py-4
            hover:bg-gray-50 transition-colors
          "
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <Folder size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Categories</p>
              <p className="text-xs text-gray-500">
                Manage income and expense categories
              </p>
            </div>
          </div>

          <span className="text-gray-300">›</span>
        </Link>

        {/* Placeholder for future settings */}
        <div className="flex items-center gap-3 px-5 py-4 text-gray-400">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Settings size={18} />
          </div>
          <p className="text-sm">More settings coming soon</p>
        </div>

      </div>
    </div>
  );
}
