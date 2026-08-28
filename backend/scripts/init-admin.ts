import 'dotenv/config';
import { pool } from '../src/config/db';
import { hashPassword } from '../src/security/password';

async function main() {
  const { INIT_ADMIN_EMAIL: email, INIT_ADMIN_PASSWORD: password } = process.env;

  if (!email || !password) {
    throw new Error('INIT_ADMIN_EMAIL et INIT_ADMIN_PASSWORD sont requis dans le .env');
  }

  const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (rows.length > 0) {
    console.log(`L'admin ${email} existe déjà.`);
    return;
  }

  const hash = await hashPassword(password);
  await pool.query(
      'INSERT INTO users (email, password_hash, role, is_active) VALUES ($1, $2, $3, true)',
      [email, hash, 'admin']
  );

  console.log(`Compte admin créé avec succès : ${email}`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Erreur lors de l’initialisation :', err);
      process.exit(1);
    });