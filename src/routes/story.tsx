import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Sparkles, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSiteImage } from "@/lib/site-content";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "قصتنا | جوجو ستور لتوريد الملابس بالجملة" },
      {
        name: "description",
        content:
          "قصة جوجو ستور: أكثر من 20 سنة في تجارة وتوريد الملابس بالجملة للمحلات والموزعين في مصر.",
      },
      { property: "og:title", content: "قصتنا | جوجو ستور" },
      {
        property: "og:description",
        content: "أكثر من 20 سنة خبرة في توريد الملابس بالجملة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  const { t } = useI18n();

  const values = [
    { icon: HeartHandshake, title: t("story.v1"), body: t("story.v1b") },
    { icon: Sparkles, title: t("story.v2"), body: t("story.v2b") },
    { icon: Zap, title: t("story.v3"), body: t("story.v3b") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-32">
      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
        {t("story.kicker")}
      </span>
      <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold md:text-5xl">
        {t("story.title")}
      </h1>

      <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>{t("story.p1")}</p>
          <p>{t("story.p2")}</p>
          <p>{t("story.p3")}</p>
          <Link
            to="/b2b"
            className="inline-block rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("nav.cta")}
          </Link>
        </div>
        <img
          src={poster}
          alt={t("story.title")}
          className="aspect-[4/3] w-full rounded-4xl object-cover ring-1 ring-border"
        />
      </div>

      <h2 className="mt-16 font-heading text-2xl font-extrabold">
        {t("story.valuesTitle")}
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {values.map((v) => (
          <div
            key={v.title}
            className="rounded-3xl bg-card p-7 ring-1 ring-border"
          >
            <v.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-heading text-xl font-extrabold">
              {v.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {v.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
