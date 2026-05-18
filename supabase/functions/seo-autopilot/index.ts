// SEO Autopilot — execution core.
// Consumes findings from latest control_plane run and applies safe corrective
// actions. Dry-run by default. Persists report to seo_check_runs source='autopilot'.
//
// Endpoint: POST /seo-autopilot  body: { mode: 'dry_run' | 'execute' }
// Admin-only (JWT enforced in-code).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const COOLDOWN_MIN = 30;
const MAX_ACTIONS = 10;
const MAX_AGE_HOURS = 24;

type Severity = "critical" | "warning" | "ok";
type Impact = "indexation" | "social_preview" | "data_integrity";
type ActionKind =
  | "regen_sitemap"
  | "resubmit_sitemap"
  | "template_repair"
  | "log_issue";

interface Finding {
  id: string;
  severity: Severity;
  impact: Impact;
  category: string;
  message: string;
  url?: string;
  evidence?: string;
}

interface PlannedAction {
  kind: ActionKind;
  reason: string;
  related_finding_ids: string[];
  remediation?: string; // human-readable guidance for log_issue/template_repair
  classification?: "needs_code_fix" | "needs_content" | "needs_data" | "infrastructure";
}

interface ExecutedAction extends PlannedAction {
  ok: boolean;
  detail?: string;
  duration_ms: number;
}

