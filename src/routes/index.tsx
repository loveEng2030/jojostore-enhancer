import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { newProducts, WA_B2B, WA_CATALOG } from "@/lib/data";
import { useState } from "react";
import { useI18n, type TKey } from "@/lib/i18n";
import { useSiteContent } from "@/lib/site-content";
import { imageFallback } from "@/lib/site-assets";
import { Button } from "@/components/ui/button";
import { ImageLightbox, ImageZoomHint } from "@/components/site/ImageLightbox";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "جوجو ستور | ملابس بالجملة وتوريد B2B للمتاجر" },
      {
        name: "description",
        content:
          "جوجو ستور — توريد ملابس بالجملة للمتاجر والموزعين: حريمي، رجالي، أطفال، هوم وير وكاجوال بجودة عالية وأسعار تنافسية.",
      },
      { property: "og:title", content: "جوجو ستور | ملابس بالجملة وتوريد B2B" },
      {
        property: "og:description",
        content:
          "أناقة عالمية، جودة موثوقة، وأسعار تنافسية تجعل جوجو ستور خيارك الأول للتوريد التجاري.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const discoverCards = [
  { imgKey: "discover.1", tag: "NEW COLLECTION", key: "discover.card1" as TKey, layout: "md:col-start-2 md:row-span-2" },
  { imgKey: "discover.2", tag: "JOJO EDIT", key: "discover.card2" as TKey, layout: "md:col-start-1 md:row-start-1" },
  { imgKey: "discover.3", tag: "ALL SIZES", key: "discover.card3" as TKey, layout: "md:col-start-1 md:row-start-2" },
];

const pillars = [1, 2, 3] as const;
const orderStages = [
  { number: "01", imgKey: "stages.1", key: 1 },
  { number: "02", imgKey: "stages.2", key: 2 },
  { number: "03", imgKey: "stages.3", key: 3 },
  { number: "04", imgKey: "stages.4", key: 4 },
] as const;
const b2bPoints = [1, 2, 3, 4, 5, 6] as const;

