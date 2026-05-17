import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DuplicatedEngine, MirrorSystem, ConsolidationSuggestion } from "@/lib/systemicDeduplication";

export default function DeduplicationHeatmap({
  duplicates, mirrors, suggestions, maintenanceReduction,
}: {
  duplicates: DuplicatedEngine[];
  mirrors: MirrorSystem[];
  suggestions: ConsolidationSuggestion[];
  maintenanceReduction: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle>Systemic Deduplication</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-4">
        <div>
          <div className="text-xs text-muted-foreground">Estimated maintenance reduction</div>
          <div className="text-2xl font-semibold">{maintenanceReduction}<span className="text-sm text-muted-foreground">/100</span></div>
        </div>
        <div>
          <div className="font-medium mb-1">Engine clusters ({duplicates.length})</div>
          <ul className="space-y-1">
            {duplicates.map((d, i) => (
              <li key={i} className="border rounded p-2">
                <div className="flex justify-between"><span>{d.engines.join(" · ")}</span><span>{d.overlap}%</span></div>
                <div className="text-xs text-muted-foreground">{d.reason}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-medium mb-1">Mirror systems ({mirrors.length})</div>
          <ul className="space-y-1">
            {mirrors.map((m, i) => (
              <li key={i} className="text-xs flex justify-between border rounded p-1.5">
                <span>{m.a} ↔ {m.b}</span><span>{m.similarity}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-medium mb-1">Consolidation suggestions ({suggestions.length})</div>
          <ul className="space-y-1">
            {suggestions.map((s, i) => (
              <li key={i} className="border rounded p-2 text-xs">
                <div>Merge <strong>{s.merge.join(", ")}</strong> into <strong>{s.into}</strong></div>
                <div className="text-muted-foreground">Savings ~{s.savings}/100 · {s.rationale}</div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
