DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND 'public' = ANY (roles::text[])
      AND (
        coalesce(qual, '') ILIKE '%has_role%'
        OR coalesce(with_check, '') ILIKE '%has_role%'
      )
  LOOP
    EXECUTE format('ALTER POLICY %I ON %I.%I TO authenticated', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END $$;