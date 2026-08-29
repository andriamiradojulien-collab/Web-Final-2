import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const databasePool = new Pool({
  connectionString: env.databaseUrl,
  max: 10
});

databasePool.on("error", (error) => {
  console.error("PostgreSQL:", error.message);
});
