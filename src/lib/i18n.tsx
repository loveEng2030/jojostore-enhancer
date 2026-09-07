import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSiteContent } from "@/lib/site-content";


export type Lang = "ar" | "en";

type Entry = readonly [string, string];

const dict = {
  "brand.name": ["جوجو ستور", "JOJO Store"],
  "brand.tagline": ["أزياء تناسب جميع الفئات", "Fashion for every family"],

  "nav.home": ["الرئيسية", "Home"],
  "nav.catalog": ["الكتالوج", "Catalog"],
  "nav.b2b": ["B2B توريد", "B2B Supply"],
  "nav.story": ["قصتنا", "Our Story"],
  "nav.faq": ["FAQ", "FAQ"],
  "nav.contact": ["تواصل", "Contact"],
  "nav.cta": ["طلب عرض توريد", "Request a quote"],
  "nav.menu": ["القائمة", "Menu"],
  "nav.close": ["إغلاق", "Close"],

  "common.whatsapp": ["واتساب", "WhatsApp"],
  "common.call": ["اتصل بنا", "Call us"],
  "common.browseCatalog": ["تصفح الكتالوج", "Browse the catalog"],
  "common.browseCatalogFull": [
    "تصفح الكتالوج بالكامل",
    "View the full catalog",
  ],
  "common.orderNow": ["تواصل للطلب", "Contact to order"],
  "common.available": ["متاح", "Available"],
  "common.new": ["جديد", "New"],
  "common.viewImage": ["عرض الصورة كاملة", "View full image"],
  "common.showColor": ["عرض اللون", "Show colour"],
  "common.knowStory": ["اعرف قصتنا", "Read our story"],
  "common.quickLinks": ["روابط سريعة", "Quick links"],
  "common.contactUs": ["تواصل معنا", "Contact us"],

  "hero.kicker": [
    "نصنع الأناقة منذ أكثر من 20 عاماً",
    "Crafting elegance for over 20 years",
  ],
  "hero.title": [
    "جوجو ستور — ملابس بالجملة بروح الأناقة وتفاصيل الرُقي",
    "JOJO Store — wholesale fashion with a refined touch",
  ],
  "hero.subtitle": [
    "أناقة عالمية، جودة موثوقة، وأسعار تنافسية تجعل جوجو ستور خيارك الأول للتوريد التجاري.",
    "Global style, dependable quality and competitive pricing that make JOJO Store your first choice for wholesale supply.",
  ],
  "hero.body": [
    "في جوجو ستور نؤمن أن الجودة الحقيقية تبدأ من التفاصيل. بخبرة تمتد لأكثر من عقدين في تجارة الملابس، نقدم منتجات تجمع بين الجودة العالية والتصميم العصري والأسعار التنافسية للمتاجر وتجار الجملة داخل وخارج مصر.",
    "At JOJO Store we believe real quality starts with the details. With more than two decades in the apparel trade, we deliver products that combine high quality, modern design and competitive prices for stores and wholesalers inside and outside Egypt.",
  ],
  "hero.stat1": ["سنة خبرة", "years of experience"],
  "hero.stat2": ["زيادة الطاقة التشغيلية", "growth in operating capacity"],
  "hero.stat3": [
    "توريد للمتاجر والموزعين",
    "supply for stores and distributors",
  ],

  "discover.kicker": ["اكتشف عالم جوجو", "Discover the JOJO world"],
  "discover.title": [
    "موديلات مصممة لتلفت النظر",
    "Styles designed to turn heads",
  ],
  "discover.subtitle": [
    "تجربة تصفح بصرية هادئة، صور كبيرة، ألوان واضحة، وتفاصيل بسيطة تساعدك تختار الموديل المناسب بسرعة.",
    "A calm browsing experience with large imagery, clear colours and simple details so you can pick the right style fast.",
  ],
  "discover.card1": ["التشكيلة الجديدة", "The new collection"],
  "discover.card2": ["اختيارات مميزة", "Featured picks"],
  "discover.card3": ["مقاسات لكل مرحلة", "Sizes for every stage"],

  "pillars.1.title": ["جودة تبدأ من التفاصيل", "Quality starts with detail"],
  "pillars.1.body": [
    "نختار أجود الخامات بعناية ونحافظ على ثبات التشطيب في كل دفعة إنتاج.",
    "We hand-pick the finest fabrics and keep the finish consistent across every production batch.",
  ],
  "pillars.2.title": ["جاهزون للتوريد", "Ready to supply"],
  "pillars.2.body": [
    "حلول توريد للمتاجر والبوتيكات وتجار الجملة مع مقاسات وألوان مناسبة للسوق.",
    "Supply solutions for stores, boutiques and wholesalers with market-ready sizes and colours.",
  ],
  "pillars.3.title": ["أسعار تنافس المستورد", "Prices that beat imports"],
  "pillars.3.body": [
    "تصاميم عصرية، جودة موثوقة، وأسعار تنافس أشهر المنتجات المستوردة.",
    "Modern designs, reliable quality and prices that compete with leading imported products.",
  ],

  "stages.kicker": ["خطوات الشراء", "Ordering steps"],
  "stages.title": ["من الاختيار إلى الاستلام", "From selection to delivery"],
  "stages.subtitle": [
    "خطوات واضحة لطلب الجملة من جوجو ستور، من تصفح الكتالوج حتى وصول الشحنة إلى محلك.",
    "Clear wholesale ordering steps with JOJO Store, from browsing the catalogue to delivery at your store.",
  ],
  "stages.1.title": ["تصفح الكتالوج", "Browse the catalogue"],
  "stages.1.body": [
    "اختر الموديلات المناسبة لمحلك من الأقسام مع الألوان والمقاسات المتاحة.",
    "Choose the right styles for your store with available colours and sizes.",
  ],
  "stages.2.title": ["تأكيد الطلب", "Confirm the order"],
  "stages.2.body": [
    "أرسل اختيارك عبر واتساب ليتم مراجعة الكميات وتأكيد تفاصيل الطلب.",
    "Send your selection on WhatsApp to review quantities and confirm order details.",
  ],
  "stages.3.title": ["التجهيز والتغليف", "Preparation & packing"],
  "stages.3.body": [
    "نجهز كل المنتجات ونراجعها ثم نغلفها بعناية قبل الشحن.",
    "We prepare, check and carefully pack every product before shipping.",
  ],
  "stages.4.title": ["الشحن والتسليم", "Shipping & delivery"],
  "stages.4.body": [
    "نشحن طلبك بشكل آمن ونتابع وصوله إلى عنوانك المتفق عليه.",
    "We ship your order securely and follow it through to the agreed address.",
  ],

  "b2b.kicker": ["توريد تجاري", "Commercial supply"],
  "b2b.title": [
    "جوجو — شريك تصنيع وتوريد للمتاجر",
    "JOJO — a manufacturing and supply partner for stores",
  ],
  "b2b.subtitle": [
    "حلول توريد B2B للمتاجر، تجار الجملة، وشركات التوزيع داخل مصر والخليج.",
    "B2B supply solutions for stores, wholesalers and distribution companies in Egypt and the Gulf.",
  ],
  "b2b.point1": [
    "توريد جملة للمتاجر والبوتيكات داخل مصر والخليج",
    "Wholesale supply for stores and boutiques in Egypt and the Gulf",
  ],
  "b2b.point2": [
    "إمكانية تجهيز موديلات وكميات حسب الطلب",
    "Custom styles and quantities on request",
  ],
  "b2b.point3": [
    "مقاسات أطفال ورجالي وحريمي من Medium حتى 2XL",
    "Kids, men and women sizing from Medium to 2XL",
  ],
  "b2b.point4": [
    "تشطيب Premium وجودة ثابتة في كل دفعة",
    "Premium finishing and consistent quality in every batch",
  ],
  "b2b.point5": [
    "أسعار تنافسية أمام المنتجات المستوردة",
    "Competitive pricing against imported products",
  ],
  "b2b.point6": [
    "استعداد للتوسع في السعودية والإمارات والكويت وقطر والبحرين وعُمان",
    "Ready to expand into Saudi Arabia, UAE, Kuwait, Qatar, Bahrain and Oman",
  ],
  "b2b.formTitle": ["اطلب عرض توريد", "Request a supply quote"],
  "b2b.formBody": [
    "ابعتلنا الموديلات والألوان والكميات المطلوبة على واتساب ونرد عليك بعرض سعر خلال ساعات.",
    "Send us the styles, colours and quantities you need on WhatsApp and we will reply with a quote within hours.",
  ],
  "b2b.moq": ["أقل كمية للطلب", "Minimum order"],
  "b2b.moqValue": ["12 قطعة للموديل", "12 pieces per style"],
  "b2b.lead": ["مدة التجهيز", "Lead time"],
  "b2b.leadValue": ["2 - 7 أيام عمل", "2 - 7 working days"],
  "b2b.shipping": ["الشحن", "Shipping"],
  "b2b.shippingValue": [
    "لكل محافظات مصر وتصدير للخليج",
    "All Egyptian governorates and export to the Gulf",
  ],

  "catalog.kicker": ["الكتالوج", "Catalog"],
  "catalog.title": ["أحدث موديلات جوجو", "The latest JOJO styles"],
  "catalog.subtitle": [
    "تصفح الموديلات المتاحة للتوريد واطلب أي كود على واتساب مباشرة.",
    "Browse the styles available for supply and order any code directly on WhatsApp.",
  ],
  "catalog.allColors": ["كل الألوان", "All colours"],
  "catalog.searchPlaceholder": [
    "ابحث باسم الموديل أو الكود",
    "Search by style name or code",
  ],
  "catalog.all": ["كل الأقسام", "All categories"],
  "catalog.newOnly": ["الجديد فقط", "New only"],
  "catalog.count": ["موديل متاح", "styles available"],
  "catalog.empty": [
    "لا توجد موديلات مطابقة لهذا الاختيار.",
    "No styles match this selection.",
  ],

  "story.kicker": ["قصتنا", "Our story"],
  "story.title": [
    "أكثر من 20 سنة في تجارة الملابس",
    "More than 20 years in the apparel trade",
  ],
  "story.p1": [
    "بدأت جوجو ستور كمكتب صغير لتوريد الملابس في حدائق حلوان، واليوم نخدم مئات المحلات والموزعين في مصر بخبرة تتجاوز العشرين عاماً.",
    "JOJO Store began as a small apparel supply office in Hadayek Helwan; today we serve hundreds of shops and distributors across Egypt with over twenty years of experience.",
  ],
  "story.p2": [
    "نؤمن أن نجاح تاجر التجزئة هو نجاحنا، لذلك نختار كل موديل بعناية ونتابع الجودة قطعة بقطعة قبل التسليم.",
    "We believe a retailer's success is our success, so we choose every style carefully and check quality piece by piece before delivery.",
  ],
  "story.p3": [
    "هدفنا أن نقدم بديلاً محلياً ينافس المستورد في الجودة والسعر معاً، مع خدمة سريعة وتواصل مباشر بدون وسطاء.",
    "Our goal is a local alternative that competes with imports on both quality and price, with fast service and direct communication.",
  ],
  "story.valuesTitle": ["قيمنا", "Our values"],
  "story.v1": ["الثقة", "Trust"],
  "story.v1b": [
    "علاقات طويلة المدى مع عملائنا مبنية على الصدق في الوصف والسعر.",
    "Long-term relationships built on honest descriptions and honest pricing.",
  ],
  "story.v2": ["الجودة", "Quality"],
  "story.v2b": [
    "خامات مختارة وتشطيب ثابت في كل دفعة.",
    "Selected fabrics and a consistent finish in every batch.",
  ],
  "story.v3": ["السرعة", "Speed"],
  "story.v3b": [
    "رد سريع على واتساب وتجهيز الطلبات في أيام قليلة.",
    "Fast WhatsApp replies and orders prepared in a few days.",
  ],

  "faq.kicker": ["الأسئلة الشائعة", "FAQ"],
  "faq.title": ["أسئلة يسألها تجار الجملة", "Questions wholesalers ask"],
  "faq.q1": ["هل البيع جملة فقط؟", "Do you sell wholesale only?"],
  "faq.a1": [
    "نعم، جوجو ستور مكتب توريد جملة للمحلات والموزعين، وأقل كمية 12 قطعة للموديل الواحد.",
    "Yes. JOJO Store is a wholesale supply office for shops and distributors, with a minimum of 12 pieces per style.",
  ],
  "faq.q2": ["إزاي أطلب؟", "How do I place an order?"],
  "faq.a2": [
    "اختر الأكواد من الكتالوج وابعتها على واتساب مع الكميات والألوان، وهنرد عليك بعرض السعر والتوافر.",
    "Pick the codes from the catalog and send them on WhatsApp with quantities and colours; we reply with pricing and availability.",
  ],
  "faq.q3": ["هل بتشحنوا لكل المحافظات؟", "Do you ship to all governorates?"],
  "faq.a3": [
    "نعم، نشحن لكل محافظات مصر عبر شركات شحن موثوقة، ونصدّر لدول الخليج حسب الكمية.",
    "Yes, we ship to every Egyptian governorate through trusted couriers, and export to the Gulf depending on quantity.",
  ],
  "faq.q4": ["هل الأسعار ثابتة؟", "Are prices fixed?"],
  "faq.a4": [
    "الأسعار تختلف حسب الكمية والخامة والموسم، ولذلك نرسل عرض سعر محدث لكل طلب.",
    "Prices vary by quantity, fabric and season, so we send an updated quote for each order.",
  ],
  "faq.q5": ["أقدر أشوف عينة قبل الطلب؟", "Can I see a sample first?"],
  "faq.a5": [
    "نعم، يمكن طلب عينة من أي موديل قبل الطلب الكبير، أو زيارة المكتب في حدائق حلوان.",
    "Yes, you can request a sample of any style before a large order, or visit our office in Hadayek Helwan.",
  ],
  "faq.q6": ["هل يوجد استبدال؟", "Do you accept exchanges?"],
  "faq.a6": [
    "نراجع كل قطعة قبل التسليم، وفي حالة وجود عيب تصنيع نستبدل القطعة خلال 7 أيام.",
    "We inspect every piece before delivery, and replace any manufacturing defect within 7 days.",
  ],

  "contact.kicker": ["تواصل", "Contact"],
  "contact.title": ["تواصل مع فريق التوريد", "Talk to our supply team"],
  "contact.subtitle": [
    "متاحون يومياً من 10 صباحاً حتى 8 مساءً للرد على استفسارات الجملة.",
    "Available daily from 10am to 8pm for all wholesale enquiries.",
  ],
  "contact.address": ["العنوان", "Address"],
  "contact.phone": ["الهاتف", "Phone"],
  "contact.hours": ["مواعيد العمل", "Working hours"],
  "contact.hoursValue": [
    "السبت - الخميس، 10 ص إلى 8 م",
    "Saturday - Thursday, 10am to 8pm",
  ],

  "cta.title": [
    "جاهز تبدأ توريد منتجات جوجو لمتجرك؟",
    "Ready to stock JOJO products in your store?",
  ],
  "cta.body": [
    "اطلب عرض توريد الآن، وحدد الموديلات والألوان والكميات المطلوبة.",
    "Request a supply quote now and tell us the styles, colours and quantities you need.",
  ],

  "footer.about": [
    "مكتب متخصص في بيع الملابس بالجملة — حريمي، رجالي، أطفال، هوم وير وكاجوال، بخامات مختارة وأسعار مصنع للمحلات والموزعين.",
    "A wholesale apparel office — women, men, kids, homewear and casual — with selected fabrics and factory prices for shops and distributors.",
  ],
  "footer.rights": [
    "جوجو ستور — جملة الملابس بأناقة وأسعار المصنع",
    "JOJO Store — wholesale fashion at factory prices",
  ],
} satisfies Record<string, Entry>;

