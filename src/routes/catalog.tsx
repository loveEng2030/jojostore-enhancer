import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import {
  allColors,
  categories,
  sections,
  colorHex,
  products,
  WA_CATALOG_FULL,
} from "@/lib/data";
import { fetchCatalog, type CatalogProduct } from "@/lib/catalog-store";

import { useI18n } from "@/lib/i18n";


export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "الكتالوج | موديلات جوجو ستور للجملة" },
      {
        name: "description",
        content:
          "تصفح كتالوج جوجو ستور: ملابس حريمي ورجالي وأطفال وهوم وير وكاجوال متاحة للتوريد بالجملة مع الأكواد والألوان والمقاسات.",
      },
      { property: "og:title", content: "الكتالوج | جوجو ستور" },
      {
        property: "og:description",
        content: "أحدث موديلات جوجو ستور المتاحة للتوريد بالجملة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { t, tx, tColor } = useI18n();
  const [cat, setCat] = useState<string>("all");
  const [color, setColor] = useState<string>("all");
  const [q, setQ] = useState("");
  const [newOnly, setNewOnly] = useState(false);
  const [all, setAll] = useState<CatalogProduct[]>(products);

  useEffect(() => {
    let alive = true;
    fetchCatalog()
      .then((rows) => {
        if (alive) setAll(rows);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const query = q.trim().toLowerCase();
  const list = all.filter(
    (p) =>
      (cat === "all" || p.categoryId === cat) &&
      (color === "all" || p.colors.includes(color)) &&
      (!newOnly || p.isNew) &&
      (query === "" ||
        p.name.toLowerCase().includes(query) ||
        p.nameEn.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query)),
  );


  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-32">
      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
        {t("catalog.kicker")}
      </span>
      <h1 className="mt-4 font-heading text-4xl font-extrabold md:text-5xl">
        {t("catalog.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {t("catalog.subtitle")}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCat("all")}
          className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
            cat === "all"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground hover:bg-muted"
          }`}
        >
          {t("catalog.all")}
        </button>
        {sections.flatMap((s) => {
          const secName = tx(s.name, s.nameEn).replace(/^قسم\s+/, "");
          return categories
            .filter((c) => c.sectionId === s.id)
            .map((c) => {
              const catName = tx(c.name, c.nameEn);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                    cat === c.id
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {catName === secName ? secName : `${secName} - ${catName}`}
                </button>
              );
            });
        })}
        <button
          type="button"
          onClick={() => setNewOnly((v) => !v)}
          className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
            newOnly
              ? "bg-charcoal text-white"
              : "border border-border bg-card text-foreground hover:bg-muted"
          }`}
        >
          {t("catalog.newOnly")}
        </button>
      </div>

      <div className="mt-5 grid gap-5 rounded-3xl bg-card p-5 ring-1 ring-border lg:grid-cols-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setColor("all")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              color === "all"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground hover:bg-muted"
            }`}
          >
            {t("catalog.allColors")}
          </button>
          {allColors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor((v) => (v === c ? "all" : c))}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                color === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              {tColor(c)}
              <span
                className="h-4 w-4 rounded-full ring-1 ring-border"
                style={{ backgroundColor: colorHex[c] ?? "#ddd" }}
              />
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("catalog.searchPlaceholder")}
          className="h-full min-h-14 w-full rounded-2xl border border-border bg-background px-5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        {list.length} {t("catalog.count")}
      </p>


      {list.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-card p-10 text-center text-sm text-muted-foreground ring-1 ring-border">
          {t("catalog.empty")}
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.code} product={p} />
          ))}
        </div>
      )}

      <a
        href={WA_CATALOG_FULL}
        target="_blank"
        rel="noreferrer"
        className="mt-10 inline-block rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {t("nav.cta")}
      </a>
    </div>
  );
}
