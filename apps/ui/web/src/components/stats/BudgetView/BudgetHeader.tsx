export default function BudgetHeader({ remaining }: { remaining: number }) {
  return (
    <div className="p-4 rounded-xl shadow bg-white">
      <div className="text-lg font-semibold">Remaining Budget</div>
      <div className="text-3xl font-bold mt-2">₹{remaining.toLocaleString()}</div>
      <button className="mt-4 px-4 py-2 bg-black text-white rounded-lg">
        Go to Budget Settings
      </button>
    </div>
  );
}
