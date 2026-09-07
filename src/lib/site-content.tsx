import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  categories as staticCategories,
  sections as staticSections,
} from "@/lib/data";
import { imageFallback } from "@/lib/site-assets";

export interface SiteSection {
  id: string;
  name: string;
  nameEn: string;
  sortOrder: number;
}

export interface SiteCategory {
  id: string;
  sectionId: string;
  name: string;
  nameEn: string;
  sortOrder: number;
}

export interface SiteContentValue {
  content: Record<string, { ar: string; en: string }>;
  images: Record<string, string>;
  sections: SiteSection[];
  categories: SiteCategory[];
  loaded: boolean;
  reload: () => Promise<void>;
}

const fallbackSections: SiteSection[] = staticSections.map((s, i) => ({
  id: s.id,
  name: s.name,
  nameEn: s.nameEn,
  sortOrder: i,
}));

const fallbackCategories: SiteCategory[] = staticCategories.map((c, i) => ({
  id: c.id,
  sectionId: c.sectionId,
  name: c.name,
  nameEn: c.nameEn,
  sortOrder: i,
}));

const defaultValue: SiteContentValue = {
  content: {},
  images: {},
  sections: fallbackSections,
  categories: fallbackCategories,
  loaded: false,
  reload: async () => {},
};

const SiteContentContext = createContext<SiteContentValue>(defaultValue);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<SiteContentValue, "reload">>({
    content: {},
    images: {},
    sections: fallbackSections,
    categories: fallbackCategories,
    loaded: false,
  });

  const reload = useCallback(async () => {
    try {
      const [contentRes, imagesRes, sectionsRes, categoriesRes] = await Promise.all([
        supabase.from("site_content").select("*"),
        supabase.from("site_images").select("*"),
        supabase.from("site_sections").select("*").order("sort_order"),
        supabase.from("site_categories").select("*").order("sort_order"),
      ]);

      const content: Record<string, { ar: string; en: string }> = {};
      for (const row of contentRes.data ?? []) {
        content[row.key] = { ar: row.value_ar, en: row.value_en };
      }
      const images: Record<string, string> = {};
      for (const row of imagesRes.data ?? []) images[row.key] = row.url;

      const dbSections = (sectionsRes.data ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        nameEn: s.name_en || s.name,
        sortOrder: s.sort_order,
      }));
      const dbCategories = (categoriesRes.data ?? []).map((c) => ({
        id: c.id,
        sectionId: c.section_id,
        name: c.name,
        nameEn: c.name_en || c.name,
        sortOrder: c.sort_order,
      }));

      setState({
        content,
        images,
        sections: dbSections.length ? dbSections : fallbackSections,
        categories: dbCategories.length ? dbCategories : fallbackCategories,
        loaded: true,
      });
    } catch {
      setState((s) => ({ ...s, loaded: true }));
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo<SiteContentValue>(() => ({ ...state, reload }), [state, reload]);

  return (
    <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export function useSiteImage(key: string) {
  const { images } = useSiteContent();
  return images[key] ?? imageFallback(key);
}

export function useTaxonomy() {
  const { sections, categories } = useSiteContent();
  return { sections, categories };
}
