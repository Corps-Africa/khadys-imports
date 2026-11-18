import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { splitPhones, telLink, whatsappLink } from "@/lib/format";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, TruckIcon, WhatsAppIcon } from "@/components/site/icons";
import { SocialLinks } from "@/components/site/social";
import { Eyebrow } from "@/components/site/section-heading";
import { HeroBackdrop } from "@/components/site/hero";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Call or WhatsApp Khady's Imports & Essentials to order, ask about wholesale, or request a product.",
};

export default async function ContactPage() {
  const s = await getSettings();
  const phones = splitPhones(s.phones);
  const mapQuery = s.mapQuery || s.address;

  return (
    <>
      <section className="bg-ink-texture relative overflow-hidden text-white">
        <HeroBackdrop />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Eyebrow>We&apos;d love to hear from you</Eyebrow>
          <h1 className="mt-1 animate-fade-up font-display text-4xl uppercase tracking-wide [animation-delay:120ms] sm:text-5xl">
            <span className="text-gold-shimmer">Contact us</span>
          </h1>
          <p className="mt-3 max-w-xl animate-fade-up text-white/70 [animation-delay:240ms]">
            The fastest way to reach us is WhatsApp. Ask about a product, place an order or request our wholesale list.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_1.2fr]">
        <div data-reveal="left" className="space-y-4">
          <a
            href={whatsappLink(s.whatsappNumber, `Hello ${s.businessName}!`)}
            target="_blank"
            rel="noopener"
            className="lift group flex items-center gap-4 rounded-2xl bg-whatsapp p-5 text-white shadow-lg hover:bg-whatsapp-dark"
          >
            <WhatsAppIcon className="h-9 w-9 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span>
              <span className="block text-sm opacity-90">Chat with us on WhatsApp</span>
              <span className="font-display text-2xl tracking-wide">Start a chat</span>
            </span>
          </a>

          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            {phones.map((p) => (
              <ContactRow key={p} Icon={PhoneIcon} label="Call">
                <a href={telLink(p)} className="hover:text-gold-dark">
                  {p}
                </a>
              </ContactRow>
            ))}
            {s.email && (
              <ContactRow Icon={MailIcon} label="Email">
                <a href={`mailto:${s.email}`} className="break-all hover:text-gold-dark">
                  {s.email}
                </a>
              </ContactRow>
            )}
            {s.address && (
              <ContactRow Icon={PinIcon} label="Location">
                <span className="whitespace-pre-line">{s.address}</span>
              </ContactRow>
            )}
            {s.openingHours && (
              <ContactRow Icon={ClockIcon} label="Hours">
                {s.openingHours}
              </ContactRow>
            )}
            {s.deliveryInfo && (
              <ContactRow Icon={TruckIcon} label="Delivery">
                {s.deliveryInfo}
              </ContactRow>
            )}
          </ul>

          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="mb-3 text-sm font-semibold">Follow us for new arrivals</p>
            <SocialLinks s={s} tone="light" />
          </div>
        </div>

        <div data-reveal="right" className="min-h-[320px] overflow-hidden rounded-2xl border border-line bg-sand">
          {mapQuery ? (
            <iframe
              title={`Map showing ${s.businessName}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              className="h-full min-h-[320px] w-full md:min-h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="bg-ink-texture flex h-full min-h-[320px] flex-col items-center justify-center p-8 text-center text-white">
              <PinIcon className="h-10 w-10 text-gold" />
              <p className="mt-3 font-display text-2xl uppercase tracking-wide">Delivering across Ghana</p>
              <p className="mt-2 max-w-xs text-sm text-white/70">Message us on WhatsApp to arrange delivery or a pickup point near you.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ContactRow({
  Icon,
  label,
  children,
}: {
  Icon: (p: { className?: string }) => React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4 px-5 py-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-gold-dark">
        <Icon />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        <div className="font-medium">{children}</div>
      </div>
    </li>
  );
}
