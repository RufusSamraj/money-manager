import 'dotenv/config';


import express from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, desc, and } from 'drizzle-orm';
import * as schema from './db/schema';
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import { auth } from './middleware';


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


// --- Configuration ---
const app = express();
const port = 3000;

// Middleware
// app.use(cors()); // Allow frontend to connect
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// app.options("*", cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

app.use(express.json());
app.use(cookieParser());

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

app.get("/api/categories", async (req, res) => {
  try {
    const result = await db.select().from(schema.categories);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/api/accounts", auth, async (req, res) => {
  try {
    const userId = req.user.id;

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
      .leftJoin(schema.account_groups, eq(schema.accounts.group, schema.account_groups.id))
      .where(eq(schema.accounts.userId, userId));  // 👈 filter

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

app.post("/api/accounts", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, group, balance, description } = req.body;

    if (!name)
      return res.status(400).json({ error: "Name is required" });

    const result = await db.insert(schema.accounts)
      .values({
        userId,           // 👈 attach logged in user
        name,
        group,
        balance,
        description,
      })
      .returning();

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create account" });
  }
});

app.get("/api/transactions", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db
      .select({
        id: schema.transactions.id,
        type: schema.transactions.type,
        date: schema.transactions.date,
        amount: schema.transactions.amount,
        note: schema.transactions.note,
        toAccount: schema.transactions.toAccount,

        categoryId: schema.categories.id,
        categoryName: schema.categories.name,

        accountId: schema.accounts.id,
        accountName: schema.accounts.name,
      })
      .from(schema.transactions)
      .leftJoin(schema.categories, eq(schema.transactions.category, schema.categories.id))
      .leftJoin(schema.accounts, eq(schema.transactions.account, schema.accounts.id))
      .where(eq(schema.transactions.userId, userId));  // 👈 only user's transactions

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.post("/api/transactions", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      type,
      date,
      amount,
      category,
      account,
      toAccount,
      note,
    } = req.body;

    if (!type || !date || !amount) {
      return res.status(400).json({
        error: "type, date, and amount are required",
      });
    }

    const result = await db.insert(schema.transactions)
      .values({
        userId,                     // 👈 attach logged in user
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

app.post("/api/transactions/bulk", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const rows = req.body;

    for (const r of rows) {

      // Find category for this user OR global categories (if you use global)
      const cat = await db.query.categories.findFirst({
        where: eq(schema.categories.name, r.categoryName)
      });

      // Find account ONLY belonging to logged-in user
      const acc = await db.query.accounts.findFirst({
        where: and(
          eq(schema.accounts.name, r.accountName),
          eq(schema.accounts.userId, userId)
        )
      });

      await db.insert(schema.transactions).values({
        userId,                  // 👈 critical
        type: r.type,
        date: new Date(r.date),
        amount: r.amount,
        category: cat?.id || null,
        account: acc?.id || null,
        note: r.note || "",
      });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Excel bulk upload failed" });
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

app.post("/api/auth/register", async (req, res) => {
  console.log(req.body)
  try {
    const { name, email, password } = req.body;

    const existing = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });

    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // create user (unverified)
    await db.insert(schema.users).values({
      name,
      email,
      password: hashed,
    });

    // generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // store OTP
    await db.insert(schema.otps)
      .values({ email, otp, expiresAt })
      .onConflictDoUpdate({
        target: schema.otps.email,
        set: { otp, expiresAt }
      });

    // send email properly using nodemailer
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}\nIt expires in 10 minutes.`
    });

    res.json({ success: true, message: "OTP sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const saved = await db.query.otps.findFirst({
      where: eq(schema.otps.email, email)
    });

    if (!saved) return res.status(400).json({ error: "No OTP found" });
    if (saved.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (new Date() > saved.expiresAt) return res.status(400).json({ error: "OTP expired" });

    // mark user as verified
    await db.update(schema.users)
      .set({ isVerified: true })
      .where(eq(schema.users.email, email));

    // delete OTP entry
    await db.delete(schema.otps)
      .where(eq(schema.otps.email, email));

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OTP verification failed" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });

    if (!user) return res.status(400).json({ error: "User not found" });
    if (!user.isVerified) return res.status(403).json({ error: "Email not verified" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HttpOnly secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,         // ❗ set true in production HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/auth/me", auth, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});


app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,   // set true in production
    sameSite: "lax",
  });

  return res.json({ success: true });
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});