-- Store one image per color for catalog products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS color_images jsonb NOT NULL DEFAULT '{}'::jsonb;
