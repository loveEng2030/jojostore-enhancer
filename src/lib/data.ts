import p1 from "@/assets/jojo-p1.jpg";
import p2 from "@/assets/jojo-p2.jpg";
import p3 from "@/assets/jojo-p3.jpg";
import p4 from "@/assets/jojo-p4.jpg";
import p5 from "@/assets/jojo-p5.jpg";
import p7 from "@/assets/jojo-p7.jpg";
import p8 from "@/assets/jojo-p8.jpg";
import p9 from "@/assets/jojo-p9.jpg";
import p10 from "@/assets/jojo-p10.jpg";
import p11 from "@/assets/jojo-p11.jpg";
import p12 from "@/assets/jojo-p12.jpg";
import p15 from "@/assets/jojo-p15.jpg";
import p16 from "@/assets/jojo-p16.jpg";
import p17 from "@/assets/jojo-p17.jpg";
import p18 from "@/assets/jojo-p18.jpg";
import p19 from "@/assets/jojo-p19.jpg";
import p21 from "@/assets/jojo-p21.jpg";
import p2alt from "@/assets/jojo-p2-alt.jpg";
import p4alt from "@/assets/jojo-p4-alt.jpg";
import p7alt from "@/assets/jojo-p7-alt.jpg";
import p9alt from "@/assets/jojo-p9-alt.jpg";
import p12alt from "@/assets/jojo-p12-alt.jpg";
import p15alt from "@/assets/jojo-p15-alt.jpg";
import p16alt from "@/assets/jojo-p16-alt.jpg";
import p17alt from "@/assets/jojo-p17-alt.jpg";
import p18alt from "@/assets/jojo-p18-alt.jpg";
import p5red from "@/assets/jojo-p5-red.jpg";
import p8black from "@/assets/jojo-p8-black.jpg";
import p21olive from "@/assets/jojo-p21-olive.jpg";
import p21cream from "@/assets/jojo-p21-cream.jpg";
import p19yellow from "@/assets/jojo-p19-yellow.jpg";
import p19pink from "@/assets/jojo-p19-pink.jpg";
import n5b from "@/assets/jojo-n5-navy.jpg";
import n1 from "@/assets/jojo-n1.jpg";
import n1b from "@/assets/jojo-n1-navy.jpg";
import n2 from "@/assets/jojo-n2.jpg";
import n2b from "@/assets/jojo-n2-pink.jpg";
import n3 from "@/assets/jojo-n3.jpg";
import n3b from "@/assets/jojo-n3-lavender.jpg";
import n4 from "@/assets/jojo-n4.jpg";
import n4b from "@/assets/jojo-n4-navy.jpg";
import n5 from "@/assets/jojo-n5.jpg";

export const PHONE = "01061318862";
export const PHONE_INTL = "201061318862";
export const ADDRESS =
  "16 شارع جمال عبد الناصر أمام مستشفى ماري جرجس، حدائق حلوان، القاهرة";

export const ADDRESS_EN =
  "16 Gamal Abdel Nasser St., in front of Mari Girgis Hospital, Hadayek Helwan, Cairo";

export const waLink = (message: string) =>
  `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(message)}`;

export const WA_DEFAULT = waLink(
  "السلام عليكم، أرغب في التواصل مع JOJO Store",
);
export const WA_CATALOG = waLink(
  "السلام عليكم، أرغب في استلام كتالوج الجملة وأسعار JOJO Store",
);
export const WA_CATALOG_FULL = waLink(
  "السلام عليكم، أرغب في استلام كتالوج الجملة الكامل وأسعار JOJO Store",
);

export interface Section {
  id: string;
  name: string;
  nameEn: string;
}

export const sections: Section[] = [
  { id: "men", name: "قسم رجالي", nameEn: "Men" },
  { id: "women", name: "قسم حريمي", nameEn: "Women" },
  { id: "unisex", name: "قسم محير", nameEn: "Unisex" },
  { id: "kids", name: "قسم أطفال", nameEn: "Kids" },
  { id: "newborn", name: "قسم حديثي الولادة", nameEn: "Newborn" },
  { id: "shaabi", name: "قسم شعبي", nameEn: "Popular" },
];

export interface Category {
  id: string;
  sectionId: string;
  name: string;
  nameEn: string;
  image: string;
}

