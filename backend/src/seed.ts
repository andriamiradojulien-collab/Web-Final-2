import { databasePool } from "./config/database.js";
import { env } from "./config/env.js";
import { hashPassword } from "./security/auth.js";

async function seed() {
  const passwordHash = await hashPassword(env.adminPassword);

  await databasePool.query(
    `INSERT INTO users (email, password_hash, role, status)
     VALUES ($1, $2, 'admin', 'active')
     ON CONFLICT (email)
     DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin', status = 'active'`,
    [env.adminEmail, passwordHash]
  );

  console.log(`Administrateur prêt : ${env.adminEmail}`);
  await databasePool.end();
}

seed().catch(async (error) => {
  console.error(error);
  await databasePool.end();
  process.exit(1);
});
