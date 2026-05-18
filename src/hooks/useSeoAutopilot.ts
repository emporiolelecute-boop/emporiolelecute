import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AutopilotAction {
  kind: "regen_sitemap" | "resubmit_sitemap" | "template_repair" | "log_issue";
  reason: string;
  related_finding_ids: string[];
  remediation?: string;
  classification?: "needs_code_fix" | "needs_content" | "needs_data" | "infrastructure";
  ok?: boolean;
  detail?: string;
  duration_ms?: number;
}

export interface AutopilotRun {
  id: string;
  ran_at: string;
  total: number;
  passed: number;
  errors: number;
  warnings: number;
  checks: {
    mode: "dry_run" | "execute";
    control_plane_run_id: string;
    plan: AutopilotAction[];
    executed: AutopilotAction[];
    skipped: Array<{ reason: string; finding_ids: string[] }>;
    failed: AutopilotAction[];
    validation: any;
    summary_before: { errors: number; warnings: number };
    summary_after: { errors: number; warnings: number } | null;
  };
}

export function useSeoAutopilot() {
  const [runs, setRuns] = useState<AutopilotRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("seo_check_runs")
      .select("id, ran_at, total, passed, errors, warnings, checks")
      .eq("source", "autopilot")
      .order("ran_at", { ascending: false })
      .limit(10);
    if (error) setError(error.message);
    else setRuns((data as any) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const run = useCallback(async (mode: "dry_run" | "execute") => {
    setBusy(true); setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("seo-autopilot", { body: { mode } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).message || (data as any).error);
      setLastResponse(data);
      await load();
      return data;
    } catch (e: any) {
      setError(e.message || String(e));
      throw e;
    } finally {
      setBusy(false);
    }
  }, [load]);

  return { runs, loading, busy, error, lastResponse, plan: () => run("dry_run"), execute: () => run("execute"), reload: load };
}
