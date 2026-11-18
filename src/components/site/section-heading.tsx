/**
 * Type pairing used across the site:
 *   eyebrow → Playfair Display italic (elegant, warm)
 *   title   → Oswald uppercase (bold, matches the logo lettering)
 */
export function SectionHeading({
  eyebrow,
  title,
  center,
  noMargin,
  light,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
  noMargin?: boolean;
  light?: boolean;
}) {
  return (
    <div data-reveal className={`${center ? "text-center" : ""} ${noMargin ? "" : "mb-8"}`}>
      <p className={`font-accent text-lg italic sm:text-xl ${light ? "text-gold-light" : "text-gold-dark"}`}>{eyebrow}</p>
      <h2 className={`mt-0.5 font-display text-3xl uppercase tracking-wide sm:text-4xl ${light ? "text-white" : ""}`}>{title}</h2>
      <span className={`mt-3 block h-[3px] w-14 rounded-full bg-gold-gradient ${center ? "mx-auto" : ""}`} aria-hidden />
    </div>
  );
}

/** Accent eyebrow for page banners (About, Shop, Contact). */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="animate-fade-up font-accent text-lg italic text-gold-light sm:text-xl">{children}</p>;
}
