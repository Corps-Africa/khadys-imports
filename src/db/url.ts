/**
 * Finds the Postgres connection string. Vercel's Neon integration names it
 * DATABASE_URL by default, but older setups (or a custom prefix chosen when
 * connecting the store) use POSTGRES_URL or <PREFIX>_DATABASE_URL instead.
 */
export function getDatabaseUrl(): string | undefined {
  const env = process.env;
  if (env.DATABASE_URL) return env.DATABASE_URL;
  if (env.POSTGRES_URL) return env.POSTGRES_URL;
  const key = Object.keys(env).find((k) => /_(DATABASE|POSTGRES)_URL$/.test(k) && env[k]);
  return key ? env[key] : undefined;
}

export const MISSING_DB_MESSAGE =
  "No database connection string found (DATABASE_URL). On Vercel: open the project → Storage → " +
  "create or connect a Neon Postgres database to this project (all environments), then redeploy. " +
  "Locally: put DATABASE_URL in .env.local.";
