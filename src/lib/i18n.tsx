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
  "nav.b2b": ["تصدير خارجي", "Export"],
  "nav.egypt": ["تجار مصر", "Egypt Merchants"],

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
  "common.openMap": ["افتح الخريطة على جوجل", "Open in Google Maps"],

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

  "b2b.kicker": ["تصدير خارجي", "Export"],
  "b2b.title": [
    "جوجو — التصدير الخارجي وتوريد الأسواق العربية",
    "JOJO — export and supply for international markets",
  ],
  "b2b.subtitle": [
    "صفحة مخصصة للتصدير الخارجي فقط: موزعين ومتاجر وسلاسل في الخليج والأسواق العربية. للتجار داخل مصر عندنا صفحة منفصلة.",
    "This page is dedicated to export only: distributors, stores and chains in the Gulf and Arab markets. Merchants inside Egypt have a separate page.",
  ],
  "b2b.point1": [
    "تصدير جملة للمتاجر والموزعين في السعودية والإمارات والكويت وقطر والبحرين وعُمان",
    "Wholesale export to stores and distributors in Saudi Arabia, UAE, Kuwait, Qatar, Bahrain and Oman",
  ],
  "b2b.point2": [
    "تجهيز موديلات وكميات ومقاسات حسب متطلبات السوق الخارجي",
    "Styles, quantities and sizing prepared for each export market",
  ],
  "b2b.point3": [
    "تجهيز المستندات وبيانات الشحن والتغليف للتصدير",
    "Export documents, shipping data and packing prepared for you",
  ],
  "b2b.point4": [
    "تشطيب Premium وجودة ثابتة في كل دفعة تصدير",
    "Premium finishing and consistent quality in every export batch",
  ],
  "b2b.point5": [
    "أسعار FOB تنافسية أمام المنتجات الآسيوية المستوردة",
    "Competitive FOB pricing against imported Asian products",
  ],
  "b2b.point6": [
    "إمكانية الإنتاج بعلامة العميل الخاصة (Private Label)",
    "Private label production available",
  ],
  "b2b.formTitle": ["اطلب عرض تصدير", "Request an export quote"],
  "b2b.formBody": [
    "ابعتلنا بلد الوصول والموديلات والكميات على واتساب ونرد عليك بعرض تصدير خلال ساعات.",
    "Send us the destination country, styles and quantities on WhatsApp and we will reply with an export quote within hours.",
  ],
  "b2b.moq": ["أقل كمية للتصدير", "Minimum export order"],
  "b2b.moqValue": ["300 قطعة للشحنة", "300 pieces per shipment"],
  "b2b.lead": ["مدة الإنتاج", "Production time"],
  "b2b.leadValue": ["10 - 21 يوم عمل", "10 - 21 working days"],
  "b2b.shipping": ["الشحن", "Shipping"],
  "b2b.shippingValue": [
    "شحن جوي وبحري للخليج والأسواق العربية",
    "Air and sea freight to the Gulf and Arab markets",
  ],
  "b2b.localNote": [
    "تاجر داخل مصر؟ روح لصفحة تجار مصر واملأ بياناتك.",
    "A merchant inside Egypt? Go to the Egypt merchants page and fill in your details.",
  ],

  "eg.kicker": ["تجار مصر", "Egypt merchants"],
  "eg.title": [
    "توريد جملة لتجار ومتاجر مصر",
    "Wholesale supply for merchants and stores in Egypt",
  ],
  "eg.subtitle": [
    "صفحة مخصصة للتجار والمتاجر والبوتيكات وأصحاب الصفحات داخل مصر. املأ بياناتك وفريقنا يتواصل معاك بعرض الأسعار.",
    "A dedicated page for merchants, stores, boutiques and online sellers inside Egypt. Fill in your details and our team will contact you with pricing.",
  ],
  "eg.moq": ["أقل كمية للطلب", "Minimum order"],
  "eg.moqValue": ["12 قطعة للموديل", "12 pieces per style"],
  "eg.lead": ["مدة التجهيز", "Lead time"],
  "eg.leadValue": ["2 - 7 أيام عمل", "2 - 7 working days"],
  "eg.shipping": ["الشحن", "Shipping"],
  "eg.shippingValue": [
    "لكل محافظات مصر مع إمكانية الدفع عند الاستلام",
    "All Egyptian governorates with cash on delivery available",
  ],
  "eg.point1": [
    "أسعار جملة خاصة للتجار داخل مصر",
    "Special wholesale pricing for merchants inside Egypt",
  ],
  "eg.point2": [
    "تشكيلة رجالي وحريمي وأطفال وحديثي الولادة",
    "Men, women, kids and newborn collections",
  ],
  "eg.point3": [
    "تجديد مستمر للموديلات كل أسبوع",
    "New styles refreshed every week",
  ],
  "eg.point4": [
    "دعم صور الموديلات للتاجر لاستخدامها في البيع",
    "Product photos provided for you to sell with",
  ],
  "eg.formTitle": ["نموذج بيانات التاجر", "Merchant details form"],
  "eg.formBody": [
    "املأ البيانات دي وهنكلمك في أسرع وقت.",
    "Fill in these details and we will call you as soon as possible.",
  ],
  "eg.name": ["اسم التاجر", "Merchant name"],
  "eg.store": ["اسم المتجر أو الصفحة", "Store or page name"],
  "eg.phone": ["رقم الموبايل / واتساب", "Mobile / WhatsApp number"],
  "eg.gov": ["المحافظة", "Governorate"],
  "eg.type": ["نوع النشاط", "Business type"],
  "eg.typeShop": ["محل / بوتيك", "Shop / boutique"],
  "eg.typeOnline": ["بيع أونلاين", "Online seller"],
  "eg.typeWholesale": ["تاجر جملة", "Wholesaler"],
  "eg.typeOther": ["نشاط آخر", "Other"],
  "eg.interests": ["الأقسام المطلوبة", "Sections you need"],
  "eg.volume": ["الكمية الشهرية المتوقعة", "Expected monthly quantity"],
  "eg.notes": ["ملاحظات إضافية", "Extra notes"],
  "eg.submit": ["إرسال البيانات", "Send details"],
  "eg.sending": ["جاري الإرسال...", "Sending..."],
  "eg.success": [
    "استلمنا بياناتك، هنتواصل معاك قريب جدًا.",
    "We received your details and will contact you very soon.",
  ],
  "eg.error": [
    "حصلت مشكلة في الإرسال، جرّب تاني أو كلمنا على واتساب.",
    "Something went wrong. Please try again or message us on WhatsApp.",
  ],
  "eg.required": [
    "من فضلك اكتب الاسم ورقم الموبايل.",
    "Please enter your name and mobile number.",
  ],
  "eg.exportNote": [
    "بتصدر برة مصر؟ روح لصفحة التصدير الخارجي.",
    "Exporting outside Egypt? Visit the export page.",
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
  "contact.mapTitle": ["مكان المكتب على الخريطة", "Our location on the map"],
  "contact.mapQuery": [
    "16 شارع جمال عبد الناصر، حدائق حلوان، القاهرة",
    "16 Gamal Abdel Nasser St, Hadayek Helwan, Cairo",
  ],

  "social.title": ["تابعنا على", "Follow us"],




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

/** All editable site texts with their default Arabic / English values. */
export const textDefaults = dict as Record<string, Entry>;
export const textKeys = Object.keys(dict) as TKey[];

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
