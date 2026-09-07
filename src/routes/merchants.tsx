import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Package, Truck, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { waLink } from "@/lib/data";
import { useI18n, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/merchants")({
  head: () => ({
    meta: [
      { title: "توريد جملة لتجار مصر | جوجو ستور" },
      {
        name: "description",
        content:
          "صفحة تجار مصر في جوجو ستور: أسعار جملة للمتاجر والبوتيكات والبيع الأونلاين داخل مصر، مع نموذج لتسجيل بيانات التاجر.",
      },
      { property: "og:title", content: "توريد جملة لتجار مصر | جوجو ستور" },
      {
        property: "og:description",
        content: "سجّل بياناتك كتاجر داخل مصر واستلم عرض أسعار الجملة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MerchantsPage,
});

const points = [1, 2, 3, 4] as const;

const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "القليوبية",
  "الشرقية",
  "الدقهلية",
  "الغربية",
  "المنوفية",
  "البحيرة",
  "كفر الشيخ",
  "دمياط",
  "بورسعيد",
  "الإسمايلية",
  "السويس",
  "شمال سيناء",
  "جنوب سيناء",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "مطروح",
  "الوادي الجديد",
];

const sectionOptions = [
  "رجالي",
  "حريمي",
  "أطفال",
  "حديثي الولادة",
  "شعبي",
  "محير",
];

const inputClass =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary";

function MerchantsPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    full_name: "",
    store_name: "",
    phone: "",
    governorate: "",
    business_type: "",
    interests: [] as string[],
    monthly_volume: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [sentWa, setSentWa] = useState("");

  const facts = [
    { icon: Package, label: t("eg.moq"), value: t("eg.moqValue") },
    { icon: Clock, label: t("eg.lead"), value: t("eg.leadValue") },
    { icon: Truck, label: t("eg.shipping"), value: t("eg.shippingValue") },
  ];

  const toggleInterest = (value: string) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(value)
        ? f.interests.filter((i) => i !== value)
        : [...f.interests, value],
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      setStatus("error");
      setMessage(t("eg.required"));
      return;
    }
    setStatus("sending");
    setMessage("");
    const { error } = await supabase.from("merchant_requests").insert({
      full_name: form.full_name.trim(),
      store_name: form.store_name.trim(),
      phone: form.phone.trim(),
      governorate: form.governorate,
      business_type: form.business_type,
      interests: form.interests.join("، "),
      monthly_volume: form.monthly_volume.trim(),
      notes: form.notes.trim(),
    });
    if (error) {
      setStatus("error");
      setMessage(t("eg.error"));
      return;
    }
    const lines = [
      "طلب تاجر جديد — JOJO Store",
      `الاسم: ${form.full_name.trim()}`,
      `الموبايل: ${form.phone.trim()}`,
      form.store_name.trim() && `المحل / الصفحة: ${form.store_name.trim()}`,
      form.governorate && `المحافظة: ${form.governorate}`,
      form.business_type && `نوع النشاط: ${form.business_type}`,
      form.interests.length && `الأقسام المطلوبة: ${form.interests.join("، ")}`,
      form.monthly_volume.trim() &&
        `الكمية الشهرية: ${form.monthly_volume.trim()}`,
      form.notes.trim() && `اللي محتاجه: ${form.notes.trim()}`,
    ].filter(Boolean) as string[];
    const waSend = waLink(lines.join("\n"));
    setSentWa(waSend);
    window.open(waSend, "_blank", "noreferrer");
    setStatus("done");
    setMessage(t("eg.success"));
    setForm({
      full_name: "",
      store_name: "",
      phone: "",
      governorate: "",
      business_type: "",
      interests: [],
      monthly_volume: "",
      notes: "",
    });
  };

  const wa = waLink(
    `السلام عليكم، أنا تاجر داخل مصر وأرغب في أسعار الجملة من JOJO Store`,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-32">
      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
        {t("eg.kicker")}
      </span>
      <h1 className="mt-4 font-heading text-4xl font-extrabold md:text-5xl">
        {t("eg.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {t("eg.subtitle")}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {t("eg.exportNote")}{" "}
        <Link to="/b2b" className="font-bold text-primary underline">
          {t("nav.b2b")}
        </Link>
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {facts.map((f) => (
          <div
            key={f.label}
            className="rounded-3xl bg-card p-6 ring-1 ring-border"
          >
            <f.icon className="h-6 w-6 text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">{f.label}</p>
            <p className="font-heading text-lg font-extrabold">{f.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <ul className="space-y-3">
          {points.map((n) => (
            <li
              key={n}
              className="flex items-start gap-3 rounded-2xl bg-card p-4 ring-1 ring-border"
            >
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm leading-relaxed">
                {t(`eg.point${n}` as TKey)}
              </span>
            </li>
          ))}
          <li className="rounded-2xl bg-cream p-4 text-sm ring-1 ring-border">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary underline"
            >
              {t("common.whatsapp")}
            </a>{" "}
            —{" "}
            <Link to="/catalog" className="underline">
              {t("common.browseCatalog")}
            </Link>
          </li>
        </ul>

        <form
          onSubmit={submit}
          className="rounded-3xl bg-cream p-6 ring-1 ring-border sm:p-8"
        >
          <h2 className="font-heading text-2xl font-extrabold">
            {t("eg.formTitle")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("eg.formBody")}
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold">
                {t("eg.name")} *
              </label>
              <input
                className={inputClass}
                value={form.full_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, full_name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold">
                {t("eg.phone")} *
              </label>
              <input
                className={inputClass}
                inputMode="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold">
                {t("eg.store")}
              </label>
              <input
                className={inputClass}
                value={form.store_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, store_name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold">
                  {t("eg.gov")}
                </label>
                <select
                  className={inputClass}
                  value={form.governorate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, governorate: e.target.value }))
                  }
                >
                  <option value="">—</option>
                  {governorates.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold">
                  {t("eg.type")}
                </label>
                <select
                  className={inputClass}
                  value={form.business_type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, business_type: e.target.value }))
                  }
                >
                  <option value="">—</option>
                  <option value={t("eg.typeShop")}>{t("eg.typeShop")}</option>
                  <option value={t("eg.typeOnline")}>
                    {t("eg.typeOnline")}
                  </option>
                  <option value={t("eg.typeWholesale")}>
                    {t("eg.typeWholesale")}
                  </option>
                  <option value={t("eg.typeOther")}>{t("eg.typeOther")}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold">
                {t("eg.interests")}
              </label>
              <div className="flex flex-wrap gap-2">
                {sectionOptions.map((s) => {
                  const on = form.interests.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleInterest(s)}
                      className={`rounded-full px-4 py-2 text-xs font-bold ring-1 transition-colors ${
                        on
                          ? "bg-primary text-primary-foreground ring-primary"
                          : "bg-card ring-border hover:bg-muted"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold">
                {t("eg.volume")}
              </label>
              <input
                className={inputClass}
                value={form.monthly_volume}
                onChange={(e) =>
                  setForm((f) => ({ ...f, monthly_volume: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold">
                {t("eg.notes")}
              </label>
              <textarea
                rows={3}
                className={inputClass}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 w-full rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {status === "sending" ? t("eg.sending") : t("eg.submit")}
          </button>

          {message && (
            <p
              className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                status === "done"
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
