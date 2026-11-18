/**
 * Adds a handful of clearly-labelled SAMPLE products so the shop isn't empty
 * while the client loads their real catalogue. Delete them from /admin.
 *   npm run seed:demo
 */
import "./load-env";
import postgres from "postgres";
import { getDatabaseUrl, MISSING_DB_MESSAGE } from "../src/db/url";

const url = getDatabaseUrl();
if (!url) {
  console.error(MISSING_DB_MESSAGE);
  process.exit(1);
}
const sql = postgres(url, { max: 1, prepare: false });

const samples: [string, string, number | null, number | null, string, boolean][] = [
  // name, category slug, price, oldPrice, origin, featured
  ["Sample – Ladies Tote Handbag", "fashion-and-bags", 250, 320, "China", true],
  ["Sample – Unisex Sneakers", "shoes", 380, null, "Turkey", true],
  ["Sample – Non-stick Cookware Set (5 pcs)", "home-and-kitchen", 650, 750, "China", true],
  ["Sample – Wireless Earbuds", "electronics-and-gadgets", 180, null, "China", true],
  ["Sample – Shea Body Butter Gift Set", "beauty-and-personal-care", 120, null, "Nigeria", false],
  ["Sample – Kids Backpack", "kids-and-baby", 95, null, "China", false],
  ["Sample – Men's Turkish Polo Shirt", "fashion-and-bags", 160, null, "Turkey", false],
  ["Sample – Rechargeable Blender", "home-and-kitchen", null, null, "China", false],
];

function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main() {
  for (const [name, cat, price, oldPrice, origin, featured] of samples) {
    const [c] = await sql<{ id: number }[]>`SELECT id FROM categories WHERE slug = ${cat}`;
    await sql`
      INSERT INTO products (name, slug, description, price, old_price, wholesale_price, wholesale_min_qty, origin, featured, category_id, availability)
      VALUES (${name}, ${slugify(name)},
        ${"This is a sample product to show how the shop looks. Replace it with your own product photos, price and description from the admin dashboard."},
        ${price}, ${oldPrice}, ${price ? Math.round(price * 0.85) : null}, ${price ? 6 : null}, ${origin}, ${featured}, ${c?.id ?? null},
        ${price === null ? "preorder" : "in_stock"})
      ON CONFLICT (slug) DO NOTHING`;
  }
  console.log(`✔ Added up to ${samples.length} sample products`);
  await sql.end();
}

main();
