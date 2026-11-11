"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { del } from "@vercel/blob";
import { db } from "@/db";
import { AVAILABILITY, categories, products, settings, type SiteSettings } from "@/db/schema";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { TAGS } from "@/lib/data";
import { slugify, toWhatsAppNumber } from "@/lib/format";

export type FormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> } | undefined;

// ---------- Auth ----------

const failedLogins = new Map<string, { count: number; until: number }>();

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rec = failedLogins.get(ip);
  if (rec && rec.until > Date.now()) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }
  const password = String(fd.get("password") || "");
  if (!password || !checkPassword(password)) {
    const count = (rec?.count ?? 0) + 1;
    failedLogins.set(ip, { count, until: count >= 5 ? Date.now() + 5 * 60_000 : 0 });
    await new Promise((r) => setTimeout(r, 600));
    return { error: "That password is not correct." };
  }
  failedLogins.delete(ip);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Helpers ----------

const money = z.preprocess((v) => {
  const s = String(v ?? "").replace(/[,\s]|GH₵|GHS|ghs|¢/g, "");
  return s === "" ? null : Number(s);
}, z.number().nonnegative("Must be 0 or more").max(10_000_000).nullable());

const optInt = z.preprocess((v) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : Number(s);
}, z.number().int("Enter a whole number").positive().max(100_000).nullable());

function fieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of err.issues) {
    // Zod's NaN message is technical; show something friendlier.
    out[String(i.path[0])] ??= /expected number/.test(i.message) ? "Please enter numbers only, e.g. 250" : i.message;
  }
  return out;
}

async function uniqueProductSlug(base: string, excludeId?: number) {
  const root = slugify(base) || "product";
  let slug = root;
  for (let n = 2; ; n++) {
    const clash = await db.query.products.findFirst({
      where: excludeId ? and(eq(products.slug, slug), ne(products.id, excludeId)) : eq(products.slug, slug),
      columns: { id: true },
    });
    if (!clash) return slug;
    slug = `${root}-${n}`;
  }
}

async function deleteImages(urls: string[]) {
  for (const url of urls) {
    try {
      if (url.includes(".blob.vercel-storage.com") && process.env.BLOB_READ_WRITE_TOKEN) {
        await del(url);
      } else if (url.startsWith("/media/")) {
        await unlink(path.join(process.cwd(), ".uploads", path.basename(url)));
      }
    } catch {
      // Best effort: a missing file shouldn't block the edit.
    }
  }
}

// ---------- Products ----------

const productSchema = z.object({
  id: optInt,
  name: z.string().trim().min(2, "Please enter a product name").max(140),
  description: z.string().trim().max(5000).default(""),
  price: money,
  oldPrice: money,
  wholesalePrice: money,
  wholesaleMinQty: optInt,
  origin: z.string().trim().max(40).default(""),
  availability: z.enum(AVAILABILITY),
  categoryId: optInt,
  featured: z.boolean(),
  published: z.boolean(),
  images: z.array(z.string().max(1000)).max(10, "Up to 10 photos per product"),
});

export async function saveProduct(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  let images: unknown = [];
  try {
    images = JSON.parse(String(fd.get("images") || "[]"));
  } catch {}
  const parsed = productSchema.safeParse({
    id: fd.get("id"),
    name: fd.get("name"),
    description: fd.get("description") ?? "",
    price: fd.get("price"),
    oldPrice: fd.get("oldPrice"),
    wholesalePrice: fd.get("wholesalePrice"),
    wholesaleMinQty: fd.get("wholesaleMinQty"),
    origin: fd.get("origin") ?? "",
    availability: fd.get("availability"),
    categoryId: fd.get("categoryId"),
    featured: fd.get("featured") === "on",
    published: fd.get("published") === "on",
    images,
  });
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const { id, ...data } = parsed.data;
  const values = { ...data, origin: data.origin || null, updatedAt: new Date() };

  if (id) {
    const existing = await db.query.products.findFirst({ where: eq(products.id, id) });
    if (!existing) return { error: "This product no longer exists." };
    const slug = existing.name === data.name ? existing.slug : await uniqueProductSlug(data.name, id);
    await db.update(products).set({ ...values, slug }).where(eq(products.id, id));
    await deleteImages(existing.images.filter((u) => !data.images.includes(u)));
  } else {
    await db.insert(products).values({ ...values, slug: await uniqueProductSlug(data.name) });
  }
  updateTag(TAGS.products);
  redirect(`/admin/products?saved=${encodeURIComponent(data.name)}`);
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const [row] = await db.delete(products).where(eq(products.id, id)).returning();
  if (row) await deleteImages(row.images);
  updateTag(TAGS.products);
  redirect("/admin/products?deleted=1");
}

