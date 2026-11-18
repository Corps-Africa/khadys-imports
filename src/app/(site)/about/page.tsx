import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";
import { BoxesIcon, GlobeIcon, ShieldIcon, TagIcon, WhatsAppIcon } from "@/components/site/icons";
import { Eyebrow, SectionHeading } from "@/components/site/section-heading";
import { HeroBackdrop } from "@/components/site/hero";

export const metadata: Metadata = {
  title: "About us",
  description: "Khady's Imports & Essentials: a Ghanaian importation business for affordable, quality and trendy products.",
};

const FAQ: [string, string][] = [
  ["How do I place an order?", "Add products to your basket and tap “Send order on WhatsApp”, or tap the WhatsApp button on any product. We reply to confirm availability, the delivery fee and payment."],
  ["Do you sell wholesale?", "Yes. Many products have a wholesale price for bulk orders. Message us on WhatsApp for our full wholesale price list."],
  ["What does “Pre-order” mean?", "Pre-order items are shipped in our next import batch. We’ll tell you the expected arrival date when you order."],
  ["Can you find a product that isn’t listed?", "Often, yes. Send us a photo or link on WhatsApp and we’ll check if we can source it for you."],
  ["Do you deliver outside Accra?", "We deliver across Ghana. The delivery fee depends on your location and is confirmed before you pay."],
];

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <>
      <section className="bg-ink-texture relative overflow-hidden text-white">
        <HeroBackdrop />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Eyebrow>Our story</Eyebrow>
          <h1 className="mt-1 animate-fade-up font-display text-4xl uppercase tracking-wide [animation-delay:120ms] sm:text-5xl">
            <span className="text-gold-shimmer">About {s.businessName}</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div data-reveal="left" className="space-y-4 text-[16px] leading-relaxed text-ink/85">
          {s.aboutText.split(/\n\s*\n/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <div className="flex flex-wrap gap-3 pt-3">
            <Link href="/products" className="btn-gold">
              Shop now
            </Link>
            <a href={whatsappLink(s.whatsappNumber, `Hello ${s.businessName}!`)} target="_blank" rel="noopener" className="btn-whatsapp">
              <WhatsAppIcon /> Say hello
            </a>
          </div>
        </div>
        <div data-reveal="right" className="group relative aspect-square overflow-hidden rounded-3xl border border-line shadow-xl">
          <Image src="/brand/logo-mockup.jpg" alt={`${s.businessName} logo`} fill sizes="(min-width:768px) 540px, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading eyebrow="Why shop with us" title="What we stand for" center />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: TagIcon, t: "Affordable", d: "Fair prices so more people can enjoy quality products." },
              { Icon: ShieldIcon, t: "Quality", d: "We pick products we would be proud to use ourselves." },
              { Icon: GlobeIcon, t: "Trendy", d: `Fresh, in-demand items sourced from ${s.shipsFrom}.` },
              { Icon: BoxesIcon, t: "Reliable", d: "Clear communication from order to delivery." },
            ].map(({ Icon, t, d }, i) => (
              <div
                key={t}
                data-reveal
                style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
                className="lift group rounded-2xl border border-line bg-cream p-6"
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-ink text-gold-light transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon />
                </span>
                <h3 className="font-display text-xl uppercase tracking-wide">{t}</h3>
                <p className="mt-1.5 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <SectionHeading eyebrow="Good to know" title="Frequently asked questions" center />
        <div className="space-y-3">
          {FAQ.map(([q, a], i) => (
            <details
              key={q}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              className="group rounded-xl border border-line bg-white px-5 py-4 transition-shadow open:border-gold/50 open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sand text-gold-dark transition duration-300 group-open:rotate-45 group-open:bg-gold group-open:text-ink">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
