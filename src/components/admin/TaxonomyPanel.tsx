import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/lib/site-content";

const slug = (v: string) =>
  v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0621-\u064A]+/g, "-")
    .replace(/^-|-$/g, "");

export function TaxonomyPanel() {
  const { sections, categories, reload } = useSiteContent();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [seeded, setSeeded] = useState(false);

  const [secName, setSecName] = useState("");
  const [secNameEn, setSecNameEn] = useState("");
  const [catSection, setCatSection] = useState("");
  const [catName, setCatName] = useState("");
  const [catNameEn, setCatNameEn] = useState("");

  // The tables start empty (the site falls back to the built-in list). Copy
  // that list into the database once so it becomes editable.
  useEffect(() => {
    if (seeded) return;
    const seed = async () => {
      const { count } = await supabase
        .from("site_sections")
        .select("id", { count: "exact", head: true });
      if (count && count > 0) {
        setSeeded(true);
        return;
      }
      await supabase.from("site_sections").insert(
        sections.map((s, i) => ({
          id: s.id,
          name: s.name,
          name_en: s.nameEn,
          sort_order: i,
        })),
      );
      await supabase.from("site_categories").insert(
        categories.map((c, i) => ({
          id: c.id,
          section_id: c.sectionId,
          name: c.name,
          name_en: c.nameEn,
          sort_order: i,
        })),
      );
      setSeeded(true);
      await reload();
    };
    void seed();
  }, [seeded, sections, categories, reload]);

  useEffect(() => {
    if (!catSection && sections[0]) setCatSection(sections[0].id);
  }, [sections, catSection]);

  const run = async (fn: () => unknown) => {
    setBusy(true);
    setError("");
    const res = (await fn()) as { error?: unknown } | null | undefined;
    if (res && res.error) setError("مش قادر يحفظ التغيير، جرّب تاني");
    await reload();
    setBusy(false);
  };

  const addSection = () =>
    run(async () => {
      const id = slug(secNameEn || secName);
      if (!id || !secName.trim()) {
        setError("اكتب اسم القسم");
        return;
      }
      const res = await supabase.from("site_sections").insert({
        id,
        name: secName.trim(),
        name_en: secNameEn.trim() || secName.trim(),
        sort_order: sections.length,
      });
      setSecName("");
      setSecNameEn("");
      return res;
    });

  const addCategory = () =>
    run(async () => {
      const id = slug(catNameEn || catName);
      if (!id || !catName.trim() || !catSection) {
        setError("اكتب اسم التصنيف واختار القسم");
        return;
      }
      const res = await supabase.from("site_categories").insert({
        id,
        section_id: catSection,
        name: catName.trim(),
        name_en: catNameEn.trim() || catName.trim(),
        sort_order: categories.length,
      });
      setCatName("");
      setCatNameEn("");
      return res;
    });

  return (
    <div className="space-y-6">
      {error && <p className="text-sm font-bold text-destructive">{error}</p>}

      <section className="rounded-3xl bg-card p-5 ring-1 ring-border">
        <h3 className="font-heading text-lg font-bold">أقسام الكتالوج</h3>
        <div className="mt-4 space-y-2">
          {sections.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-2">
              <input
                defaultValue={s.name}
                onBlur={(e) =>
                  e.target.value !== s.name &&
                  run(() =>
                    supabase.from("site_sections").update({ name: e.target.value }).eq("id", s.id),
                  )
                }
                className="min-w-32 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                defaultValue={s.nameEn}
                dir="ltr"
                onBlur={(e) =>
                  e.target.value !== s.nameEn &&
                  run(() =>
                    supabase
                      .from("site_sections")
                      .update({ name_en: e.target.value })
                      .eq("id", s.id),
                  )
                }
                className="min-w-32 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => run(() => supabase.from("site_sections").delete().eq("id", s.id))}
                className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                aria-label="حذف القسم"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            value={secName}
            onChange={(e) => setSecName(e.target.value)}
            placeholder="قسم جديد بالعربي"
            className="min-w-40 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            value={secNameEn}
            onChange={(e) => setSecNameEn(e.target.value)}
            dir="ltr"
            placeholder="English name"
            className="min-w-40 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addSection}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            إضافة قسم
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-card p-5 ring-1 ring-border">
        <h3 className="font-heading text-lg font-bold">التصنيفات</h3>
        <div className="mt-4 space-y-2">
          {categories.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-2">
              <select
                defaultValue={c.sectionId}
                onChange={(e) =>
                  run(() =>
                    supabase
                      .from("site_categories")
                      .update({ section_id: e.target.value })
                      .eq("id", c.id),
                  )
                }
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                defaultValue={c.name}
                onBlur={(e) =>
                  e.target.value !== c.name &&
                  run(() =>
                    supabase.from("site_categories").update({ name: e.target.value }).eq("id", c.id),
                  )
                }
                className="min-w-32 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                defaultValue={c.nameEn}
                dir="ltr"
                onBlur={(e) =>
                  e.target.value !== c.nameEn &&
                  run(() =>
                    supabase
                      .from("site_categories")
                      .update({ name_en: e.target.value })
                      .eq("id", c.id),
                  )
                }
                className="min-w-32 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => run(() => supabase.from("site_categories").delete().eq("id", c.id))}
                className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                aria-label="حذف التصنيف"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <select
            value={catSection}
            onChange={(e) => setCatSection(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="تصنيف جديد بالعربي"
            className="min-w-40 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            value={catNameEn}
            onChange={(e) => setCatNameEn(e.target.value)}
            dir="ltr"
            placeholder="English name"
            className="min-w-40 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            إضافة تصنيف
          </button>
        </div>
      </section>
    </div>
  );
}