export const categories: Category[] = [
  { id: "men-casual", sectionId: "men", name: "كاجوال", nameEn: "Casual", image: p16 },
  { id: "men-homewear", sectionId: "men", name: "هوم وير", nameEn: "Homewear", image: p16alt },
  { id: "women-casual", sectionId: "women", name: "كاجوال", nameEn: "Casual", image: p11 },
  { id: "women-homewear", sectionId: "women", name: "هوم وير", nameEn: "Homewear", image: p1 },
  { id: "women-lingerie", sectionId: "women", name: "لانجيري", nameEn: "Lingerie", image: p3 },
  { id: "unisex-outing", sectionId: "unisex", name: "خروج", nameEn: "Outing", image: p19 },
  { id: "unisex-homewear", sectionId: "unisex", name: "هوم وير", nameEn: "Homewear", image: p15 },
  { id: "kids-outing", sectionId: "kids", name: "خروج", nameEn: "Outing", image: p2 },
  { id: "kids-homewear", sectionId: "kids", name: "هوم وير", nameEn: "Homewear", image: p17 },
  { id: "newborn", sectionId: "newborn", name: "حديثي الولادة", nameEn: "Newborn", image: n2 },
  { id: "shaabi", sectionId: "shaabi", name: "شعبي", nameEn: "Popular", image: p19 },
];

export interface Product {
  code: string;
  name: string;
  nameEn: string;
  categoryId: string;
  category: string;
  colors: string[];
  sizes: string[];
  image: string;
  colorImages?: Partial<Record<string, string>>;
  isNew: boolean;
}

export const products: Product[] = [
  { code: "W-101", name: "طقم تراك حريمي سويت شيرت وبنطلون", nameEn: "Women sweatshirt and trousers tracksuit", categoryId: "women-homewear", category: "حريمي - هوم وير", colors: ["بمبي", "لبني", "نبيتي", "لافندر"], sizes: ["12", "14", "16", "18"], image: p1, colorImages: { "بمبي": p1, "لبني": p10, "نبيتي": p11, "لافندر": p3 }, isNew: true },
  { code: "K-201", name: "طقم سويت شيرت وبنطلون أطفال بطبعة", nameEn: "Kids printed sweatshirt and trousers set", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["بني", "كحلي"], sizes: ["3", "4", "5", "6", "7"], image: p2, colorImages: { "بني": p2, "كحلي": p2alt }, isNew: true },
  { code: "K-202", name: "تيشيرت وليجن شتوي مقلم دينو", nameEn: "Kids striped dino winter t-shirt and leggings", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["أوف وايت", "بمبي"], sizes: ["3", "4", "5", "6", "7"], image: p7, colorImages: { "أوف وايت": p7, "بمبي": p7alt }, isNew: true },
  { code: "K-203", name: "سويت شيرت أطفال مقلم وبنطلون كارجو", nameEn: "Kids striped sweatshirt and cargo trousers", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["لبني", "زيتي"], sizes: ["3", "4", "5", "6", "7"], image: p4, colorImages: { "لبني": p4, "زيتي": p4alt }, isNew: false },
  { code: "K-204", name: "طقم جاكت بسحاب وبنطلون أولادي", nameEn: "Boys zip jacket and trousers set", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["كحلي", "أحمر"], sizes: ["6", "8", "10", "12"], image: p5, colorImages: { "كحلي": p5, "أحمر": p5red }, isNew: true },
  { code: "K-205", name: "طقم جاكت بسحاب وكارجو أولادي", nameEn: "Boys zip jacket and cargo set", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["رمادي", "أسود"], sizes: ["6", "8", "10", "12"], image: p8, colorImages: { "رمادي": p8, "أسود": p8black }, isNew: false },
  { code: "K-206", name: "طقم جاكت سبيد بسحاب وبنطلون", nameEn: "Kids Speed zip jacket and trousers set", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["أزرق", "رمادي"], sizes: ["6", "8", "10", "12"], image: p9, colorImages: { "أزرق": p9, "رمادي": p9alt }, isNew: false },
  { code: "K-207", name: "طقم جاكت دينو وكارجو", nameEn: "Kids dino jacket and cargo set", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["بيج", "لبني"], sizes: ["6", "8", "10", "12"], image: p12, colorImages: { "بيج": p12, "لبني": p12alt }, isNew: false },
  { code: "K-208", name: "بيجامات بناتي شتوية مطبوعة", nameEn: "Girls printed winter pyjamas", categoryId: "kids-homewear", category: "أطفال - هوم وير", colors: ["لافندر", "منت"], sizes: ["6", "8", "10", "12", "14"], image: p17, colorImages: { "لافندر": p17, "منت": p17alt }, isNew: true },
  { code: "K-209", name: "تشكيلة أطقم أطفال متنوعة", nameEn: "Assorted kids coordinated sets", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["بيج", "زيتي", "أوف وايت"], sizes: ["4", "6", "8", "10", "12"], image: p21, colorImages: { "بيج": p21, "زيتي": p21olive, "أوف وايت": p21cream }, isNew: false },
  { code: "K-210", name: "طقم سويت شيرت مقلم وبنطلون كارجو أطفال", nameEn: "Kids striped sweatshirt and cargo trousers set", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["بني", "كحلي"], sizes: ["4", "6", "8", "10", "12"], image: n1, colorImages: { "بني": n1, "كحلي": n1b }, isNew: true },
  { code: "K-211", name: "تيشيرت بيبي قطن ناعم", nameEn: "Soft cotton baby t-shirt", categoryId: "newborn", category: "حديثي الولادة", colors: ["لبني", "بمبي"], sizes: ["0-3", "3-6", "6-9", "9-12"], image: n2, colorImages: { "لبني": n2, "بمبي": n2b }, isNew: true },
  { code: "K-212", name: "طقم سويت شيرت وليجن بناتي بطبعة", nameEn: "Girls printed sweatshirt and leggings set", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["بيج", "لافندر"], sizes: ["2", "3", "4", "5"], image: n3, colorImages: { "بيج": n3, "لافندر": n3b }, isNew: true },
  { code: "K-213", name: "طقم هودي بسحاب وبنطلون أولادي", nameEn: "Boys zip hoodie and trousers set", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["أسود", "كحلي"], sizes: ["6", "8", "10", "12", "14"], image: n4, colorImages: { "أسود": n4, "كحلي": n4b }, isNew: true },
  { code: "K-214", name: "طقم سويت شيرت وبنطلون بناتي واسع", nameEn: "Girls sweatshirt and wide trousers set", categoryId: "kids-outing", category: "أطفال - خروج", colors: ["رمادي", "كحلي"], sizes: ["6", "8", "10", "12", "14", "16"], image: n5, colorImages: { "رمادي": n5, "كحلي": n5b }, isNew: true },
  { code: "M-301", name: "أطقم تراك رجالي شتوية", nameEn: "Men winter tracksuit sets", categoryId: "men-homewear", category: "رجالي - هوم وير", colors: ["أسود", "نبيتي"], sizes: ["M", "L", "XL", "2XL"], image: p16, colorImages: { "أسود": p16, "نبيتي": p16alt }, isNew: true },
  { code: "H-401", name: "تشكيلة أطقم شتوية متنوعة", nameEn: "Assorted winter coordinated sets", categoryId: "unisex-homewear", category: "محير - هوم وير", colors: ["بني", "أسود"], sizes: ["M", "L", "XL", "2XL"], image: p15, colorImages: { "بني": p15, "أسود": p15alt }, isNew: true },
  { code: "H-402", name: "أطقم بناتي هوم وير", nameEn: "Girls homewear sets", categoryId: "kids-homewear", category: "أطفال - هوم وير", colors: ["لبني", "بمبي"], sizes: ["4", "6", "8", "10"], image: p18, colorImages: { "لبني": p18, "بمبي": p18alt }, isNew: false },
  { code: "C-501", name: "تشكيلة كاجوال صيفية للعائلة", nameEn: "Family summer casual collection", categoryId: "unisex-outing", category: "محير - خروج", colors: ["أزرق", "أصفر", "بمبي"], sizes: ["مشكل"], image: p19, colorImages: { "أزرق": p19, "أصفر": p19yellow, "بمبي": p19pink }, isNew: true },
];

