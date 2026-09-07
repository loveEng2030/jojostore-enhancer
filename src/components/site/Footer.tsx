import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Lock } from "lucide-react";
import logo from "@/assets/jojo-logo.png";
import { ADDRESS, ADDRESS_EN, PHONE, WA_DEFAULT } from "@/lib/data";
import { useI18n, type TKey } from "@/lib/i18n";

const links: { to: string; key: TKey }[] = [
  { to: "/catalog", key: "nav.catalog" },
  { to: "/b2b", key: "nav.b2b" },
  { to: "/story", key: "nav.story" },
  { to: "/faq", key: "nav.faq" },
  { to: "/contact", key: "nav.contact" },
];

export function Footer() {
  const { t, tx } = useI18n();

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt={t("brand.name")}
              className="h-12 w-12 rounded-full object-cover ring-1 ring-border"
            />
            <div>
              <p className="font-heading text-lg font-extrabold">
                {t("brand.name")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("brand.tagline")}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("footer.about")}
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-heading font-bold">
            {t("common.quickLinks")}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-heading font-bold">
            {t("common.contactUs")}
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{tx(ADDRESS, ADDRESS_EN)}</span>
            </li>
            <li>
              <a
                href={`tel:+2${PHONE}`}
                className="flex items-center gap-2 hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">{PHONE}</span>
              </a>
            </li>
            <li>
              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("common.whatsapp")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 border-t border-border py-5 text-center text-xs text-muted-foreground">
        <span>{t("footer.rights")}</span>
        <Link
          to="/admin"
          aria-label="Admin"
          className="rounded-full p-1.5 text-muted-foreground/50 transition-colors hover:text-primary"
        >
          <Lock className="h-3.5 w-3.5" />
        </Link>
      </div>

    </footer>
  );
}
