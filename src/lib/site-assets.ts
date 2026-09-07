import heroPoster from "@/assets/hero-poster.jpg";
import discoverNew from "@/assets/jojo-editorial-main.jpg";
import discoverEdit from "@/assets/jojo-editorial-edit.jpg";
import discoverSizes from "@/assets/jojo-editorial-craft.jpg";
import orderCatalog from "@/assets/jojo-order-catalog.jpg";
import orderConfirm from "@/assets/jojo-order-confirm.jpg";
import orderPack from "@/assets/jojo-order-pack.jpg";
import orderDelivery from "@/assets/jojo-order-delivery.jpg";
import logo from "@/assets/jojo-logo.png";

export interface SiteImageDef {
  key: string;
  label: string;
  fallback: string;
}

export const siteImages: SiteImageDef[] = [
  { key: "brand.logo", label: "لوجو جوجو", fallback: logo },
  { key: "hero.poster", label: "صورة الشاشة الرئيسية", fallback: heroPoster },
  { key: "discover.1", label: "الموديلات - صورة كبيرة", fallback: discoverNew },
  { key: "discover.2", label: "الموديلات - صورة 2", fallback: discoverEdit },
  { key: "discover.3", label: "الموديلات - صورة 3", fallback: discoverSizes },
  { key: "stages.1", label: "خطوة 1 - تصفح الكتالوج", fallback: orderCatalog },
  { key: "stages.2", label: "خطوة 2 - تأكيد الطلب", fallback: orderConfirm },
  { key: "stages.3", label: "خطوة 3 - التجهيز والتغليف", fallback: orderPack },
  { key: "stages.4", label: "خطوة 4 - الشحن والتسليم", fallback: orderDelivery },
  { key: "story.image", label: "صورة صفحة القصة", fallback: heroPoster },
];

export const imageFallback = (key: string) =>
  siteImages.find((i) => i.key === key)?.fallback ?? "";
