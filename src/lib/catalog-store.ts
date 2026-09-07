import { supabase } from "@/integrations/supabase/client";
import { categories, products as staticProducts, sections, type Product } from "@/lib/data";

export type CatalogProduct = Product & { dbId?: string };

export function categoryLabel(categoryId: string): string {
  const c = categories.find((x) => x.id === categoryId);
  if (!c) return categoryId;
  const s = sections.find((x) => x.id === c.sectionId);
  return s ? `${s.name} - ${c.name}` : c.name;
}

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 5;

export async function signedImageUrl(path: string) {
  const { data, error } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (error) throw error;
  return data.signedUrl;
}

export async function fetchCatalog(): Promise<CatalogProduct[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const isSignedIn = Boolean(sessionData.session);

  const [{ data: rows }, hiddenRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    // hidden_products is admin-only; anonymous visitors simply get no rows.
    isSignedIn
      ? supabase.from("hidden_products").select("code")
      : Promise.resolve({ data: [] as { code: string }[] }),
  ]);

  const hiddenCodes = new Set((hiddenRes.data ?? []).map((h) => h.code));

  const added: CatalogProduct[] = (rows ?? []).map((r) => ({
    dbId: r.id,
    code: r.code,
    name: r.name,
    nameEn: r.name_en || r.name,
    categoryId: r.category_id,
    category: categoryLabel(r.category_id),
    colors: r.colors ?? [],
    sizes: r.sizes ?? [],
    image: r.image_url,
    isNew: r.is_new,
  }));

  return [...added, ...staticProducts].filter((p) => !hiddenCodes.has(p.code));
}

export async function fetchHiddenCodes(): Promise<string[]> {
  const { data } = await supabase.from("hidden_products").select("code");
  return (data ?? []).map((h) => h.code);
}
