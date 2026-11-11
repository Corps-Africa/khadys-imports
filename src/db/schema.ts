import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const AVAILABILITY = ["in_stock", "preorder", "sold_out"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 12, scale: 2, mode: "number" }),
  oldPrice: numeric("old_price", { precision: 12, scale: 2, mode: "number" }),
  wholesalePrice: numeric("wholesale_price", { precision: 12, scale: 2, mode: "number" }),
  wholesaleMinQty: integer("wholesale_min_qty"),
  origin: text("origin"),
  availability: text("availability").$type<Availability>().notNull().default("in_stock"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  data: jsonb("data").$type<Partial<SiteSettings>>().notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;

export type SiteSettings = {
  businessName: string;
  tagline: string;
  shipsFrom: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  whatsappNumber: string;
  phones: string;
  email: string;
  address: string;
  mapQuery: string;
  openingHours: string;
  deliveryInfo: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  logoUrl: string;
  heroImageUrl: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  businessName: "Khady's Imports & Essentials",
  tagline: "Affordable, quality & trendy imports",
  shipsFrom: "China, Turkey & Nigeria",
  heroTitle: "Quality imports at prices you'll love",
  heroSubtitle:
    "Trendy, affordable products shipped from China, Turkey & Nigeria to Ghana. Shop retail or buy wholesale for your business. Just order on WhatsApp.",
  aboutText:
    "Khady's Imports & Essentials is a Ghanaian mini-importation business that brings affordable, quality and trendy products to your doorstep. We serve students, families, professionals, resellers and small businesses, for retail and wholesale.\n\nOur goal is to become a trusted importation brand in Ghana, keep growing our product range, open a physical store and create jobs in our community.",
  whatsappNumber: "233550565695",
  phones: "0550565695, 0204330990",
  email: "",
  address: "",
  mapQuery: "",
  openingHours: "Mon – Sat, 8:00am – 8:00pm",
  deliveryInfo: "Delivery available across Ghana. Pickup can be arranged.",
  instagram: "kadis_imports",
  tiktok: "khadysimports",
  facebook: "",
  logoUrl: "",
  heroImageUrl: "",
};