async function callEdge(name: string, body: any = {}, authHeader?: string) {
  const url = `${SUPABASE_URL}/functions/v1/${name}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader || `Bearer ${ANON_KEY}`,
        apikey: ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const text = await res.text();
    let parsed: any;
    try { parsed = JSON.parse(text); } catch { parsed = text; }
    return { ok: res.ok, status: res.status, body: parsed };
  } finally {
    clearTimeout(t);
  }
}

function classifyTemplateRepair(f: Finding, productHasImages: Map<string, boolean>): PlannedAction | null {
  // Findings that look like prerender output gaps. We don't rewrite HTML
  // at runtime; we classify whether it's a code bug or missing data and
  // produce actionable remediation.
  if (!f.url) return null;

  if (f.id.startsWith("html:og:")) {
    const slug = f.url.startsWith("/produto/") ? f.url.replace("/produto/", "") : null;
    if (slug && productHasImages.has(slug)) {
      const hasImg = productHasImages.get(slug);
      return {
        kind: "template_repair",
        reason: `OG image ausente em ${f.url}`,
        related_finding_ids: [f.id],
        classification: hasImg ? "needs_code_fix" : "needs_content",
        remediation: hasImg
          ? "Produto tem imagens no DB mas prerender não emitiu og:image — verificar supabase/functions/prerender/index.ts (mapeamento images[0])."
          : `Produto ${slug} não tem imagens cadastradas. Subir imagem no admin para preview social funcionar.`,
      };
    }
    return {
      kind: "template_repair",
      reason: `OG image ausente em ${f.url}`,
      related_finding_ids: [f.id],
      classification: "needs_code_fix",
      remediation: "Verificar geração de og:image no prerender para esta rota.",
    };
  }

  if (f.id.startsWith("html:jsonld:") || f.id.startsWith("html:canonical:")) {
    return {
      kind: "template_repair",
      reason: f.message + ` (${f.url})`,
      related_finding_ids: [f.id],
      classification: "needs_code_fix",
      remediation: "Bug de prerender: regenerar handler para esta rota em supabase/functions/prerender/index.ts.",
    };
  }

  if (f.id.startsWith("html:title:") || f.id.startsWith("html:desc:")) {
    return {
      kind: "template_repair",
      reason: f.message + ` (${f.url})`,
      related_finding_ids: [f.id],
      classification: "needs_code_fix",
      remediation: "Title/description não emitidos pelo prerender — falha crítica de SEO, corrigir no edge function.",
    };
  }

  if (f.id.startsWith("html:noindex:")) {
    return {
      kind: "template_repair",
      reason: f.message + ` (${f.url})`,
      related_finding_ids: [f.id],
      classification: "needs_code_fix",
      remediation: "Soft-404: prerender deve emitir noindex,follow para rotas desconhecidas (já implementado, verificar regressão).",
    };
  }

  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");

  // --- Auth admin -----------------------------------------------------------
  try {
    if (!authHeader) throw new Error("missing auth");
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) throw new Error("unauthorized");
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id, _role: "admin",
    });
    if (!isAdmin) throw new Error("forbidden");
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message) }), {
      status: 401, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body: { mode?: "dry_run" | "execute" } = {};
  try { body = await req.json(); } catch { /* default */ }
  const mode = body.mode === "execute" ? "execute" : "dry_run";

  // --- Cooldown -------------------------------------------------------------
  if (mode === "execute") {
    const since = new Date(Date.now() - COOLDOWN_MIN * 60_000).toISOString();
    const { data: recent } = await admin
      .from("seo_check_runs")
      .select("id, ran_at, checks")
      .eq("source", "autopilot")
      .gte("ran_at", since)
      .limit(1);
    const recentExecute = (recent || []).find((r: any) => r.checks?.mode === "execute");
    if (recentExecute) {
      return new Response(JSON.stringify({
        error: "cooldown",
        message: `Última execução em ${recentExecute.ran_at}. Aguarde ${COOLDOWN_MIN} min entre execuções.`,
      }), { status: 429, headers: { ...cors, "Content-Type": "application/json" } });
    }
  }

  // --- Load latest control_plane run ---------------------------------------
  const maxAgeISO = new Date(Date.now() - MAX_AGE_HOURS * 3600_000).toISOString();
  const { data: cpRuns, error: cpErr } = await admin
    .from("seo_check_runs")
    .select("id, ran_at, errors, warnings, checks")
    .eq("source", "control_plane")
    .gte("ran_at", maxAgeISO)
    .order("ran_at", { ascending: false })
    .limit(1);

  if (cpErr || !cpRuns?.length) {
    return new Response(JSON.stringify({
      error: "no_control_plane_run",
      message: `Nenhuma run de control_plane nas últimas ${MAX_AGE_HOURS}h. Rode o Control Plane primeiro.`,
    }), { status: 412, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const cpRun = cpRuns[0] as any;
  const findings: Finding[] = cpRun.checks?.findings || [];
  const before = { errors: cpRun.errors, warnings: cpRun.warnings, run_id: cpRun.id };

  // --- Sort: indexation critical → data_integrity → social_preview ---------
  const impactRank: Record<Impact, number> = {
    indexation: 0, data_integrity: 1, social_preview: 2,
  };
  const sevRank: Record<Severity, number> = { critical: 0, warning: 1, ok: 2 };
  const sorted = [...findings].sort((a, b) =>
    sevRank[a.severity] - sevRank[b.severity] ||
    impactRank[a.impact] - impactRank[b.impact],
  );

  // --- Fetch product image presence for template_repair classification -----
  const productSlugs = new Set<string>();
  for (const f of sorted) {
    if (f.url?.startsWith("/produto/")) {
      productSlugs.add(f.url.replace("/produto/", ""));
    }
  }
  const productHasImages = new Map<string, boolean>();
  if (productSlugs.size) {
    const { data: prods } = await admin
      .from("products")
      .select("slug, images")
      .in("slug", Array.from(productSlugs));
    prods?.forEach((p: any) => {
      productHasImages.set(p.slug, Array.isArray(p.images) && p.images.length > 0);
    });
  }

  // --- Plan -----------------------------------------------------------------
  const plan: PlannedAction[] = [];
  const skipped: Array<{ reason: string; finding_ids: string[] }> = [];

  const sitemapFindings = sorted.filter((f) =>
    f.id.startsWith("diff:missing_in_sitemap") ||
    f.id.startsWith("diff:orphan_in_sitemap") ||
    f.id === "sitemap:fetch_failed",
  );
  if (sitemapFindings.length) {
    plan.push({
      kind: "regen_sitemap",
      reason: `${sitemapFindings.length} drift(s) DB↔sitemap detectado(s)`,
      related_finding_ids: sitemapFindings.map((f) => f.id),
      classification: "infrastructure",
    });
    plan.push({
      kind: "resubmit_sitemap",
      reason: "Notificar buscadores após regen",
      related_finding_ids: [],
      classification: "infrastructure",
    });
  }

  // Template repair classification (no HTML rewrite — produces remediation)
  for (const f of sorted) {
    if (plan.length >= MAX_ACTIONS) break;
    const repair = classifyTemplateRepair(f, productHasImages);
    if (repair) {
      plan.push(repair);
    }
  }

  // log_issue for remaining un-actioned findings (prerender errors, diff:no_prerender, etc.)
  const handledIds = new Set(plan.flatMap((p) => p.related_finding_ids));
  for (const f of sorted) {
    if (handledIds.has(f.id)) continue;
    if (f.severity === "ok") continue;
    if (plan.length >= MAX_ACTIONS) {
      skipped.push({ reason: "max actions reached", finding_ids: [f.id] });
      continue;
    }
    plan.push({
      kind: "log_issue",
      reason: f.message,
      related_finding_ids: [f.id],
      classification: f.id.startsWith("bot:") ? "needs_code_fix" : "needs_data",
      remediation: f.url ? `Investigar manualmente: ${f.url}` : "Investigar manualmente.",
    });
  }

  // --- Execute (or dry-run) -------------------------------------------------
  const executed: ExecutedAction[] = [];
  const failed: ExecutedAction[] = [];

  if (mode === "execute") {
    for (const action of plan) {
      if (action.kind === "regen_sitemap") {
        const t0 = Date.now();
        try {
          const r = await callEdge("generate-sitemap", {}, authHeader!);
          const ea: ExecutedAction = {
            ...action, ok: r.ok,
            detail: r.ok ? `HTTP ${r.status}` : JSON.stringify(r.body).slice(0, 300),
            duration_ms: Date.now() - t0,
          };
          (r.ok ? executed : failed).push(ea);
        } catch (e) {
          failed.push({ ...action, ok: false, detail: String((e as Error).message), duration_ms: Date.now() - t0 });
        }
      } else if (action.kind === "resubmit_sitemap") {
        const t0 = Date.now();
        try {
          const r = await callEdge("seo-sitemap-auto-resubmit", {}, authHeader!);
          const ea: ExecutedAction = {
            ...action, ok: r.ok,
            detail: r.ok ? `HTTP ${r.status}` : JSON.stringify(r.body).slice(0, 300),
            duration_ms: Date.now() - t0,
          };
          (r.ok ? executed : failed).push(ea);
        } catch (e) {
          failed.push({ ...action, ok: false, detail: String((e as Error).message), duration_ms: Date.now() - t0 });
        }
      } else {
        // template_repair and log_issue are diagnostic — no side effects
        executed.push({ ...action, ok: true, detail: "diagnostic only", duration_ms: 0 });
      }
    }
  }

  // --- Post-fix validation (only if we actually executed infra fixes) ------
  let validation: any = { skipped: true, reason: "dry-run" };
  let after: any = null;
  if (mode === "execute" && executed.some((e) => e.kind === "regen_sitemap" && e.ok)) {
    try {
      const v = await callEdge("seo-control-plane", {}, authHeader!);
      if (v.ok && typeof v.body === "object" && v.body?.summary) {
        after = { errors: v.body.summary.errors, warnings: v.body.summary.warnings, run_id: v.body.id };
        validation = {
          skipped: false,
          before, after,
          regression: after.errors > before.errors,
          improved: after.errors < before.errors || after.warnings < before.warnings,
        };
      } else {
        validation = { skipped: false, error: "control_plane re-run failed", detail: v.body };
      }
    } catch (e) {
      validation = { skipped: false, error: String((e as Error).message) };
    }
  } else if (mode === "execute") {
    validation = { skipped: true, reason: "no infra fix executed" };
  }

  // --- Tally & persist ------------------------------------------------------
  const errors = failed.length;
  const warnings = skipped.length;
  const total = plan.length;
  const passed = executed.length;

  const checksPayload = {
    mode,
    control_plane_run_id: before.run_id,
    plan,
    executed,
    skipped,
    failed,
    validation,
    summary_before: before,
    summary_after: after,
  };

  const { data: runRow, error: insErr } = await admin
    .from("seo_check_runs")
    .insert({
      source: "autopilot",
      total, passed, errors, warnings,
      checks: checksPayload,
    })
    .select("id, ran_at")
    .single();

  if (insErr) {
    return new Response(JSON.stringify({ error: insErr.message, partial: checksPayload }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({
    id: runRow!.id,
    ran_at: runRow!.ran_at,
    mode,
    plan,
    executed,
    skipped,
    failed,
    validation,
  }), { headers: { ...cors, "Content-Type": "application/json" } });
});
