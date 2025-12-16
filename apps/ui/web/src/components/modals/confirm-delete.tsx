import { X, Trash2 } from "lucide-react";

export function ConfirmDeleteModal({
  // isOpen,
  title = "Delete item",
  description = "This action cannot be undone.",
  onCancel,
  onConfirm,
}) {
  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-red-600">
            <Trash2 size={18} />
            <h3 className="text-lg font-semibold">Delete Category</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-sm text-gray-600">
          <p className="font-medium text-gray-800">{title}</p>
          <p className="mt-1 text-gray-500">{description}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition active:scale-95"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
