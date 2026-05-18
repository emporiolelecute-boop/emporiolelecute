REVOKE EXECUTE ON FUNCTION public.pdp_funnel_stats(timestamptz, timestamptz) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.pdp_funnel_stats(timestamptz, timestamptz) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_pdp_funnel_events() FROM PUBLIC, anon, authenticated;