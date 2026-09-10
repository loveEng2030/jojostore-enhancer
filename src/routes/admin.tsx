import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TextsPanel } from "@/components/admin/TextsPanel";
import { ImagesPanel } from "@/components/admin/ImagesPanel";
import { TaxonomyPanel } from "@/components/admin/TaxonomyPanel";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { SocialPanel } from "@/components/admin/SocialPanel";


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
      password: password.trim(),
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
          لوحة التحكم الكاملة: المنتجات والنصوص والصور والأقسام.
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

type Tab = "products" | "texts" | "images" | "taxonomy" | "social";

const tabs: { id: Tab; label: string }[] = [
  { id: "products", label: "المنتجات" },
  { id: "texts", label: "نصوص الموقع" },
  { id: "images", label: "صور الموقع" },
  { id: "taxonomy", label: "الأقسام والتصنيفات" },
  { id: "social", label: "السوشيال ميديا" },
];


function Dashboard({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const [tab, setTab] = useState<Tab>("products");

  const signOut = async () => {
    await supabase.auth.signOut();
    await onSignOut();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-32">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-extrabold">لوحة تحكم الموقع</h1>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> خروج
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            type="button"
            onClick={() => setTab(tb.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              tab === tb.id
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:bg-muted"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "products" && <ProductsPanel />}
        {tab === "texts" && <TextsPanel />}
        {tab === "images" && <ImagesPanel />}
        {tab === "taxonomy" && <TaxonomyPanel />}
        {tab === "social" && <SocialPanel />}

      </div>
    </div>
  );
}
