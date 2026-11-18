import type { Metadata, Viewport } from "next";
import { Montserrat, Oswald, Playfair_Display } from "next/font/google";
import "./globals.css";

const body = Montserrat({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const heading = Oswald({ variable: "--font-heading", subsets: ["latin"], display: "swap" });
// Elegant italic serif used sparingly for accents (eyebrows, quotes, highlighted words).
const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Khady's Imports & Essentials | Affordable quality imports in Ghana",
    template: "%s | Khady's Imports",
  },
  description:
    "Affordable, quality and trendy products imported from China, Turkey & Nigeria. Retail and wholesale across Ghana. Order easily on WhatsApp.",
  openGraph: {
    type: "website",
    siteName: "Khady's Imports & Essentials",
    images: ["/brand/logo-mockup.jpg"],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#121419",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GH" className={`${body.variable} ${heading.variable} ${serif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
