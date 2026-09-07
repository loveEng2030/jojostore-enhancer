import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Package, Truck, Clock } from "lucide-react";
import { WA_B2B } from "@/lib/data";
import { useI18n, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/b2b")({
  head: () => ({
    meta: [
      { title: "توريد B2B للمتاجر والموزعين | جوجو ستور" },
      {
        name: "description",
        content:
          "حلول توريد B2B من جوجو ستور للمتاجر والبوتيكات وتجار الجملة داخل مصر والخليج بأسعار تنافسية وجودة ثابتة.",
      },
      { property: "og:title", content: "توريد B2B | جوجو ستور" },
      {
        property: "og:description",
        content: "شريك توريد للمتاجر والموزعين داخل مصر والخليج.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: B2BPage,
});

const points = [1, 2, 3, 4, 5, 6] as const;

function B2BPage() {
  const { t } = useI18n();

  const facts = [
    { icon: Package, label: t("b2b.moq"), value: t("b2b.moqValue") },
    { icon: Clock, label: t("b2b.lead"), value: t("b2b.leadValue") },
    { icon: Truck, label: t("b2b.shipping"), value: t("b2b.shippingValue") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-32">
      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
        {t("b2b.kicker")}
      </span>
      <h1 className="mt-4 font-heading text-4xl font-extrabold md:text-5xl">
        {t("b2b.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {t("b2b.subtitle")}
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
                {t(`b2b.point${n}` as TKey)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col justify-center gap-4 rounded-3xl bg-cream p-8 ring-1 ring-border">
          <h2 className="font-heading text-2xl font-extrabold">
            {t("b2b.formTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("b2b.formBody")}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={WA_B2B}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("nav.cta")}
            </a>
            <Link
              to="/catalog"
              className="rounded-full border border-border bg-card px-7 py-3 text-sm font-bold transition-colors hover:bg-muted"
            >
              {t("common.browseCatalog")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
