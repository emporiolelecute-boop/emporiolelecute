
-- Staging table for Elo7 review audit
CREATE TABLE public.review_import_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_batch_id uuid NOT NULL,
  feedback_id text NOT NULL UNIQUE,
  elo7_product_name text,
  elo7_product_slug text,
  elo7_image_url text,
  elo7_comment text,
  elo7_sentiment text,
  elo7_review_date timestamptz,
  elo7_buyer_name text,
  elo7_raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  suggested_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  suggested_product_name text,
  suggested_confidence numeric,
  suggested_method text,
  manual_status text NOT NULL DEFAULT 'pending'
    CHECK (manual_status IN ('pending','confirmed','doubtful','rejected','no_match')),
  manual_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  visual_notes text,
  reviewed_by uuid,
  reviewed_by_email text,
  reviewed_at timestamptz,
  imported_review_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_review_import_audit_status ON public.review_import_audit(manual_status);
CREATE INDEX idx_review_import_audit_batch ON public.review_import_audit(import_batch_id);
CREATE INDEX idx_review_import_audit_suggested ON public.review_import_audit(suggested_product_id);
CREATE INDEX idx_review_import_audit_manual ON public.review_import_audit(manual_product_id);

ALTER TABLE public.review_import_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read review_import_audit"
  ON public.review_import_audit FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert review_import_audit"
  ON public.review_import_audit FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update review_import_audit"
  ON public.review_import_audit FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete review_import_audit"
  ON public.review_import_audit FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_review_import_audit_updated
  BEFORE UPDATE ON public.review_import_audit
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Private bucket for Elo7 review images
INSERT INTO storage.buckets (id, name, public)
VALUES ('elo7-review-images', 'elo7-review-images', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins read elo7 review images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'elo7-review-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins write elo7 review images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'elo7-review-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update elo7 review images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'elo7-review-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete elo7 review images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'elo7-review-images' AND public.has_role(auth.uid(), 'admin'));
