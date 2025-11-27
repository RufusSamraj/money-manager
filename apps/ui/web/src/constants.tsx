export const COLORS = {
  expense: '#ff5252',
  income: '#2196f3',
  categoryColors: {
    Food: '#ffcc00',
    Transportation: '#ff9800',
    Shopping: '#e91e63',
    Health: '#cddc39',
    Entertainment: '#9c27b0',
    Housing: '#009688',
    Salary: '#2196f3',
    Gift: '#ffeb3b'
  }
};

export const CATEGORY_STATS = [
  { name: 'Food', amount: 250.00, budget: 300, color: COLORS.categoryColors.Food },
  { name: 'Shopping', amount: 465.48, budget: 400, color: COLORS.categoryColors.Shopping },
  { name: 'Housing', amount: 1200.00, budget: 1200, color: COLORS.categoryColors.Housing },
  { name: 'Transp.', amount: 45.00, budget: 100, color: COLORS.categoryColors.Transportation },
  { name: 'Entert.', amount: 25.00, budget: 50, color: COLORS.categoryColors.Entertainment },
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, type: 'expense', date: '2025-07-29', category: 'Food', account: 'Cash', note: 'Brunch with Daniel', amount: 34.39 },
  { id: 2, type: 'expense', date: '2025-07-28', category: 'Shopping', account: 'Credit Card', note: 'IKEA Wardrobe', amount: 315.48 },
  { id: 3, type: 'transfer', date: '2025-07-27', category: 'Transfer', account: 'Bank', toAccount: 'Travel Fund', note: 'Minimum fees', amount: 80.00 },
  { id: 4, type: 'expense', date: '2025-07-24', category: 'Housing', account: 'Bank', note: 'Rent', amount: 1200.00 },
  { id: 5, type: 'income', date: '2025-07-22', category: 'Salary', account: 'Bank', note: 'July Salary', amount: 4500.00 },
  { id: 6, type: 'expense', date: '2025-07-22', category: 'Transportation', account: 'Debit Card', note: 'Gas', amount: 45.00 },
  { id: 7, type: 'expense', date: '2025-07-20', category: 'Entertainment', account: 'Cash', note: 'Movies', amount: 25.00 },
  { id: 8, type: 'expense', date: '2025-07-20', category: 'Food', account: 'Cash', note: 'Groceries', amount: 124.50 },
];

export const ACCOUNTS_DATA = {
  assets: 6628.12,
  liabilities: 2082.42,
  total: 4545.70,
  groups: [
    { title: 'Cash', items: [{ name: 'Cash', amount: 68.45 }] },
    { title: 'Accounts', items: [{ name: 'Bank Main', amount: 2768.66 }, { name: 'Savings', amount: 1613.61 }] },
    { title: 'Cards', items: [{ name: 'Credit Card', amount: -1076.39, type: 'liability' }] }
  ]
};