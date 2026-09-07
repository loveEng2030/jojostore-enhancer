import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/jojo-logo.png";
import { PHONE, WA_B2B } from "@/lib/data";
import { useI18n, type TKey } from "@/lib/i18n";

const links: { to: string; key: TKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/catalog", key: "nav.catalog" },
  { to: "/b2b", key: "nav.b2b" },
  { to: "/story", key: "nav.story" },
  { to: "/faq", key: "nav.faq" },
  { to: "/contact", key: "nav.contact" },
];

function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label="Switch language"
      className={`rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-muted ${className}`}
    >
      {lang === "ar" ? "EN" : "AR"}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full bg-card/95 px-4 py-2.5 shadow-lg shadow-foreground/5 ring-1 ring-border backdrop-blur">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt={t("brand.name")}
            className="h-11 w-11 rounded-full object-cover ring-1 ring-border"
          />
          <span className="leading-tight">
            <span className="block font-heading text-lg font-extrabold text-foreground">
              {t("brand.name")}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-bold" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle />
          <a
            href={`tel:+2${PHONE}`}
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 md:inline-flex"
            dir="ltr"
          >
            <Phone className="h-4 w-4" />
            {PHONE}
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("nav.menu")}
            className="rounded-full p-2 text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden">
          <div className="mx-auto mt-6 max-w-md space-y-3 rounded-3xl bg-card p-5 shadow-2xl ring-1 ring-border">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("nav.close")}
                className="rounded-full bg-rose-soft p-2 text-primary"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <span className="font-heading text-lg font-extrabold">
                  {t("brand.name")}
                </span>
                <img
                  src={logo}
                  alt={t("brand.name")}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                />
              </div>
            </div>

            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-2xl border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                {t(l.key)}
              </Link>
            ))}

            <a
              href={WA_B2B}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl bg-primary px-5 py-3 text-center text-sm font-bold text-primary-foreground"
            >
              {t("nav.cta")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
