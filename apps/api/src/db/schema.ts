import { pgTable, serial, text, numeric, date, timestamp, varchar, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const otps = pgTable('otps', {
  email: varchar('email', { length: 255 }).primaryKey(),
  otp: varchar('otp', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const account_groups = pgTable('account_groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text('name').notNull(),
  group: integer('group').references(() => account_groups.id),
  balance: numeric('balance').default('0'),
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  userId: integer("user_id").notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: varchar('type', { length: 10 }).notNull(), // 'income', 'expense', 'transfer'
  date: timestamp('date').notNull(),
  amount: numeric('amount').notNull(),
  category: integer('category').references(() => categories.id),
  account: integer('account').references(() => accounts.id),
  toAccount: text('to_account'), // For transfers
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
});