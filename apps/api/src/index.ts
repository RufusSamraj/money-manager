import 'dotenv/config';


import express from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, desc } from 'drizzle-orm';
import * as schema from './db/schema';

// --- Configuration ---
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json());

// Database Connection (Ensure you have a .env file with DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/moneymanager?sslmode=disable',
});
const db = drizzle(pool, { schema });
// const db = drizzle({ client: pool });

// --- API Routes ---

app.get("/api/account-groups", async (req, res) => {
  try {
    const groups = await db.select().from(schema.account_groups);
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch account groups" });
  }
});

app.get("/api/accounts", async (req, res) => {
  try {
    const result = await db
      .select({
        id: schema.accounts.id,
        name: schema.accounts.name,
        balance: schema.accounts.balance,
        description: schema.accounts.description,
        createdAt: schema.accounts.createdAt,
        groupId: schema.account_groups.id,
        groupName: schema.account_groups.name,
      })
      .from(schema.accounts)
      .leftJoin(schema.account_groups, eq(schema.accounts.group, schema.account_groups.id));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

app.post("/api/accounts", async (req, res) => {
  try {
    const { name, group, balance, description } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const result = await db.insert(schema.accounts).values({
      name,
      group,
      balance,
      description,
    }).returning();

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create account" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const result = await db.select().from(schema.categories);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const result = await db
      .select({
        id: schema.transactions.id,
        type: schema.transactions.type,
        date: schema.transactions.date,
        amount: schema.transactions.amount,
        note: schema.transactions.note,
        toAccount: schema.transactions.toAccount,

        // Relations
        categoryId: schema.categories.id,
        categoryName: schema.categories.name,

        accountId: schema.accounts.id,
        accountName: schema.accounts.name,
      })
      .from(schema.transactions)
      .leftJoin(schema.categories, eq(schema.transactions.category, schema.categories.id))
      .leftJoin(schema.accounts, eq(schema.transactions.account, schema.accounts.id));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const {
      type,        // 'income', 'expense', 'transfer'
      date,
      amount,
      category,
      account,
      toAccount,
      note,
    } = req.body;

    if (!type || !date || !amount) {
      return res.status(400).json({
        error: "type, date, and amount are required"
      });
    }

    const result = await db
      .insert(schema.transactions)
      .values({
        type,
        date: new Date(date),
        amount,
        category,
        account,
        toAccount,
        note,
      })
      .returning();

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// 1. Get All Transactions
// app.get('/api/transactions', async (req, res) => {
//   try {
//     const allTx = await db.select().from(schema.transactions).orderBy(desc(schema.transactions.date));
//     // Convert numeric strings to numbers for frontend
//     const formatted = allTx.map(tx => ({ ...tx, amount: parseFloat(tx.amount) }));
//     res.json(formatted);
//   } catch (err: any) {
//     console.log(err)
//     res.status(500).json({ error: err.message });
//   }
// });

// // 2. Add Transaction
// app.post('/api/transactions', async (req, res) => {
//   try {
//     const newTx = await db.insert(schema.transactions).values(req.body).returning();
//     res.json({ ...newTx[0], amount: parseFloat(newTx[0].amount) });
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 3. Delete Transaction
// app.delete('/api/transactions/:id', async (req, res) => {
//   try {
//     if (!req.params.id || !parseInt(req.params.id)) {
//       res.status(400).json({ error: 'invalid request' });
//     }
//     await db.delete(schema.transactions).where(eq(schema.transactions.id, req.params.id));
//     res.json({ success: true });
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 4. Get Accounts (Calculated dynamically from transactions + initial state)
// app.get('/api/accounts', async (req, res) => {
//   try {
//     // In a real app, you'd fetch accounts and sum transactions per account via SQL
//     // For this demo, we'll return the base accounts and let frontend calculate totals
//     // or you could calculate it here. Let's return the raw accounts list.
//     const allAccounts = await db.select().from(schema.accounts);
//     res.json(allAccounts);
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Seed Endpoint (Optional: to populate initial data)
// app.post('/api/seed', async (req, res) => {
//     // Add logic here to insert INITIAL_TRANSACTIONS if db is empty
//     res.json({ message: "Seeding implemented as needed" });
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});