export type TKey = keyof typeof dict;

const colorEn: Record<string, string> = {
  "أحمر": "Red",
  "أزرق": "Blue",
  "أسود": "Black",
  "أصفر": "Yellow",
  "أوف وايت": "Off white",
  "بمبي": "Pink",
  "بني": "Brown",
  "بيج": "Beige",
  "رمادي": "Grey",
  "زيتي": "Olive",
  "كحلي": "Navy",
  "لافندر": "Lavender",
  "لبني": "Light blue",
  "مشكل": "Assorted",
  "منت": "Mint",
  "نبيتي": "Burgundy",
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: "rtl" | "ltr";
  t: (key: TKey) => string;
  tx: (ar: string, en: string) => string;
  tColor: (ar: string) => string;
}

const defaultI18n: I18nValue = {
  lang: "ar",
  setLang: () => {},
  dir: "rtl",
  t: (key) => dict[key][0],
  tx: (ar) => ar,
  tColor: (ar) => ar,
};

const I18nContext = createContext<I18nValue>(defaultI18n);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const { content } = useSiteContent();

  useEffect(() => {
    const saved = window.localStorage.getItem("jojo-lang");
    if (saved === "en" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang]);

  const value = useMemo<I18nValue>(() => {
    const idx = lang === "ar" ? 0 : 1;
    return {
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang: (l) => {
        setLangState(l);
        window.localStorage.setItem("jojo-lang", l);
      },
      t: (key) => {
        const override = content[key];
        const custom = override ? (lang === "ar" ? override.ar : override.en) : "";
        return custom.trim() ? custom : dict[key][idx];
      },
      tx: (ar, en) => (lang === "ar" ? ar : en),
      tColor: (ar) => (lang === "ar" ? ar : (colorEn[ar] ?? ar)),
    };
  }, [lang, content]);


  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
