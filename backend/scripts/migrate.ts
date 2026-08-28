import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from '../src/config/db';

async function main() {
  const file = join(__dirname, '../migrations/001_init.sql');
  const sql = readFileSync(file, 'utf-8');

  await pool.query(sql);
  console.log('Migration appliquée avec succès.');
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Erreur de migration :', err);
      process.exit(1);
    });