import Image from "next/image";
import Link from "next/link";
import { getCategories, getPublishedProducts, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";
import { ProductCard } from "@/components/site/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import { socialLinks } from "@/components/site/social";
import { BoxesIcon, GlobeIcon, ShieldIcon, TruckIcon, WhatsAppIcon } from "@/components/site/icons";

export default async function HomePage() {
  const [s, cats, all] = await Promise.all([getSettings(), getCategories(), getPublishedProducts()]);
  const featured = all.filter((p) => p.featured);
  const showcase = (featured.length >= 4 ? featured : [...featured, ...all.filter((p) => !p.featured)]).slice(0, 8);
  const catsWithItems = cats.filter((c) => all.some((p) => p.categoryId === c.id));

  return (
    <>
      {/* HERO */}
      <section className="bg-ink-texture relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-light">
              <GlobeIcon className="h-4 w-4" /> {s.businessName}
            </p>
            <h1 className="font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl lg:text-6xl">
              <span className="text-gold-gradient">{s.heroTitle}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{s.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-gold px-7 py-3.5 text-base">
                Shop products
              </Link>
              <a
                href={whatsappLink(s.whatsappNumber, `Hello ${s.businessName}! I'd like to place an order.`)}
                target="_blank"
                rel="noopener"
                className="btn-whatsapp px-7 py-3.5 text-base"
              >
                <WhatsAppIcon /> Order on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gold/10 blur-2xl" aria-hidden />
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-gold/25 shadow-2xl">
              <Image
                src={s.heroImageUrl || "/brand/logo-mockup.jpg"}
                alt={s.businessName}
                fill
                priority
                sizes="(min-width:768px) 480px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          {[
            { Icon: GlobeIcon, title: "Direct imports", text: `Sourced from ${s.shipsFrom}` },
            { Icon: BoxesIcon, title: "Retail & wholesale", text: "Single items or bulk for resellers" },
            { Icon: TruckIcon, title: "Delivery in Ghana", text: "Doorstep delivery or pickup" },
            { Icon: ShieldIcon, title: "Quality checked", text: "Affordable without cutting corners" },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 bg-white px-4 py-5 sm:px-6">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-gold-dark">
                <Icon />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      {catsWithItems.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-14">
          <SectionHeading eyebrow="Browse" title="Shop by category" />
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {catsWithItems.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="shrink-0 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:bg-gold/10"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Hand-picked" title="Featured products" noMargin />
          <Link href="/products" className="shrink-0 text-sm font-semibold text-gold-dark hover:underline">
            View all →
          </Link>
        </div>
        {showcase.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {showcase.map((p, i) => (
              <ProductCard key={p.id} p={p} priority={i < 2} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
            New products are on the way. Message us on WhatsApp to see what&apos;s in stock today.
          </div>
        )}
      </section>

      {/* HOW TO ORDER */}
      <section className="bg-sand/60">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading eyebrow="Simple & personal" title="How to order" center />
          <ol className="grid gap-5 md:grid-cols-3">
            {[
              ["Browse & pick", "Find what you love and add it to your basket, or tap the WhatsApp button on any product."],
              ["Send on WhatsApp", "Your order is sent to us on WhatsApp. We confirm availability, delivery fee and payment."],
              ["Receive your items", "We deliver to your doorstep anywhere in Ghana, or you can arrange a pickup."],
            ].map(([t, d], i) => (
              <li key={t} className="relative rounded-2xl border border-line bg-white p-6">
                <span className="bg-gold-gradient mb-4 grid h-11 w-11 place-items-center rounded-full font-display text-lg text-ink">
                  {i + 1}
                </span>
                <h3 className="font-display text-xl uppercase tracking-wide">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHOLESALE */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="bg-ink-texture flex flex-col items-start gap-6 overflow-hidden rounded-3xl p-8 text-white sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">For resellers &amp; small businesses</p>
            <h2 className="mt-2 font-display text-3xl uppercase leading-tight sm:text-4xl">
              Buy in bulk at <span className="text-gold-gradient">wholesale prices</span>
            </h2>
            <p className="mt-3 text-white/70">
              Stock your shop with trending products. Tell us what you need and we&apos;ll send you our wholesale price list.
            </p>
          </div>
          <a
            href={whatsappLink(s.whatsappNumber, `Hello ${s.businessName}! I'm interested in buying wholesale. Please send your price list.`)}
            target="_blank"
            rel="noopener"
            className="btn-gold shrink-0 px-7 py-3.5 text-base"
          >
            Get wholesale prices
          </a>
        </div>
      </section>

      {/* SOCIAL */}
      {socialLinks(s).length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <SectionHeading eyebrow="New arrivals first" title="Follow us for daily drops" center />
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {socialLinks(s).map(({ label, href, handle, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-gold hover:shadow-md"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-gold-light">
                  <Icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
                  <span className="text-lg font-semibold group-hover:text-gold-dark">@{handle}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
