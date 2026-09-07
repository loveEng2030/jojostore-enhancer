import { createFileRoute } from "@tanstack/react-router";
import { WA_DEFAULT } from "@/lib/data";
import { useI18n, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة | جوجو ستور" },
      {
        name: "description",
        content:
          "إجابات على أسئلة تجار الجملة: أقل كمية للطلب، طريقة الطلب، الشحن، الأسعار والعينات من جوجو ستور.",
      },
      { property: "og:title", content: "الأسئلة الشائعة | جوجو ستور" },
      {
        property: "og:description",
        content: "كل ما تحتاج معرفته قبل طلب توريد من جوجو ستور.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

const qs = [1, 2, 3, 4, 5, 6] as const;

function FaqPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-8 pt-32">
      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
        {t("faq.kicker")}
      </span>
      <h1 className="mt-4 font-heading text-4xl font-extrabold md:text-5xl">
        {t("faq.title")}
      </h1>

      <div className="mt-10 space-y-4">
        {qs.map((n) => (
          <details
            key={n}
            className="group rounded-3xl bg-card p-6 ring-1 ring-border"
          >
            <summary className="cursor-pointer list-none font-heading text-lg font-bold marker:hidden">
              {t(`faq.q${n}` as TKey)}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t(`faq.a${n}` as TKey)}
            </p>
          </details>
        ))}
      </div>

      <a
        href={WA_DEFAULT}
        target="_blank"
        rel="noreferrer"
        className="mt-10 inline-block rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {t("common.contactUs")}
      </a>
    </div>
  );
}
