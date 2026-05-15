import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();
  const checks: Record<string, { ok: boolean; ms?: number; error?: string }> = {};

  // Database check
  try {
    const t = Date.now();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await supabase.from("products").select("id", { count: "exact", head: true }).limit(1);
    if (error) throw error;
    checks.database = { ok: true, ms: Date.now() - t };
  } catch (e) {
    checks.database = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  const allOk = Object.values(checks).every((c) => c.ok);
  const body = {
    status: allOk ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptime_ms: Date.now() - startedAt,
    version: Deno.env.get("DEPLOY_VERSION") ?? "unknown",
    checks,
  };

  return new Response(JSON.stringify(body), {
    status: allOk ? 200 : 503,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
});
