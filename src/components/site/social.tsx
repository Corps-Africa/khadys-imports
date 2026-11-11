import type { SiteSettings } from "@/db/schema";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./icons";

export function handle(h: string) {
  return h.replace(/^@/, "").replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "").replace(/^@/, "");
}

export function socialLinks(s: SiteSettings) {
  const out: { label: string; href: string; handle: string; Icon: typeof InstagramIcon }[] = [];
  if (s.instagram) out.push({ label: "Instagram", href: `https://instagram.com/${handle(s.instagram)}`, handle: handle(s.instagram), Icon: InstagramIcon });
  if (s.tiktok) out.push({ label: "TikTok", href: `https://www.tiktok.com/@${handle(s.tiktok)}`, handle: handle(s.tiktok), Icon: TikTokIcon });
  if (s.facebook) out.push({ label: "Facebook", href: s.facebook.startsWith("http") ? s.facebook : `https://facebook.com/${handle(s.facebook)}`, handle: handle(s.facebook), Icon: FacebookIcon });
  return out;
}

export function SocialLinks({ s, tone = "dark" }: { s: SiteSettings; tone?: "dark" | "light" }) {
  return (
    <div className="flex gap-2">
      {socialLinks(s).map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener"
          aria-label={label}
          className={`grid h-10 w-10 place-items-center rounded-full border transition ${
            tone === "dark"
              ? "border-white/15 text-white/80 hover:border-gold hover:text-gold-light"
              : "border-line bg-white text-ink hover:border-gold hover:text-gold-dark"
          }`}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
