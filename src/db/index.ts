import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
}

// Reuse the connection across hot reloads in development.
const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

const sql =
  globalForDb.sql ??
  postgres(url, {
    max: 5,
    prepare: false, // required for Neon / pgbouncer pooled connections
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;

export const db = drizzle(sql, { schema });
