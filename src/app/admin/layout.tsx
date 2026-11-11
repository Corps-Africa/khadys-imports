import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | Khady's Imports" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-full flex-1 bg-[#f6f4ef]">{children}</div>;
}
