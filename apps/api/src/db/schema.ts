import { pgTable, serial, text, numeric, date, timestamp, varchar } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., 'Cash', 'Bank Main'
  type: varchar('type', { length: 20 }).notNull(), // 'asset' or 'liability'
  initialBalance: numeric('initial_balance').default('0'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 10 }).notNull(), // 'income', 'expense', 'transfer'
  amount: numeric('amount').notNull(),
  category: text('category').notNull(),
  account: text('account').notNull(), // Linked to account name for simplicity in this demo
  toAccount: text('to_account'), // For transfers
  note: text('note'),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});