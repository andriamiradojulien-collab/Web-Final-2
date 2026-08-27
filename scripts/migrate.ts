import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from '../src/config/db';

async function main() {
  const file = path.join(__dirname, '../migrations/001_init.sql');
  const sql = fs.readFileSync(file, 'utf-8');
  await pool.query(sql);
  console.log('Migration appliquée avec succès.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
