import { useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/lib/site-content";
import {
  isValidSocialUrl,
  socialItemsFrom,
  socialKeyPrefix,
  socialPlatform,
  socialPlatforms,
  type SocialItem,
} from "@/lib/social";

export function SocialPanel() {
  const { content, reload } = useSiteContent();
  const items = socialItemsFrom(content);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [newPlatform, setNewPlatform] = useState(socialPlatforms[0]!.id);
  const [newUrl, setNewUrl] = useState("");

  const writeSlots = async (list: { platform: string; url: string }[]) => {
    setBusy(true);
    setError("");
    const rows = list.map((item, i) => ({
      key: `${socialKeyPrefix}${i + 1}`,
      value_ar: item.platform,
      value_en: item.url,
    }));
    const staleKeys = items
      .map((i) => i.key)
      .filter((key) => !rows.some((r) => r.key === key));

    const up = rows.length
      ? await supabase.from("site_content").upsert(rows, { onConflict: "key" })
      : { error: null };
    const del = staleKeys.length
      ? await supabase.from("site_content").delete().in("key", staleKeys)
      : { error: null };
    if (up.error || del.error) setError("مش قادر يحفظ التغيير، جرّب تاني");
    await reload();
    setBusy(false);
  };

  const plain = (list: SocialItem[]) => list.map((i) => ({ platform: i.platform, url: i.url }));

  const add = async () => {
    if (!isValidSocialUrl(newUrl)) {
      setError("اكتب رابط كامل يبدأ بـ https://");
      return;
    }
    await writeSlots([...plain(items), { platform: newPlatform, url: newUrl.trim() }]);
    setNewUrl("");
  };

  const update = (index: number, patch: Partial<{ platform: string; url: string }>) =>
    writeSlots(plain(items).map((it, i) => (i === index ? { ...it, ...patch } : it)));

  const remove = (index: number) => writeSlots(plain(items).filter((_, i) => i !== index));

  const move = (index: number, dir: -1 | 1) => {
    const list = plain(items);
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target]!, list[index]!];
    return writeSlots(list);
  };

  return (
    <div className="space-y-6">
      {error && <p className="text-sm font-bold text-destructive">{error}</p>}

      <section className="rounded-3xl bg-card p-5 ring-1 ring-border">
        <h3 className="font-heading text-lg font-bold">أيقونات السوشيال ميديا</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          اختار المنصة (الأيقونة بتتغير لوحدها)، اكتب الرابط، وترتيبهم بالأسهم.
        </p>

        <div className="mt-4 space-y-3">
          {items.map((item, index) => {
            const platform = socialPlatform(item.platform);
            const Icon = platform.icon;
            return (
              <div
                key={item.key}
                className="flex flex-wrap items-center gap-2 rounded-2xl border border-border p-3"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <select
                  value={platform.id}
                  onChange={(e) => update(index, { platform: e.target.value })}
                  disabled={busy}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  {socialPlatforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <input
                  defaultValue={item.url}
                  dir="ltr"
                  placeholder={platform.placeholder}
                  onBlur={(e) =>
                    e.target.value.trim() !== item.url &&
                    isValidSocialUrl(e.target.value) &&
                    update(index, { url: e.target.value.trim() })
                  }
                  className="min-w-48 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                  aria-label="تحريك لأعلى"
                  className="rounded-full border border-border p-2 hover:bg-muted disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={busy || index === items.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label="تحريك لأسفل"
                  className="rounded-full border border-border p-2 hover:bg-muted disabled:opacity-40"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => remove(index)}
                  aria-label="حذف الرابط"
                  className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">مفيش روابط سوشيال لسه، ضيف أول واحد.</p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            {socialPlatforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            dir="ltr"
            placeholder={socialPlatform(newPlatform).placeholder}
            className="min-w-48 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={add}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            إضافة رابط
          </button>
        </div>
      </section>
    </div>
  );
}
