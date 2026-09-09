import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut, PackagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductsPanel } from "@/components/admin/ProductsPanel";

/** Dedicated catalog-only account: its own password, products access only. */
const CATALOG_EMAIL = "catalog@jojostor.com";

export const Route = createFileRoute("/catalog-admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "إدارة الكتالوج | جوجو ستور" },
      {
        name: "description",
        content: "صفحة مخصصة لإضافة وحذف منتجات كتالوج جوجو ستور فقط.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "إدارة الكتالوج | جوجو ستور" },
      { property: "og:description", content: "إضافة منتجات الكتالوج." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CatalogAdminPage,
});

function CatalogAdminPage() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const check = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setAllowed(false);
      setReady(true);
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin");
    setAllowed((roles ?? []).length > 0);
    setReady(true);
  };

  useEffect(() => {
    void check();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: CATALOG_EMAIL,
      password: password.trim(),
    });
    if (signInError) setError("كلمة السر غير صحيحة");
    else await check();
    setBusy(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAllowed(false);
    setPassword("");
  };

  if (!ready) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 pt-28">
        <form
          onSubmit={submit}
          className="w-full space-y-4 rounded-3xl bg-card p-7 ring-1 ring-border"
        >
          <PackagePlus className="h-7 w-7 text-primary" />
          <h1 className="font-heading text-2xl font-extrabold">إدارة الكتالوج</h1>
          <p className="text-sm text-muted-foreground">
            اكتب كلمة سر الكتالوج لإضافة أو حذف المنتجات.
          </p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="كلمة سر الكتالوج"
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

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-32">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-extrabold">إدارة الكتالوج</h1>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> خروج
        </button>
      </div>
      <div className="mt-8">
        <ProductsPanel />
      </div>
    </div>
  );
}
