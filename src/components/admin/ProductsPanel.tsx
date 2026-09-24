import { useEffect, useState } from "react";
import { Loader2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { allColors, colorHex, products as staticProducts } from "@/lib/data";
import { useTaxonomy } from "@/lib/site-content";
import {
  fetchCatalog,
  fetchHiddenCodes,
  signedImageUrl,
  type CatalogProduct,
} from "@/lib/catalog-store";

export function ProductsPanel() {
  const { sections, categories } = useTaxonomy();
  const [list, setList] = useState<CatalogProduct[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState("");
  const [specs, setSpecs] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [colorFiles, setColorFiles] = useState<Record<string, File>>({});

  const uploadImage = async (f: File) => {
    const ext = f.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, f, { cacheControl: "31536000" });
    if (upErr) throw upErr;
    return signedImageUrl(path);
  };

  useEffect(() => {
    if (!categoryId && categories[0]) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const reload = async () => {
    setList(await fetchCatalog());
    setHidden(await fetchHiddenCodes());
  };

  useEffect(() => {
    void reload();
  }, []);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !code.trim() || !name.trim()) {
      setMessage("املأ الكود والاسم واختر صورة");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const url = await uploadImage(file);
      const colorImages: Record<string, string> = {};
      for (const c of colors) {
        const f = colorFiles[c];
        colorImages[c] = f ? await uploadImage(f) : url;
      }
      const { error: insErr } = await supabase.from("products").insert({
        code: code.trim(),
        name: name.trim(),
        name_en: nameEn.trim() || name.trim(),
        category_id: categoryId,
        colors,
        sizes: sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        image_url: url,
        color_images: colorImages,
        specs: specs.trim() || null,
        is_new: isNew,
      });
      if (insErr) throw insErr;
      setCode("");
      setName("");
      setNameEn("");
      setColors([]);
      setSizes("");
      setSpecs("");
      setFile(null);
      setColorFiles({});
      setMessage("تمت إضافة المنتج");
      await reload();
    } catch {
      setMessage("حصلت مشكلة أثناء الإضافة، جرّب تاني");
    }
    setBusy(false);
  };

  const remove = async (p: CatalogProduct) => {
    setBusy(true);
    if (p.dbId) await supabase.from("products").delete().eq("id", p.dbId);
    else await supabase.from("hidden_products").insert({ code: p.code });
    await reload();
    setBusy(false);
  };

  const restore = async (c: string) => {
    setBusy(true);
    await supabase.from("hidden_products").delete().eq("code", c);
    await reload();
    setBusy(false);
  };

  return (
    <div>
      <form
        onSubmit={addProduct}
        className="space-y-4 rounded-3xl bg-card p-6 ring-1 ring-border"
      >
        <h2 className="font-heading text-xl font-bold">إضافة منتج جديد</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="الكود مثال W-120"
            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {sections.find((s) => s.id === c.sectionId)?.name} - {c.name}
              </option>
            ))}
          </select>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المنتج بالعربي"
            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
          />
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="الاسم بالإنجليزي (اختياري)"
            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
          />
          <input
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="المقاسات مفصولة بفاصلة: 6, 8, 10"
            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
          />
          <textarea
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            rows={4}
            placeholder={"مواصفات المنتج (كل سطر ميزة)\nمثال: قطن 100%\nخامة ميلتون شتوي"}
            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm md:col-span-2"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() =>
                setColors((v) => {
                  if (v.includes(c)) {
                    setColorFiles((files) => {
                      const next = { ...files };
                      delete next[c];
                      return next;
                    });
                    return v.filter((x) => x !== c);
                  }
                  return [...v, c];
                })
              }
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                colors.includes(c)
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground"
              }`}
            >
              <span
                className="h-3.5 w-3.5 rounded-full ring-1 ring-border"
                style={{ backgroundColor: colorHex[c] ?? "#ddd" }}
              />
              {c}
            </button>
          ))}
        </div>

        {colors.length > 0 && (
          <div className="space-y-2 rounded-2xl border border-border p-4">
            <p className="text-sm font-bold">صورة لكل لون (اختياري)</p>
            <p className="text-xs text-muted-foreground">
              لو رفعت صورة للون، الزائر لما يضغط على اللون في الكتالوج الصورة
              هتتغير للصورة دي. أي لون من غير صورة هيستخدم الصورة الأساسية.
            </p>
            {colors.map((c) => (
              <div key={c} className="flex flex-wrap items-center gap-3">
                <span className="flex min-w-28 items-center gap-2 text-xs font-bold">
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-border"
                    style={{ backgroundColor: colorHex[c] ?? "#ddd" }}
                  />
                  {c}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setColorFiles((files) => {
                      const next = { ...files };
                      if (f) next[c] = f;
                      else delete next[c];
                      return next;
                    });
                  }}
                  className="flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
          />
          منتج جديد
        </label>

        {message && <p className="text-sm font-bold text-primary">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}{" "}
          إضافة المنتج
        </button>
      </form>

      <h2 className="mt-10 font-heading text-xl font-bold">
        منتجات الكتالوج ({list.length})
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <div
            key={p.code}
            className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border"
          >
            <img
              src={p.image}
              alt={p.name}
              className="h-16 w-16 rounded-xl object-cover"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{p.name}</p>
              <p className="text-xs text-muted-foreground" dir="ltr">
                {p.code}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(p)}
              disabled={busy}
              className="rounded-full p-2 text-destructive hover:bg-destructive/10"
              aria-label="حذف"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {hidden.length > 0 && (
        <>
          <h2 className="mt-10 font-heading text-xl font-bold">
            منتجات محذوفة ({hidden.length})
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {hidden.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => restore(c)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold hover:bg-muted"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {staticProducts.find((p) => p.code === c)?.name ?? c}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
