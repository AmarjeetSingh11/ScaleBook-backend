import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_FILE = path.join(__dirname, '..', 'database', 'seed', 'seed.sql');

async function seed() {
  if (!fs.existsSync(SEED_FILE)) {
    console.log('No seed.sql found. Skipping.');
    await pool.end();
    return;
  }

  const sql = fs.readFileSync(SEED_FILE, 'utf8');
  try {
    await pool.query(sql);
    console.log('Seed completed.');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }

  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
