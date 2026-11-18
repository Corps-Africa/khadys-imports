import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getDatabaseUrl, MISSING_DB_MESSAGE } from "./url";

const url = getDatabaseUrl();
if (!url) throw new Error(MISSING_DB_MESSAGE);

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
