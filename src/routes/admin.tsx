import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut, Plus, Trash2, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { allColors, categories, colorHex, products as staticProducts, sections } from "@/lib/data";
import {
  fetchCatalog,
  fetchHiddenCodes,
  signedImageUrl,
  type CatalogProduct,
} from "@/lib/catalog-store";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "لوحة تحكم جوجو ستور" },
      { name: "description", content: "لوحة تحكم إدارة منتجات كتالوج جوجو ستور." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة تحكم جوجو ستور" },
      { property: "og:description", content: "إدارة منتجات الكتالوج." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const normalizeEmail = (value: string) => {
  const v = value.trim();
  if (!v.includes("@")) return v;
  const [user, domain] = v.split("@");
  return `${user}@${domain!.includes(".") ? domain : `${domain}.com`}`.toLowerCase();
};

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const check = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setIsAdmin(false);
      setReady(true);
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin");
    setIsAdmin((roles ?? []).length > 0);
    setReady(true);
  };

  useEffect(() => {
    void check();
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <LoginCard onDone={check} />;
  return <Dashboard onSignOut={check} />;
}

function LoginCard({ onDone }: { onDone: () => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });
    if (signInError) setError("بيانات الدخول غير صحيحة");
    else await onDone();
    setBusy(false);
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 pt-28">
      <form
        onSubmit={submit}
        className="w-full space-y-4 rounded-3xl bg-card p-7 ring-1 ring-border"
      >
        <h1 className="font-heading text-2xl font-extrabold">دخول الأدمن</h1>
        <p className="text-sm text-muted-foreground">
          هذه الصفحة لإدارة منتجات الكتالوج فقط.
        </p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="الإيميل"
          dir="ltr"
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="كلمة السر"
          dir="ltr"
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {error && <p className="text-sm font-bold text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const [list, setList] = useState<CatalogProduct[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]!.id);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [file, setFile] = useState<File | null>(null);

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
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "31536000" });
      if (upErr) throw upErr;
      const url = await signedImageUrl(path);
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
        is_new: isNew,
      });
      if (insErr) throw insErr;
      setCode("");
      setName("");
      setNameEn("");
      setColors([]);
      setSizes("");
      setFile(null);
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

  const signOut = async () => {
    await supabase.auth.signOut();
    await onSignOut();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-32">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-extrabold">لوحة تحكم الكتالوج</h1>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> خروج
        </button>
      </div>

      <form onSubmit={addProduct} className="mt-8 space-y-4 rounded-3xl bg-card p-6 ring-1 ring-border">
        <h2 className="font-heading text-xl font-bold">إضافة منتج جديد</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="الكود مثال W-120" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {sections.find((s) => s.id === c.sectionId)?.name} - {c.name}
              </option>
            ))}
          </select>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المنتج بالعربي" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
          <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="الاسم بالإنجليزي (اختياري)" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
          <input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="المقاسات مفصولة بفاصلة: 6, 8, 10" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm" />
        </div>

        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColors((v) => (v.includes(c) ? v.filter((x) => x !== c) : [...v, c]))}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                colors.includes(c) ? "bg-primary text-primary-foreground" : "border border-border text-foreground"
              }`}
            >
              <span className="h-3.5 w-3.5 rounded-full ring-1 ring-border" style={{ backgroundColor: colorHex[c] ?? "#ddd" }} />
              {c}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
          منتج جديد
        </label>

        {message && <p className="text-sm font-bold text-primary">{message}</p>}

        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} إضافة المنتج
        </button>
      </form>

      <h2 className="mt-10 font-heading text-xl font-bold">منتجات الكتالوج ({list.length})</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <div key={p.code} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border">
            <img src={p.image} alt={p.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{p.name}</p>
              <p className="text-xs text-muted-foreground" dir="ltr">{p.code}</p>
            </div>
            <button type="button" onClick={() => remove(p)} disabled={busy} className="rounded-full p-2 text-destructive hover:bg-destructive/10" aria-label="حذف">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {hidden.length > 0 && (
        <>
          <h2 className="mt-10 font-heading text-xl font-bold">منتجات محذوفة ({hidden.length})</h2>
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