function Home() {
  const { t, lang } = useI18n();
  const { images } = useSiteContent();
  const img = (key: string) => images[key] ?? imageFallback(key);
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <video
          src={heroVideo}
          poster={img("hero.poster")}

          autoPlay
          muted
          loop
          playsInline
          className="hero-zoom absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-28 text-center">
          <span
            className="hero-rise inline-block rounded-full border border-white/25 bg-white/10 px-5 py-1.5 text-xs font-bold tracking-[0.2em] text-white backdrop-blur-md"
            style={{ animationDelay: "0.05s" }}
          >
            {t("hero.kicker")}
          </span>
          <h1
            className="hero-rise mx-auto mt-6 max-w-4xl font-heading text-4xl font-extrabold leading-[1.15] text-white drop-shadow-lg md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.15s" }}
          >
            {t("hero.title")}
          </h1>
          <p
            className="hero-rise mx-auto mt-6 max-w-2xl text-base text-white/85 md:text-lg"
            style={{ animationDelay: "0.25s" }}
          >
            {t("hero.subtitle")}
          </p>

          <div
            className="hero-rise mt-9 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: "0.35s" }}
          >
            <Link
              to="/b2b"
              className="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              {t("nav.cta")}
            </Link>
            <Link
              to="/catalog"
              className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              {t("common.browseCatalog")}
            </Link>
          </div>

          <div
            className="hero-rise mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3"
            style={{ animationDelay: "0.45s" }}
          >
            {[
              { v: "20+", k: "hero.stat1" as TKey },
              { v: "200%+", k: "hero.stat2" as TKey },
              { v: "B2B", k: "hero.stat3" as TKey },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-colors duration-300 hover:bg-white/15"
              >
                <p className="font-heading text-3xl font-extrabold text-white">
                  {s.v}
                </p>
                <p className="mt-1 text-xs text-white/75">{t(s.k)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Discover */}
      <section className="mx-auto max-w-6xl px-4 py-5 md:py-7">
        <div className="grid gap-4 md:h-[680px] md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:grid-rows-2 md:gap-5">
          {discoverCards.map((c) => (
            <div
              key={c.tag}
              className={`group relative min-h-[280px] overflow-hidden rounded-3xl md:min-h-0 ${c.layout}`}
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPreview({ src: img(c.imgKey), alt: t(c.key) })}
                className="absolute inset-0 z-10 h-full w-full rounded-none p-0"
                aria-label={`${t("common.viewImage")} — ${t(c.key)}`}
              >
                <span className="sr-only">{t("common.viewImage")}</span>
                <ImageZoomHint />
              </Button>
              <img src={img(c.imgKey)} alt={t(c.key)} loading="lazy" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6 text-start text-white">
                <span className="text-[11px] font-bold tracking-widest opacity-80">
                  {c.tag}
                </span>
                <p className="font-heading text-xl font-extrabold">
                  {t(c.key)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="cv-auto bg-cream py-16">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-3">
          {pillars.map((n) => (
            <div
              key={n}
              className="rounded-3xl bg-card p-7 ring-1 ring-border"
            >
              <span className="font-heading text-sm font-extrabold text-sand">
                0{n}
              </span>
              <h3 className="mt-3 font-heading text-xl font-extrabold">
                {t(`pillars.${n}.title` as TKey)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`pillars.${n}.body` as TKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Order journey */}
      <section className="cv-auto bg-charcoal py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-primary">
              {t("stages.kicker")}
            </span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold md:text-4xl">
              {t("stages.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              {t("stages.subtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orderStages.map((stage) => (
              <article key={stage.number} className="overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img(stage.imgKey)}
                    alt={t(`stages.${stage.key}.title` as TKey)}
                    loading="lazy"
                    width={768}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="font-heading text-sm font-extrabold text-primary">{stage.number}</span>
                  <h3 className="mt-2 font-heading text-lg font-extrabold">
                    {t(`stages.${stage.key}.title` as TKey)}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/65">
                    {t(`stages.${stage.key}.body` as TKey)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* B2B */}
      <section className="cv-auto bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            kicker={t("b2b.kicker")}
            title={t("b2b.title")}
            subtitle={t("b2b.subtitle")}
          />
          <div className="grid gap-8 lg:grid-cols-2">
            <ul className="space-y-3">
              {b2bPoints.map((n) => (
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
            <div className="flex flex-col justify-center gap-4 rounded-3xl bg-card p-8 ring-1 ring-border">
              <h3 className="font-heading text-2xl font-extrabold">
                {t("b2b.formTitle")}
              </h3>
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
                  to="/story"
                  className="flex items-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-bold transition-colors hover:bg-muted"
                >
                  {t("common.knowStory")}
                  <Arrow className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog preview */}
      <section className="cv-auto mx-auto max-w-6xl px-4 py-16">
        <SectionHeader
          kicker={t("catalog.kicker")}
          title={t("catalog.title")}
          subtitle={t("catalog.subtitle")}
          linkTo="/catalog"
          linkLabel={t("common.browseCatalogFull")}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newProducts.slice(0, 6).map((p) => (
            <ProductCard key={p.code} product={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cv-auto mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-4xl bg-charcoal px-6 py-14 text-center text-white">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-extrabold md:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            {t("cta.body")}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={WA_B2B}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-charcoal transition-transform hover:scale-105"
            >
              {t("nav.cta")}
            </a>
            <a
              href={WA_CATALOG}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              {t("common.whatsapp")}
            </a>
          </div>
        </div>
      </section>
      <ImageLightbox src={preview?.src ?? ""} alt={preview?.alt ?? ""} open={preview !== null} onOpenChange={(open) => { if (!open) setPreview(null); }} />
    </div>
  );
}