export async function toggleProduct(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const field = String(fd.get("field"));
  const p = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!p) return;
  if (field === "published") await db.update(products).set({ published: !p.published }).where(eq(products.id, id));
  if (field === "featured") await db.update(products).set({ featured: !p.featured }).where(eq(products.id, id));
  if (field === "sold_out")
    await db
      .update(products)
      .set({ availability: p.availability === "sold_out" ? "in_stock" : "sold_out" })
      .where(eq(products.id, id));
  updateTag(TAGS.products);
}

// ---------- Categories ----------

export async function createCategory(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(fd.get("name") || "").trim();
  if (name.length < 2) return { error: "Please enter a category name." };
  const slug = slugify(name);
  const clash = await db.query.categories.findFirst({ where: eq(categories.slug, slug) });
  if (clash) return { error: `“${clash.name}” already exists.` };
  const all = await db.select({ s: categories.sortOrder }).from(categories);
  await db.insert(categories).values({ name, slug, sortOrder: Math.max(-1, ...all.map((c) => c.s)) + 1 });
  updateTag(TAGS.categories);
  updateTag(TAGS.products);
  return { ok: true };
}

export async function updateCategory(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const name = String(fd.get("name") || "").trim();
  const sortOrder = Number(fd.get("sortOrder") || 0);
  if (name.length < 2) return;
  const slug = slugify(name);
  const clash = await db.query.categories.findFirst({ where: and(eq(categories.slug, slug), ne(categories.id, id)) });
  await db
    .update(categories)
    .set({ name, sortOrder, ...(clash ? {} : { slug }) })
    .where(eq(categories.id, id));
  updateTag(TAGS.categories);
  updateTag(TAGS.products);
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  await db.delete(categories).where(eq(categories.id, Number(fd.get("id"))));
  updateTag(TAGS.categories);
  updateTag(TAGS.products);
}

// ---------- Settings ----------

const SETTINGS_KEYS: (keyof SiteSettings)[] = [
  "businessName", "tagline", "shipsFrom", "heroTitle", "heroSubtitle", "aboutText",
  "whatsappNumber", "phones", "email", "address", "mapQuery", "openingHours",
  "deliveryInfo", "instagram", "tiktok", "facebook", "logoUrl", "heroImageUrl",
];

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const data: Partial<SiteSettings> = {};
  for (const k of SETTINGS_KEYS) data[k] = String(fd.get(k) ?? "").trim().slice(0, 4000);

  const errors: Record<string, string> = {};
  if (!data.businessName) errors.businessName = "Required";
  const wa = toWhatsAppNumber(data.whatsappNumber || "");
  if (wa.length < 11 || wa.length > 15) errors.whatsappNumber = "Enter a full number, e.g. 0550565695 or 233550565695";
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "That email doesn't look right";
  if (Object.keys(errors).length) return { error: "Please fix the highlighted fields.", fieldErrors: errors };
  data.whatsappNumber = wa;

  await db
    .insert(settings)
    .values({ id: 1, data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: settings.id, set: { data, updatedAt: new Date() } });
  updateTag(TAGS.settings);
  return { ok: true };
}
