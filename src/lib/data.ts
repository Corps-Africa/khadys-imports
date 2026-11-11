import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, settings, DEFAULT_SETTINGS, type SiteSettings } from "@/db/schema";

/*
 * Public (cached) reads. Everything here is tagged so admin edits can
 * expire it immediately with updateTag() — see src/app/admin/actions.ts.
 */

export const TAGS = { products: "products", categories: "categories", settings: "settings" } as const;

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("max");
  const row = await db.query.settings.findFirst({ where: eq(settings.id, 1) });
  return { ...DEFAULT_SETTINGS, ...stripEmpty(row?.data ?? {}) };
}

/** Admin-entered blanks shouldn't fall back to defaults for optional fields, but
 *  required display fields should. Keep only keys the admin actually saved. */
function stripEmpty(data: Partial<SiteSettings>) {
  const required: (keyof SiteSettings)[] = ["businessName", "heroTitle", "whatsappNumber"];
  const out: Partial<SiteSettings> = {};
  for (const [k, v] of Object.entries(data) as [keyof SiteSettings, string][]) {
    if (required.includes(k) && !v?.trim()) continue;
    out[k] = v;
  }
  return out;
}

export async function getCategories() {
  "use cache";
  cacheTag(TAGS.categories);
  cacheLife("max");
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
}

export type PublicProduct = Awaited<ReturnType<typeof getPublishedProducts>>[number];

export async function getPublishedProducts() {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("max");
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      oldPrice: products.oldPrice,
      wholesalePrice: products.wholesalePrice,
      wholesaleMinQty: products.wholesaleMinQty,
      origin: products.origin,
      availability: products.availability,
      featured: products.featured,
      images: products.images,
      categoryId: products.categoryId,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.published, true))
    .orderBy(desc(products.featured), desc(products.createdAt));
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("max");
  const all = await getPublishedProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

// ---- Admin (uncached, always fresh) ----

export async function adminListProducts() {
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      availability: products.availability,
      featured: products.featured,
      published: products.published,
      images: products.images,
      categoryName: categories.name,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.updatedAt));
}

export async function adminGetProduct(id: number) {
  return db.query.products.findFirst({ where: eq(products.id, id) });
}

export async function adminCategoriesWithCounts() {
  const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
  const prods = await db.select({ categoryId: products.categoryId }).from(products);
  return cats.map((c) => ({ ...c, count: prods.filter((p) => p.categoryId === c.id).length }));
}

export async function adminGetSettings(): Promise<SiteSettings> {
  const row = await db.query.settings.findFirst({ where: eq(settings.id, 1) });
  return { ...DEFAULT_SETTINGS, ...(row?.data ?? {}) };
}

export async function adminStats() {
  const all = await db
    .select({ published: products.published, availability: products.availability, featured: products.featured })
    .from(products);
  const cats = await db.select({ id: categories.id }).from(categories);
  return {
    total: all.length,
    live: all.filter((p) => p.published).length,
    hidden: all.filter((p) => !p.published).length,
    soldOut: all.filter((p) => p.availability === "sold_out").length,
    featured: all.filter((p) => p.featured).length,
    categories: cats.length,
  };
}
