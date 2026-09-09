import { Facebook, Instagram, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const isValid = (v: string) => /^https?:\/\//i.test(v.trim());

export function SocialLinks({ className = "" }: { className?: string }) {
  const { t } = useI18n();

  const items = [
    { key: "social.facebook" as const, icon: Facebook, label: "Facebook" },
    { key: "social.instagram" as const, icon: Instagram, label: "Instagram" },
    { key: "social.telegram" as const, icon: Send, label: "Telegram" },
  ]
    .map((i) => ({ ...i, url: t(i.key) }))
    .filter((i) => isValid(i.url));

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {items.map((i) => (
        <a
          key={i.label}
          href={i.url}
          target="_blank"
          rel="noreferrer"
          aria-label={i.label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <i.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
