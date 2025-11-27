export const MoneyText = ({ amount, type, className = '' }) => {
  const isExpense = type === 'expense' || (type === undefined && amount < 0);
  const colorClass = type === 'income' ? 'text-blue-500' : type === 'transfer' ? 'text-gray-500' : 'text-red-500';
  
  return (
    <span className={`font-medium ${colorClass} ${className} whitespace-nowrap`}>
      {type === 'expense' ? '- ' : ''}$ {Math.abs(amount).toFixed(2)}
    </span>
  );
};