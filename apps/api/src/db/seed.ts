import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { account_groups, categories } from './schema'; // adjust path if needed
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  console.log('🌱 Seeding database...');

  // ---- CATEGORY SEED ----
  const categoryList = [
    'Food',
    'Social Life',
    'Pets',
    'Transport',
    'Culture',
    'Household',
    'Apparel',
    'Beauty',
    'Health',
    'Education',
    'Gift',
    'Other',
  ];

  console.log('→ Seeding categories...');
  for (const name of categoryList) {
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(categories).values({ name });
      console.log(`  ✓ Inserted: ${name}`);
    } else {
      console.log(`  • Skipped existing: ${name}`);
    }
  }

  // ---- ACCOUNT GROUP SEED ----
  const accountGroupList = [
    'Cash',
    'Card',
    'Accounts',
    'Debit Card',
    'Savings',
    'Top-Up/Prepaid',
    'Investments',
    'Overdrafts',
    'Loan',
    'Insurance',
    'Others',
  ];

  console.log('→ Seeding account groups...');
  for (const name of accountGroupList) {
    const existing = await db
      .select()
      .from(account_groups)
      .where(eq(account_groups.name, name))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(account_groups).values({ name });
      console.log(`  ✓ Inserted: ${name}`);
    } else {
      console.log(`  • Skipped existing: ${name}`);
    }
  }

  console.log('🌾 Done seeding!');
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  pool.end();
});
