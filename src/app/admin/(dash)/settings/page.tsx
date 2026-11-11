import { adminGetSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  const s = await adminGetSettings();
  return (
    <>
      <h1 className="font-display text-3xl uppercase tracking-wide">Shop settings</h1>
      <p className="mb-6 text-sm text-muted">Contact details, social links and the text on your homepage and About page.</p>
      <SettingsForm s={s} useBlob={!!process.env.BLOB_READ_WRITE_TOKEN} />
    </>
  );
}
