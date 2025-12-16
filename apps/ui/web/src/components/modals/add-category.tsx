import { X } from "lucide-react";
import { useState } from "react";

export function AddCategoryModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              New Category
            </h3>
            <p className="text-xs text-gray-500">
              Create a category to organize items
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-2">
          <div className="text-md font-medium text-gray-500 mb-2">
            Category name
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Food, Rent, Travel"
            autoFocus
            className="
              w-full px-3 py-2.5 rounded-xl
              border border-gray-200
              text-sm
              focus:outline-none
              focus:ring-2 focus:ring-gray-100
            "
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => {
              if (!name) return;
              onAdd(name);
              setName("");
              onClose();
            }}
            className="
              w-full py-2.5 rounded-xl
              bg-gray-900 hover:bg-black
              text-white font-medium
              shadow-sm
              transition-all active:scale-95
            "
          >
            Save Category
          </button>
        </div>

      </div>
    </div>
  );
}
