import { getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";
import { CartProvider } from "@/components/site/cart";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WhatsAppIcon } from "@/components/site/icons";
import { HeaderScrollState, RevealObserver } from "@/components/site/reveal-observer";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const s = await getSettings();
  return (
    <CartProvider whatsappNumber={s.whatsappNumber} businessName={s.businessName}>
      <SiteHeader logoUrl={s.logoUrl} shipsFrom={s.shipsFrom} />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <SiteFooter s={s} />
      <a
        href={whatsappLink(s.whatsappNumber, `Hello ${s.businessName}! I have a question.`)}
        target="_blank"
        rel="noopener"
        aria-label="Chat with us on WhatsApp"
        className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 animate-fade-up place-items-center rounded-full bg-whatsapp text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition hover:scale-110 [animation-delay:1.2s]"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-whatsapp" aria-hidden />
        <WhatsAppIcon className="relative h-7 w-7 transition-transform group-hover:rotate-12" />
      </a>
      <RevealObserver />
      <HeaderScrollState />
    </CartProvider>
  );
}
