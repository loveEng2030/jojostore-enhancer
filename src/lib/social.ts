import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Send,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";

export interface SocialPlatform {
  id: string;
  label: string;
  icon: LucideIcon;
  placeholder: string;
}

export const socialPlatforms: SocialPlatform[] = [
  { id: "facebook", label: "فيسبوك", icon: Facebook, placeholder: "https://facebook.com/..." },
  { id: "instagram", label: "إنستجرام", icon: Instagram, placeholder: "https://instagram.com/..." },
  { id: "telegram", label: "تيليجرام", icon: Send, placeholder: "https://t.me/..." },
  { id: "whatsapp", label: "واتساب", icon: MessageCircle, placeholder: "https://wa.me/20..." },
  { id: "tiktok", label: "تيك توك", icon: Music2, placeholder: "https://tiktok.com/@..." },
  { id: "youtube", label: "يوتيوب", icon: Youtube, placeholder: "https://youtube.com/@..." },
  { id: "twitter", label: "إكس / تويتر", icon: Twitter, placeholder: "https://x.com/..." },
  { id: "linkedin", label: "لينكدإن", icon: Linkedin, placeholder: "https://linkedin.com/..." },
  { id: "website", label: "موقع / رابط آخر", icon: Globe, placeholder: "https://..." },
];

export const socialPlatform = (id: string) =>
  socialPlatforms.find((p) => p.id === id) ?? socialPlatforms[socialPlatforms.length - 1]!;

/** site_content keys used for the editable social list: social.link.1, social.link.2 ... */
export const socialKeyPrefix = "social.link.";

export const socialSlotOf = (key: string) => Number(key.slice(socialKeyPrefix.length)) || 0;

export interface SocialItem {
  key: string;
  slot: number;
  platform: string;
  url: string;
}

export const isValidSocialUrl = (v: string) => /^https?:\/\/\S+$/i.test(v.trim());

/** value_ar holds the platform id, value_en holds the url. */
export function socialItemsFrom(content: Record<string, { ar: string; en: string }>): SocialItem[] {
  return Object.entries(content)
    .filter(([key]) => key.startsWith(socialKeyPrefix))
    .map(([key, value]) => ({
      key,
      slot: socialSlotOf(key),
      platform: value.ar,
      url: value.en,
    }))
    .filter((i) => i.slot > 0)
    .sort((a, b) => a.slot - b.slot);
}

export const socialSeed: { platform: string; url: string }[] = [
  { platform: "facebook", url: "https://www.facebook.com/jojostore" },
  { platform: "instagram", url: "https://www.instagram.com/jojostore" },
  { platform: "telegram", url: "https://t.me/jojostore" },
];
