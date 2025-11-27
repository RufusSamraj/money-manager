export const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${noPadding ? '' : 'p-4'} ${className}`}>
    {children}
  </div>
);