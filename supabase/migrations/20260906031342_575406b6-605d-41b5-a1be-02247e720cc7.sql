DROP POLICY "hidden public read" ON public.hidden_products;

CREATE POLICY "admins read hidden"
ON public.hidden_products
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));