CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value_ar text NOT NULL DEFAULT '',
  value_en text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_content public read" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "site_content admin insert" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_content admin update" ON public.site_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_content admin delete" ON public.site_content FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.site_images (
  key text PRIMARY KEY,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_images TO authenticated;
GRANT ALL ON public.site_images TO service_role;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_images public read" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "site_images admin insert" ON public.site_images FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_images admin update" ON public.site_images FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_images admin delete" ON public.site_images FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.site_sections (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_en text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_sections TO authenticated;
GRANT ALL ON public.site_sections TO service_role;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_sections public read" ON public.site_sections FOR SELECT USING (true);
CREATE POLICY "site_sections admin insert" ON public.site_sections FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_sections admin update" ON public.site_sections FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_sections admin delete" ON public.site_sections FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.site_categories (
  id text PRIMARY KEY,
  section_id text NOT NULL,
  name text NOT NULL,
  name_en text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_categories TO authenticated;
GRANT ALL ON public.site_categories TO service_role;
ALTER TABLE public.site_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_categories public read" ON public.site_categories FOR SELECT USING (true);
CREATE POLICY "site_categories admin insert" ON public.site_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_categories admin update" ON public.site_categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "site_categories admin delete" ON public.site_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER site_images_updated BEFORE UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER site_sections_updated BEFORE UPDATE ON public.site_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER site_categories_updated BEFORE UPDATE ON public.site_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();