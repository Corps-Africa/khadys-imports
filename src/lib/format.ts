export function formatCedi(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return null;
  return (
    "GH₵ " +
    amount.toLocaleString("en-GH", {
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const AVAILABILITY_LABEL = {
  in_stock: "In stock",
  preorder: "Pre-order",
  sold_out: "Sold out",
} as const;

/** "0550565695" or "+233 55 056 5695" -> "233550565695" */
export function toWhatsAppNumber(input: string) {
  let d = (input || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "233" + d.slice(1);
  return d;
}

export function whatsappLink(number: string, message?: string) {
  const n = toWhatsAppNumber(number);
  return `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function splitPhones(phones: string) {
  return phones
    .split(/[,|/]/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function telLink(phone: string) {
  return `tel:+${toWhatsAppNumber(phone)}`;
}
