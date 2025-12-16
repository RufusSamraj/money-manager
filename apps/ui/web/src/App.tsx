import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router";

import { Sidebar } from "./components/sidebar";
import { AddTransactionModal } from "./components/modals/add-transaction";

import { TransactionsPage } from "./pages/transactions";
import { StatsPage } from "./pages/stats";
import { AccountsPage } from "./pages/accounts";
import { SettingsPage } from "./pages/settings";
import { UploadExcelModal } from "./components/modals/upload-excel";
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { VerifyOTPPage } from "./pages/auth/verify-otp";
import { ProtectedRoute } from "./pages/protected";
import { API_BASE_URL } from "./lib/constants";
import { CategoriesPage } from "./pages/categories";

function App() {

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [excelModal, setExcelModal] = useState(false);
	const location = useLocation();

	const [transactions, setTransactions] = useState([]);
const authRoutes = ["/login", "/register", "/verify"];
const isAuthPage = authRoutes.includes(location.pathname);

	useEffect(() => {
  async function loadData() {
    try {
		
      const [txRes] = await Promise.all([
        fetch(`${API_BASE_URL}/transactions`, {
      credentials: 'include'}),
      ]);

      setTransactions(await txRes.json());

    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }

  loadData();
}, []);
	

// 	useEffect(() => {
//   fetch("http://localhost:3000/api/transactions")
//     .then(res => res.json())
//     .then(setTransactions)
//     .catch(err => console.error("Failed to load transactions:", err));
// }, []);

  
	async function handleAddTransaction(data) {
  await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),

      credentials: 'include',
  });

  const updated = await fetch(`${API_BASE_URL}/transactions`, {
      credentials: 'include'})
    .then(res => res.json());

  setTransactions(updated);

  window.location.reload();

}

	async function handleUploadExcel() {
//   await fetch("http://localhost:3000/api/transactions", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

  const updated = await fetch(`${API_BASE_URL}/transactions`, {
      credentials: 'include'})
    .then(res => res.json());

  setTransactions(updated);

  window.location.reload();

}

	return (
  <div className="h-screen w-screen overflow-hidden">
    {isAuthPage ? (
      // --------------------------
      // AUTH LAYOUT (no sidebar)
      // --------------------------
      <div className="flex w-full items-center justify-center h-full bg-gray-50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyOTPPage />} />
        </Routes>
      </div>
    ) : (
      // --------------------------
      // APP LAYOUT (sidebar + content)
      // --------------------------
      <div className="flex h-full bg-gray-50 font-sans text-gray-900 overflow-hidden">
        
        {/* SIDEBAR */}
        <Sidebar
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          excelModal={excelModal}
          setExcelModal={setExcelModal}
        />

        {/* MAIN CONTENT */}
        <main className="bg-surface flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
          <div className="flex-1 overflow-y-scroll p-6 relative">
            <Routes>
              <Route path="/" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
              <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
              <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            </Routes>
          </div>
        </main>

        {/* MODALS */}
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddTransaction}
        />

        <UploadExcelModal
          isOpen={excelModal}
          onClose={() => setExcelModal(false)}
          onAdd={handleUploadExcel}
        />
      </div>
    )}
  </div>
);

}

export default App;
