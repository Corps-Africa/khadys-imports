/**
 * Finds the Postgres connection string. Vercel's Neon integration names it
 * DATABASE_URL by default, but older setups (or a custom prefix chosen when
 * connecting the store) use POSTGRES_URL or <PREFIX>_DATABASE_URL instead.
 */
export function getDatabaseUrl(): string | undefined {
  const env = process.env;
  if (env.DATABASE_URL) return env.DATABASE_URL;
  if (env.POSTGRES_URL) return env.POSTGRES_URL;
  const key = Object.keys(env).find((k) => /_(DATABASE|POSTGRES)_URL$/i.test(k) && env[k]);
  if (key) return env[key];
  // Neon also sets the standard libpq variables; build a URL from them if that's all we have.
  if (env.PGHOST && env.PGUSER && env.PGDATABASE) {
    const auth = `${encodeURIComponent(env.PGUSER)}${env.PGPASSWORD ? ":" + encodeURIComponent(env.PGPASSWORD) : ""}`;
    return `postgresql://${auth}@${env.PGHOST}/${env.PGDATABASE}?sslmode=require`;
  }
  return undefined;
}

/** Names (never values) of database-looking variables, to help diagnose a missing connection. */
export function databaseEnvNames() {
  return Object.keys(process.env).filter((k) => /PG|POSTGRES|DATABASE|NEON/i.test(k)).sort();
}

export const MISSING_DB_MESSAGE =
  "No database connection string found (DATABASE_URL). On Vercel: open the project → Storage → " +
  "create or connect a Neon Postgres database to this project (all environments), then redeploy. " +
  "Locally: put DATABASE_URL in .env.local.";
