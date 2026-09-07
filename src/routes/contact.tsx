import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { ADDRESS, ADDRESS_EN, PHONE, WA_DEFAULT, WA_B2B } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | جوجو ستور للجملة" },
      {
        name: "description",
        content:
          "تواصل مع فريق التوريد في جوجو ستور عبر واتساب أو الهاتف، أو زر المكتب في حدائق حلوان بالقاهرة.",
      },
      { property: "og:title", content: "تواصل معنا | جوجو ستور" },
      {
        property: "og:description",
        content: "فريق التوريد متاح يومياً من 10 ص إلى 8 م.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t, tx } = useI18n();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-8 pt-32">
      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
        {t("contact.kicker")}
      </span>
      <h1 className="mt-4 font-heading text-4xl font-extrabold md:text-5xl">
        {t("contact.title")}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        {t("contact.subtitle")}
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl bg-card p-6 ring-1 ring-border">
          <MapPin className="h-6 w-6 text-primary" />
          <p className="mt-3 text-xs text-muted-foreground">
            {t("contact.address")}
          </p>
          <p className="mt-1 text-sm font-medium leading-relaxed">
            {tx(ADDRESS, ADDRESS_EN)}
          </p>
        </div>
        <div className="rounded-3xl bg-card p-6 ring-1 ring-border">
          <Phone className="h-6 w-6 text-primary" />
          <p className="mt-3 text-xs text-muted-foreground">
            {t("contact.phone")}
          </p>
          <a
            href={`tel:+2${PHONE}`}
            dir="ltr"
            className="mt-1 block font-heading text-lg font-extrabold hover:text-primary"
          >
            {PHONE}
          </a>
        </div>
        <div className="rounded-3xl bg-card p-6 ring-1 ring-border">
          <Clock className="h-6 w-6 text-primary" />
          <p className="mt-3 text-xs text-muted-foreground">
            {t("contact.hours")}
          </p>
          <p className="mt-1 text-sm font-medium">{t("contact.hoursValue")}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={WA_DEFAULT}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" />
          {t("common.whatsapp")}
        </a>
        <a
          href={WA_B2B}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t("nav.cta")}
        </a>
      </div>
    </div>
  );
}
