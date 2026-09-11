import { useEffect, useState } from "react";
import { RefreshCw, Phone, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Request = {
  id: string;
  full_name: string;
  store_name: string;
  phone: string;
  governorate: string;
  business_type: string;
  interests: string;
  monthly_volume: string;
  notes: string;
  created_at: string;
};

const waFor = (phone: string) =>
  `https://wa.me/${phone.replace(/[^\d]/g, "").replace(/^0/, "20")}`;

export function RequestsPanel() {
  const [rows, setRows] = useState<Request[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setBusy(true);
    setError("");
    const { data, error } = await supabase
      .from("merchant_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError("تعذر تحميل الطلبات");
    else setRows((data ?? []) as Request[]);
    setBusy(false);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-extrabold">
          طلبات التجار ({rows.length})
        </h2>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" /> تحديث
        </button>
      </div>

      {error && (
        <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {busy && <p className="text-sm text-muted-foreground">جاري التحميل...</p>}

      {!busy && !rows.length && !error && (
        <p className="rounded-2xl bg-muted px-4 py-6 text-center text-sm text-muted-foreground">
          لا توجد طلبات حتى الآن.
        </p>
      )}

      <div className="grid gap-4">
        {rows.map((r) => (
          <article
            key={r.id}
            className="rounded-3xl bg-card p-5 ring-1 ring-border"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-lg font-extrabold">
                {r.full_name}
                {r.store_name ? ` — ${r.store_name}` : ""}
              </h3>
              <span className="text-xs text-muted-foreground" dir="ltr">
                {new Date(r.created_at).toLocaleString("ar-EG")}
              </span>
            </div>

            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {[
                ["الموبايل", r.phone],
                ["المحافظة", r.governorate],
                ["نوع النشاط", r.business_type],
                ["الأقسام المطلوبة", r.interests],
                ["الكمية الشهرية", r.monthly_volume],
                ["اللي محتاجه", r.notes],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={waFor(r.phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                <MessageCircle className="h-4 w-4" /> واتساب
              </a>
              <a
                href={`tel:${r.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-bold hover:bg-muted"
              >
                <Phone className="h-4 w-4" /> اتصال
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
