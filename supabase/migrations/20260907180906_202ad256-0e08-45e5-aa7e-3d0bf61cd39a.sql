CREATE TABLE public.merchant_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  store_name text NOT NULL DEFAULT '',
  phone text NOT NULL,
  governorate text NOT NULL DEFAULT '',
  business_type text NOT NULL DEFAULT '',
  interests text NOT NULL DEFAULT '',
  monthly_volume text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.merchant_requests TO anon;
GRANT INSERT, SELECT ON public.merchant_requests TO authenticated;
GRANT ALL ON public.merchant_requests TO service_role;

ALTER TABLE public.merchant_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit merchant request"
  ON public.merchant_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins read merchant requests"
  ON public.merchant_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_merchant_requests_updated_at
  BEFORE UPDATE ON public.merchant_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();