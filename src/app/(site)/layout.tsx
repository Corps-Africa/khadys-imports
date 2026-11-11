import { getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";
import { CartProvider } from "@/components/site/cart";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WhatsAppIcon } from "@/components/site/icons";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const s = await getSettings();
  return (
    <CartProvider whatsappNumber={s.whatsappNumber} businessName={s.businessName}>
      <SiteHeader logoUrl={s.logoUrl} shipsFrom={s.shipsFrom} />
      <main className="flex-1">{children}</main>
      <SiteFooter s={s} />
      <a
        href={whatsappLink(s.whatsappNumber, `Hello ${s.businessName}! I have a question.`)}
        target="_blank"
        rel="noopener"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </CartProvider>
  );
}
