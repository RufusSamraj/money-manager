export const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-surface border border-soft rounded-xl shadow-card overflow-hidden ${noPadding ? '' : 'p-4'} ${className}`}>
    {children}
  </div>
);