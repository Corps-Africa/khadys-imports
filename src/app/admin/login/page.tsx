import type { Metadata } from "next";
import { LogoMark } from "@/components/site/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="bg-ink-texture flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink">
            <LogoMark className="h-11 w-11" />
          </span>
          <h1 className="mt-4 font-display text-2xl uppercase tracking-wide">Shop admin</h1>
          <p className="text-sm text-muted">Sign in to manage your products</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
