import { useState } from "react";
import { Routes, Route } from "react-router";

import { Sidebar } from "./components/sidebar";
import { AddTransactionModal } from "./components/modals/add-transaction";

import { TransactionsPage } from "./pages/transactions";
import { StatsPage } from "./pages/stats";
import { AccountsPage } from "./pages/accounts";
import { SettingsPage } from "./pages/settings";

import { INITIAL_TRANSACTIONS } from "./constants";

function App() {

	const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
	const [isModalOpen, setIsModalOpen] = useState(false);
  
	const handleAddTransaction = (newTx) => {
		setTransactions([newTx, ...transactions]);
	};

	return (
		<div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
			<Sidebar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

			<main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
				<div className="flex-1 overflow-hidden p-6 relative">
					<Routes>
						<Route path="/" element={<TransactionsPage transactions={transactions} />} />
						<Route path="/stats" element={<StatsPage />} />
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
