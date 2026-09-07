import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SectionHeader({
  kicker,
  title,
  subtitle,
  linkTo,
  linkLabel,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
}) {
  const { lang } = useI18n();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
          {kicker}
        </span>
        <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
        >
          {linkLabel}
          <Arrow className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
