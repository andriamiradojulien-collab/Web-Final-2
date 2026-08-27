import 'dotenv/config';
import { pool } from '../src/config/db';
import { hashPassword } from '../src/security/password';

// RG-01 : le premier compte administrateur est créé via ce script d'initialisation
async function main() {
  const email = process.env.INIT_ADMIN_EMAIL;
  const password = process.env.INIT_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('INIT_ADMIN_EMAIL et INIT_ADMIN_PASSWORD doivent être définis dans .env');
  }
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    console.log(`Le compte admin ${email} existe déjà, rien à faire.`);
    process.exit(0);
  }
  const hash = await hashPassword(password);
  await pool.query(
    'INSERT INTO users (email, password_hash, role, is_active) VALUES ($1, $2, $3, TRUE)',
    [email, hash, 'admin']
  );
  console.log(`Compte admin créé : ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
