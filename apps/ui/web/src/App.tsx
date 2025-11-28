import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";

import { Sidebar } from "./components/sidebar";
import { AddTransactionModal } from "./components/modals/add-transaction";

import { TransactionsPage } from "./pages/transactions";
import { StatsPage } from "./pages/stats";
import { AccountsPage } from "./pages/accounts";
import { SettingsPage } from "./pages/settings";

function App() {

	const [transactions, setTransactions] = useState([]);
	const [categories, setCategories] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
  async function loadData() {
    try {
      const [txRes, catRes] = await Promise.all([
        fetch("http://localhost:3000/api/transactions"),
        fetch("http://localhost:3000/api/categories")
      ]);

      setTransactions(await txRes.json());
      setCategories(await catRes.json());

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
  await fetch("http://localhost:3000/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const updated = await fetch("http://localhost:3000/api/transactions")
    .then(res => res.json());

  setTransactions(updated);
}

	return (
		<div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
			<Sidebar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

			<main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
				<div className="flex-1 overflow-hidden p-6 relative">
					<Routes>
						<Route path="/" element={<TransactionsPage transactions={transactions} />} />
						<Route path="/stats" element={<StatsPage statsTransactions={transactions} categories={categories} />} />
						<Route path="/accounts" element={<AccountsPage />} />
						<Route path="/settings" element={<SettingsPage />} />
					</Routes>
				</div>
			</main>

			<AddTransactionModal
				isOpen={isModalOpen} 
				onClose={() => setIsModalOpen(false)}
				onAdd={handleAddTransaction}
			/>
		</div>
	);
}

export default App;
