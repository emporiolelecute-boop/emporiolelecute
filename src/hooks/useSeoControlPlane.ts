import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ControlPlaneFinding {
  id: string;
  severity: "critical" | "warning" | "ok";
  impact: "indexation" | "social_preview" | "data_integrity";
  category: string;
  message: string;
  url?: string;
  evidence?: string;
}

export interface ControlPlaneRun {
  id: string;
  ran_at: string;
  total: number;
  passed: number;
  errors: number;
  warnings: number;
  checks: {
    run_timestamp: string;
    db_count: number;
    sitemap_count: number;
    bot_simulation_count: number;
    cache: { hits: number; total: number; samples: string[] };
    findings: ControlPlaneFinding[];
  };
}

export function useSeoControlPlane() {
  const [runs, setRuns] = useState<ControlPlaneRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("seo_check_runs")
      .select("id, ran_at, total, passed, errors, warnings, checks")
      .eq("source", "control_plane")
      .order("ran_at", { ascending: false })
      .limit(10);
    if (error) setError(error.message);
    else setRuns((data as any) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const runNow = useCallback(async () => {
    setRunning(true); setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("seo-control-plane", { body: {} });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      await load();
      return data;
    } catch (e: any) {
      setError(e.message || String(e));
      throw e;
    } finally {
      setRunning(false);
    }
  }, [load]);

  return { runs, loading, running, error, runNow, reload: load };
}
