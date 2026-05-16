/**
 * Fase 12 — Execution Memory.
 * Registro/leitura de ações humanas SEO/editoriais.
 */
import { supabase } from "@/integrations/supabase/client";

export type SeoActionType =
  | "faq_added" | "editorial_expanded" | "links_added"
  | "review_added" | "hub_approved" | "thin_fixed" | "other";

export interface ExecutionAction {
  entity_type: string;
  entity_id: string;
  entity_slug?: string;
  action_type: SeoActionType;
  description?: string;
  impact_score?: number;
  metadata?: Record<string, any>;
}

export interface ExecutionLogRow extends ExecutionAction {
  id: string;
  performed_by?: string | null;
  performed_by_email?: string | null;
  created_at: string;
}

export async function recordExecutionAction(action: ExecutionAction): Promise<{ id?: string; error?: string }> {
  const { data: userData } = await supabase.auth.getUser();
  const payload: any = {
    ...action,
    impact_score: action.impact_score ?? 0,
    performed_by: userData.user?.id ?? null,
    performed_by_email: userData.user?.email ?? null,
  };
  const { data, error } = await (supabase as any)
    .from("seo_execution_log")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { id: data?.id };
}

export async function buildExecutionHistory(entityType?: string, entityId?: string, limit = 100): Promise<ExecutionLogRow[]> {
  let q = (supabase as any).from("seo_execution_log").select("*").order("created_at", { ascending: false }).limit(limit);
  if (entityType) q = q.eq("entity_type", entityType);
  if (entityId)   q = q.eq("entity_id", entityId);
  const { data, error } = await q;
  if (error) return [];
  return (data || []) as ExecutionLogRow[];
}

export function measureExecutionImpact(rows: ExecutionLogRow[]) {
  const byType: Record<string, { count: number; impact: number }> = {};
  rows.forEach((r) => {
    const t = r.action_type;
    if (!byType[t]) byType[t] = { count: 0, impact: 0 };
    byType[t].count++;
    byType[t].impact += r.impact_score ?? 0;
  });
  return {
    total: rows.length,
    totalImpact: rows.reduce((a, r) => a + (r.impact_score ?? 0), 0),
    byType,
  };
}
