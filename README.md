# Khady's Imports & Essentials website

An online shop for a Ghanaian importation business. Customers browse products, add them to a basket and **send the order on WhatsApp**. The owner manages products, categories and shop details from an **admin dashboard** at `/admin`, with no technical help needed.

**Stack:** Next.js 16 (App Router, Cache Components) · Postgres (Neon) via Drizzle ORM · Vercel Blob for photos · Tailwind CSS 4

## What's included

| Area | Features |
|---|---|
| **Home** | Hero, trust strip, categories, featured products, how-to-order, wholesale call to action, Instagram/TikTok |
| **Shop** `/products` | Category filters, search, sale and stock badges, wholesale price on each card |
| **Product** `/products/[slug]` | Photo gallery, quantity, add to basket, "Order this on WhatsApp", related products |
| **Basket** | Saved on the customer's phone; one tap sends the full order with links and estimated total to WhatsApp |
| **About** `/about` | Story (editable), values, FAQ |
| **Contact** `/contact` | WhatsApp, phones, email, hours, delivery info, Google Map (shown only when a location is set) |
| **Admin** `/admin` | Password login; add/edit/delete products with phone photo upload (auto-compressed), reorder photos, one-tap Hide / Featured / Sold out; manage categories; edit contact details, social links, homepage and About text, logo and homepage picture |

Public pages are cached and served instantly. Every admin change refreshes the affected pages right away.

## Deploy to Vercel

1. Push this folder to a GitHub repo and **Import** it in Vercel.
2. In the Vercel project go to **Storage**:
   - **Create → Neon (Postgres)** and connect it to the project. This adds `DATABASE_URL`.
   - **Create → Blob** and connect it. This adds `BLOB_READ_WRITE_TOKEN`.
3. In **Settings → Environment Variables** add:
   - `ADMIN_PASSWORD`: the owner's admin password (long and unique)
   - `SESSION_SECRET`: a random string of at least 32 characters (`openssl rand -base64 32`)
   - `NEXT_PUBLIC_SITE_URL`: the live URL, e.g. `https://khadysimports.com`
4. **Redeploy.** The build runs `scripts/migrate.ts` first, which creates the tables and starter categories automatically.
5. Add the custom domain under **Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL`.

> If Neon gives both a pooled and an unpooled URL, use the **pooled** one for `DATABASE_URL`.

## Run locally

```bash
cp .env.example .env.local   # then fill in DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET
npm install
npm run db:setup             # create tables
npm run seed:demo            # optional: 8 clearly-labelled sample products
npm run dev
```

Without `BLOB_READ_WRITE_TOKEN`, uploads are saved to `./.uploads` and served from `/media/…` (development only).

## Owner handbook (short)

- Go to `yoursite.com/admin` and sign in.
- **Products → + Add product**: add photos (the first is the main one), name, price in GH₵, then **Publish**. Leave the price empty to show "Ask for price".
- Tap the badges in the product list to **hide**, **feature** (homepage) or mark **sold out**.
- **Shop settings** changes the WhatsApp number that receives orders, phone numbers, socials, address/map and homepage text.

## Project layout

```
src/app/(site)/        public pages
src/app/admin/         login, dashboard and server actions (actions.ts)
src/app/api/upload/    Vercel Blob upload tokens (admin only)
src/components/site/   header, footer, cart/basket, product card…
src/components/admin/  product form, image uploader, settings form…
src/db/schema.ts       tables + default shop settings
src/lib/data.ts        cached public queries + admin queries
scripts/migrate.ts     idempotent DB setup (runs before every build)
```
