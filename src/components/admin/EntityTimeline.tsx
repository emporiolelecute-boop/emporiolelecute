/**
 * Fase 12 — Entity Timeline.
 * Mini-timeline assistiva mostrando evolução de métricas SEO.
 */
import { useQuery } from "@tanstack/react-query";
import { buildEntityTimeline, detectRegressionRisk, detectPositiveTrend } from "@/lib/seoMemory";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowRight, ArrowUp, AlertTriangle, TrendingUp } from "lucide-react";

interface Props {
  entityType: string;
  entityId: string;
  entityName?: string;
}

const METRICS: { key: string; label: string }[] = [
  { key: "authority_score", label: "Authority" },
  { key: "maturity_score", label: "Maturity" },
  { key: "readiness_score", label: "Readiness" },
  { key: "topical_coverage", label: "Cobertura" },
  { key: "internal_links_count", label: "Links" },
  { key: "reviews_count", label: "Reviews" },
  { key: "faq_count", label: "FAQs" },
];

function dir(delta: number) {
  if (delta > 0) return <ArrowUp className="w-3 h-3 text-emerald-600" />;
  if (delta < 0) return <ArrowDown className="w-3 h-3 text-red-600" />;
  return <ArrowRight className="w-3 h-3 text-muted-foreground" />;
}

export default function EntityTimeline({ entityType, entityId, entityName }: Props) {
  const { data: timeline = [], isLoading } = useQuery({
    queryKey: ["seo-entity-timeline", entityType, entityId],
    staleTime: 5 * 60 * 1000,
    queryFn: () => buildEntityTimeline(entityType, entityId, 30),
    enabled: !!entityId,
  });

  if (isLoading) {
    return <Card><CardContent className="p-4 text-sm text-muted-foreground">Carregando histórico…</CardContent></Card>;
  }
  if (!timeline.length) {
    return (
      <Card><CardContent className="p-4 text-sm text-muted-foreground">
        Nenhum snapshot registrado ainda{entityName ? ` para "${entityName}"` : ""}. Capture um snapshot no SEO Evolution Center.
      </CardContent></Card>
    );
  }

  const first = timeline[0];
  const last  = timeline[timeline.length - 1];
  const positive = detectPositiveTrend(timeline);
  const risk = detectRegressionRisk(timeline);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className="text-sm font-medium">{entityName || `${entityType}:${entityId}`}</p>
            <p className="text-xs text-muted-foreground">
              {timeline.length} snapshots · {new Date(first.snapshot_date).toLocaleDateString()} → {new Date(last.snapshot_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {positive && <Badge className="bg-emerald-600"><TrendingUp className="w-3 h-3 mr-1" />Tendência positiva</Badge>}
            {risk.risk !== "none" && (
              <Badge variant={risk.risk === "high" ? "destructive" : "secondary"}>
                <AlertTriangle className="w-3 h-3 mr-1" />{risk.risk}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {METRICS.map((m) => {
            const a = Number((first as any)[m.key] ?? 0);
            const b = Number((last as any)[m.key] ?? 0);
            const delta = b - a;
            return (
              <div key={m.key} className="border rounded-md p-2">
                <div className="text-[10px] uppercase text-muted-foreground">{m.label}</div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-sm font-medium">{b}</span>
                  <span className="flex items-center gap-1 text-xs">{dir(delta)} {delta > 0 ? `+${delta}` : delta}</span>
                </div>
              </div>
            );
          })}
        </div>

        {risk.reasons.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {risk.reasons.map((r, i) => <li key={i}>• {r}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
