
-- Ordenação leve nas taxonomias
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS position integer NOT NULL DEFAULT 0;
ALTER TABLE public.occasions  ADD COLUMN IF NOT EXISTS position integer NOT NULL DEFAULT 0;
ALTER TABLE public.tags       ADD COLUMN IF NOT EXISTS position integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_categories_position ON public.categories(position);
CREATE INDEX IF NOT EXISTS idx_occasions_position  ON public.occasions(position);
CREATE INDEX IF NOT EXISTS idx_tags_position       ON public.tags(position);

-- Validação: produto deve ter category_id ao ser salvo (insert/update)
CREATE OR REPLACE FUNCTION public.enforce_product_category()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.category_id IS NULL THEN
    RAISE EXCEPTION 'Produto precisa ter uma categoria (category_id) definida.'
      USING ERRCODE = '23502';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_product_category ON public.products;
CREATE TRIGGER trg_enforce_product_category
BEFORE INSERT OR UPDATE OF category_id ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.enforce_product_category();
