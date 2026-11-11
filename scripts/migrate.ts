/**
 * Idempotent database setup. Runs automatically before every build
 * (see "build" in package.json), so a fresh Neon database on Vercel
 * gets its tables on the first deploy. Safe to run any number of times.
 */
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✖ DATABASE_URL is not set — cannot set up the database.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });

const DEFAULT_CATEGORIES = [
  "Fashion & Bags",
  "Shoes",
  "Beauty & Personal Care",
  "Home & Kitchen",
  "Electronics & Gadgets",
  "Kids & Baby",
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id serial PRIMARY KEY,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      sort_order integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id serial PRIMARY KEY,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      description text NOT NULL DEFAULT '',
      price numeric(12,2),
      old_price numeric(12,2),
      wholesale_price numeric(12,2),
      wholesale_min_qty integer,
      origin text,
      availability text NOT NULL DEFAULT 'in_stock',
      featured boolean NOT NULL DEFAULT false,
      published boolean NOT NULL DEFAULT true,
      images jsonb NOT NULL DEFAULT '[]'::jsonb,
      category_id integer REFERENCES categories(id) ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id)`;
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id integer PRIMARY KEY DEFAULT 1,
      data jsonb NOT NULL DEFAULT '{}'::jsonb,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;

  const [{ count }] = await sql<{ count: number }[]>`SELECT count(*)::int AS count FROM categories`;
  if (count === 0) {
    for (const [i, name] of DEFAULT_CATEGORIES.entries()) {
      await sql`INSERT INTO categories (name, slug, sort_order) VALUES (${name}, ${slugify(name)}, ${i})`;
    }
    console.log(`  + added ${DEFAULT_CATEGORIES.length} starter categories`);
  }

  console.log("✔ Database is ready");
  await sql.end();
}

main().catch(async (err) => {
  console.error("✖ Database setup failed:", err);
  await sql.end();
  process.exit(1);
});
