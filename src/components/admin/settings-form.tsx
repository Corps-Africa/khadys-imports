"use client";

import { startTransition, useActionState, useState } from "react";
import type { SiteSettings } from "@/db/schema";
import { saveSettings } from "@/app/admin/actions";
import { ImageUploader } from "./image-uploader";

export function SettingsForm({ s, useBlob }: { s: SiteSettings; useBlob: boolean }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const [logo, setLogo] = useState(s.logoUrl ? [s.logoUrl] : []);
  const [hero, setHero] = useState(s.heroImageUrl ? [s.heroImageUrl] : []);
  const fe = state?.fieldErrors ?? {};


  return (
    <form
      action={action}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-6"
    >
      <input type="hidden" name="logoUrl" value={logo[0] ?? ""} />
      <input type="hidden" name="heroImageUrl" value={hero[0] ?? ""} />

      <Section title="Contact & ordering">
        <F s={s} fe={fe} name="whatsappNumber" label="WhatsApp number for orders *" hint="All “Order on WhatsApp” buttons go to this number." placeholder="0550565695" />
        <F s={s} fe={fe} name="phones" label="Phone numbers" hint="Separate with commas." placeholder="0550565695, 0204330990" />
        <F s={s} fe={fe} name="email" label="Email" placeholder="hello@khadysimports.com" />
        <F s={s} fe={fe} name="openingHours" label="Opening hours" />
        <F s={s} fe={fe} name="deliveryInfo" label="Delivery information" textarea rows={2} />
        <F s={s} fe={fe} name="address" label="Address / location" textarea rows={2} hint="Leave empty if you don't have a shop yet." />
        <F s={s} fe={fe} name="mapQuery" label="Google Maps search" hint="What to show on the map, e.g. “Madina Market, Accra”. Uses the address if empty. Leave both empty to hide the map." />
      </Section>

      <Section title="Social media">
        <F s={s} fe={fe} name="instagram" label="Instagram username" placeholder="kadis_imports" />
        <F s={s} fe={fe} name="tiktok" label="TikTok username" placeholder="khadysimports" />
        <F s={s} fe={fe} name="facebook" label="Facebook page (optional)" />
      </Section>

      <Section title="Homepage & About">
        <F s={s} fe={fe} name="businessName" label="Business name *" />
        <F s={s} fe={fe} name="tagline" label="Short tagline" />
        <F s={s} fe={fe} name="shipsFrom" label="We ship from" hint="Shown in the gold bar at the top of every page." />
        <F s={s} fe={fe} name="heroTitle" label="Homepage headline" />
        <F s={s} fe={fe} name="heroSubtitle" label="Homepage intro" textarea />
        <F s={s} fe={fe} name="aboutText" label="About us" textarea rows={7} hint="Leave an empty line between paragraphs." />
      </Section>

      <Section title="Images">
        <div>
          <p className="label">Logo (optional)</p>
          <p className="hint mb-3">A transparent PNG works best. If empty, the built-in gold logo is used.</p>
          <ImageUploader value={logo} onChange={(v) => setLogo(v.slice(-1))} useBlob={useBlob} max={1} />
        </div>
        <div>
          <p className="label">Homepage picture (optional)</p>
          <p className="hint mb-3">A square photo of your products. If empty, your logo artwork is shown.</p>
          <ImageUploader value={hero} onChange={(v) => setHero(v.slice(-1))} useBlob={useBlob} max={1} />
        </div>
      </Section>

      {state?.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">✓ Saved. Your website is updated.</p>}

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-[#f6f4ef]/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <button disabled={pending} className="btn-gold w-full py-3 text-base sm:w-auto sm:px-10">
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="font-display text-lg uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

function F({ s, fe, name, label, hint, textarea, rows = 3, placeholder }: { s: SiteSettings; fe: Record<string, string>; name: keyof SiteSettings; label: string; hint?: string; textarea?: boolean; rows?: number; placeholder?: string }) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      {textarea ? (
        <textarea id={name} name={name} defaultValue={s[name]} rows={rows} className="field" placeholder={placeholder} />
      ) : (
        <input id={name} name={name} defaultValue={s[name]} className="field" placeholder={placeholder} />
      )}
      {hint && <p className="hint">{hint}</p>}
      {fe[name] && <p className="mt-1 text-xs font-medium text-red-600">{fe[name]}</p>}
    </div>
  );
}
