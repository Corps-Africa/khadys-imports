import Link from "next/link";
import { cacheLife } from "next/cache";
import type { SiteSettings } from "@/db/schema";
import { splitPhones, telLink, whatsappLink } from "@/lib/format";
import { Logo } from "./logo";
import { NAV } from "./header";
import { SocialLinks } from "./social";
import { WhatsAppIcon } from "./icons";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter({ s }: { s: SiteSettings }) {
  return (
    <footer className="bg-ink-texture mt-auto text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo logoUrl={s.logoUrl} />
          <p className="max-w-sm text-sm leading-relaxed">{s.tagline}. We ship from {s.shipsFrom} to customers across Ghana.</p>
          <SocialLinks s={s} />
        </div>
        <div>
          <h3 className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-gold">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-gold-light">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-gold">Order &amp; enquiries</h3>
          <ul className="space-y-2.5 text-sm">
            {splitPhones(s.phones).map((p) => (
              <li key={p}>
                <a href={telLink(p)} className="hover:text-gold-light">
                  {p}
                </a>
              </li>
            ))}
            {s.email && (
              <li>
                <a href={`mailto:${s.email}`} className="hover:text-gold-light">
                  {s.email}
                </a>
              </li>
            )}
            {s.openingHours && <li>{s.openingHours}</li>}
          </ul>
          <a href={whatsappLink(s.whatsappNumber, `Hello ${s.businessName}!`)} target="_blank" rel="noopener" className="btn-whatsapp mt-5">
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>
            © {await currentYear()} {s.businessName}. All rights reserved.
          </p>
          <p>Prices in Ghana Cedis (GH₵). Delivery fees confirmed on WhatsApp.</p>
        </div>
      </div>
    </footer>
  );
}
