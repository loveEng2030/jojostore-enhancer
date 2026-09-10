import { useSiteContent } from "@/lib/site-content";
import {
  isValidSocialUrl,
  socialItemsFrom,
  socialPlatform,
  socialSeed,
} from "@/lib/social";

export function SocialLinks({ className = "" }: { className?: string }) {
  const { content, loaded } = useSiteContent();

  const stored = socialItemsFrom(content).filter((i) => isValidSocialUrl(i.url));
  const items = stored.length
    ? stored
    : loaded
      ? []
      : socialSeed.map((s, i) => ({ key: `seed-${i}`, slot: i + 1, ...s }));

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {items.map((item) => {
        const platform = socialPlatform(item.platform);
        const Icon = platform.icon;
        return (
          <a
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={platform.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
