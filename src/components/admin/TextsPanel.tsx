import { useMemo, useState } from "react";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { textDefaults, textKeys } from "@/lib/i18n";
import { useSiteContent } from "@/lib/site-content";

const groupLabels: Record<string, string> = {
  brand: "العلامة",
  nav: "القائمة والتنقل",
  common: "أزرار ونصوص عامة",
  hero: "الشاشة الرئيسية",
  home: "الصفحة الرئيسية",
  discover: "قسم الموديلات",
  stages: "خطوات الطلب",
  catalog: "الكتالوج",
  story: "صفحة قصتنا",
  b2b: "صفحة التوريد B2B",
  faq: "الأسئلة الشائعة",
  contact: "صفحة التواصل",
  footer: "الفوتر",
};

export function TextsPanel() {
  const { content, reload } = useSiteContent();
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { ar: string; en: string }>>({});
  const [savingKey, setSavingKey] = useState("");
  const [savedKey, setSavedKey] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, string[]>();
    for (const key of textKeys) {
      const def = textDefaults[key]!;
      if (
        q &&
        !key.toLowerCase().includes(q) &&
        !def[0].toLowerCase().includes(q) &&
        !def[1].toLowerCase().includes(q)
      )
        continue;
      const group = key.split(".")[0]!;
      map.set(group, [...(map.get(group) ?? []), key]);
    }
    return [...map.entries()];
  }, [query]);

  const valueOf = (key: string) => {
    if (drafts[key]) return drafts[key]!;
    const saved = content[key];
    const def = textDefaults[key]!;
    return { ar: saved?.ar || def[0], en: saved?.en || def[1] };
  };

  const setDraft = (key: string, patch: Partial<{ ar: string; en: string }>) =>
    setDrafts((d) => ({ ...d, [key]: { ...valueOf(key), ...patch } }));

  const save = async (key: string) => {
    const v = valueOf(key);
    setSavingKey(key);
    setSavedKey("");
    await supabase
      .from("site_content")
      .upsert({ key, value_ar: v.ar, value_en: v.en }, { onConflict: "key" });
    await reload();
    setDrafts((d) => {
      const next = { ...d };
      delete next[key];
      return next;
    });
    setSavingKey("");
    setSavedKey(key);
  };

  const reset = async (key: string) => {
    setSavingKey(key);
    await supabase.from("site_content").delete().eq("key", key);
    await reload();
    setDrafts((d) => {
      const next = { ...d };
      delete next[key];
      return next;
    });
    setSavingKey("");
    setSavedKey("");
  };

  return (
    <div className="space-y-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث عن أي نص في الموقع..."
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      {groups.map(([group, keys]) => (
        <section key={group} className="rounded-3xl bg-card p-5 ring-1 ring-border">
          <h3 className="font-heading text-lg font-bold">{groupLabels[group] ?? group}</h3>
          <div className="mt-4 space-y-4">
            {keys.map((key) => {
              const v = valueOf(key);
              const edited = Boolean(drafts[key]);
              const overridden = Boolean(content[key]);
              return (
                <div key={key} className="rounded-2xl border border-border p-4">
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {key}
                  </p>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <textarea
                      value={v.ar}
                      onChange={(e) => setDraft(key, { ar: e.target.value })}
                      rows={2}
                      placeholder="النص بالعربي"
                      className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    />
                    <textarea
                      value={v.en}
                      onChange={(e) => setDraft(key, { en: e.target.value })}
                      rows={2}
                      dir="ltr"
                      placeholder="English text"
                      className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => save(key)}
                      disabled={savingKey === key || !edited}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50"
                    >
                      {savingKey === key ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      حفظ
                    </button>
                    {overridden && (
                      <button
                        type="button"
                        onClick={() => reset(key)}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold hover:bg-muted"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> رجوع للأصلي
                      </button>
                    )}
                    {savedKey === key && (
                      <span className="text-xs font-bold text-primary">تم الحفظ</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {groups.length === 0 && (
        <p className="text-sm text-muted-foreground">مفيش نص مطابق للبحث.</p>
      )}
    </div>
  );
}
