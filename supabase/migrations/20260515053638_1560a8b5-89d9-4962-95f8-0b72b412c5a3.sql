CREATE OR REPLACE FUNCTION public.notify_admins_on_access_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_url  text;
  v_anon text;
BEGIN
  -- Only fire on transitions false -> true (or null -> true)
  IF NEW.access_requested IS DISTINCT FROM true THEN
    RETURN NEW;
  END IF;
  IF OLD.access_requested IS NOT DISTINCT FROM NEW.access_requested THEN
    RETURN NEW;
  END IF;

  BEGIN
    v_url  := current_setting('app.supabase_url', true);
    v_anon := current_setting('app.supabase_anon_key', true);
    IF v_url IS NOT NULL AND v_anon IS NOT NULL THEN
      PERFORM net.http_post(
        url     := v_url || '/functions/v1/notify-admins-new-request',
        headers := jsonb_build_object(
          'Content-Type','application/json',
          'Authorization','Bearer ' || v_anon
        ),
        body    := jsonb_build_object(
          'user_id',      NEW.id,
          'email',        NEW.email,
          'requested_at', NEW.access_requested_at
        )
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Best-effort: never block the request because notification failed
    NULL;
  END;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.notify_admins_on_access_request() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_notify_admins_on_access_request ON public.profiles;
CREATE TRIGGER trg_notify_admins_on_access_request
AFTER UPDATE OF access_requested ON public.profiles
FOR EACH ROW
WHEN (NEW.access_requested = true AND OLD.access_requested IS DISTINCT FROM true)
EXECUTE FUNCTION public.notify_admins_on_access_request();