export const allColors = [
  "أحمر", "أزرق", "أسود", "أصفر", "أوف وايت", "بمبي", "بني", "بيج",
  "رمادي", "زيتي", "كحلي", "لافندر", "لبني", "مشكل", "منت", "نبيتي",
];

export const colorHex: Record<string, string> = {
  "أحمر": "#c0392b",
  "أزرق": "#2563eb",
  "أسود": "#1a1a1a",
  "أصفر": "#eab308",
  "أوف وايت": "#f3efe7",
  "بمبي": "#e8a0b4",
  "بني": "#7b4a2d",
  "بيج": "#d9c3a5",
  "رمادي": "#9ca3af",
  "زيتي": "#5b6b3a",
  "كحلي": "#1e2a52",
  "لافندر": "#b9a4d8",
  "لبني": "#a8cbe8",
  "مشكل": "#c9a84c",
  "منت": "#8fd6bd",
  "نبيتي": "#6b2233",
};

export const productWaLink = (p: Product) =>
  waLink(
    `السلام عليكم، أرغب في الاستفسار عن طلب جملة للمنتج: ${p.name} (كود ${p.code.toLowerCase()}) - قسم ${p.category}. من JOJO Store`,
  );

export const categoryWaLink = (name: string) =>
  waLink(
    `السلام عليكم، أرغب في الاستفسار عن أسعار الجملة لقسم ${name} في JOJO Store`,
  );

export const newProducts = products.filter((p) => p.isNew);
export const stapleProducts = products.filter((p) => !p.isNew);

export const WA_B2B = waLink(
  "السلام عليكم، أرغب في طلب عرض توريد B2B من JOJO Store",
);
