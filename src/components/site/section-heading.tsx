export function SectionHeading({
  eyebrow,
  title,
  center,
  noMargin,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
  noMargin?: boolean;
}) {
  return (
    <div className={`${center ? "text-center" : ""} ${noMargin ? "" : "mb-8"}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">{eyebrow}</p>
      <h2 className="mt-1 font-display text-3xl uppercase tracking-wide sm:text-4xl">{title}</h2>
    </div>
  );
}
