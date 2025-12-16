import * as XLSX from "xlsx";

import { X } from "lucide-react";
import { useState } from "react";
import { API_BASE_URL } from "../../lib/constants";

export function UploadExcelModal({ isOpen, onClose, onAdd }) {

  const [loading, setLoading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet);

    /** Expected Excel columns:
     *
     * type        (income | expense | transfer)
     * date        (2025-02-12)
     * amount      (numeric)
     * category    (string categoryName)
     * account     (string accountName)
     * note        (optional)
     *
     */

    const parsed = rows.map(r => ({
      type: r.type,
      date: r.date,
      amount: Number(r.amount),
      categoryName: r.category,
      accountName: r.account,
      note: r.note || ""
    }));

    // Send to backend
    await fetch(`${API_BASE_URL}/transactions/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
      
      credentials: 'include',
    });

    onAdd();   // reload parent
    onClose();
    setLoading(false);
  }

  if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
           <h3 className="font-bold text-gray-800">Upload Excel</h3>
           <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
             <X size={20} />
           </button>
        </div>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
          <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="border border-gray-300 rounded-md p-2"
        />

        {loading && <p className="text-gray-500 text-sm">Uploading…</p>}

        <button
          onClick={onClose}
          className="px-3 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
        </div>

        </div>
        </div>
    )
}