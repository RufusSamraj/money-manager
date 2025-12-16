import { X } from "lucide-react";
import { useState } from "react";

export function AddCategoryModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl">
        <div className="flex justify-between p-4 border-b">
          <h3 className="font-bold">New Category</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Category name"
          />
        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => {
              if (!name) return;
              onAdd(name);
              setName("");
              onClose();
            }}
            className="w-full py-2 bg-gray-900 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
