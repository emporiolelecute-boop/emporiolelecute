import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PriorityConflict, ResourceConflict, ConflictResolution } from "@/lib/executionConflictEngine";

export default function ExecutionConflictMatrix({
  priorityConflicts, resourceConflicts, suggestions, collision, cannibalization,
}: {
  priorityConflicts: PriorityConflict[];
  resourceConflicts: ResourceConflict[];
  suggestions: ConflictResolution[];
  collision: number;
  cannibalization: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle>Execution Conflicts</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Strategic collision" v={collision} />
          <Stat label="Queue cannibalization" v={cannibalization} />
        </div>
        <Section title={`Priority conflicts (${priorityConflicts.length})`}>
          {priorityConflicts.map((c, i) => (
            <li key={i} className="text-xs border rounded p-1.5">
              <strong>{c.a}</strong> ↔ <strong>{c.b}</strong> — <span className="text-muted-foreground">{c.reason}</span>
            </li>
          ))}
        </Section>
        <Section title={`Resource conflicts (${resourceConflicts.length})`}>
          {resourceConflicts.map((r) => (
            <li key={r.origin} className="text-xs border rounded p-1.5">
              <div className="flex justify-between"><strong>{r.origin}</strong><span>load {r.load}</span></div>
              <div className="text-muted-foreground">{r.items.join(", ")}</div>
            </li>
          ))}
        </Section>
        <Section title={`Resolution suggestions (${suggestions.length})`}>
          {suggestions.map((s, i) => (
            <li key={i} className="text-xs border rounded p-1.5">
              <div className="font-medium">{s.conflict}</div>
              <div className="text-muted-foreground">{s.suggestion}</div>
            </li>
          ))}
        </Section>
      </CardContent>
    </Card>
  );
}
function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}<span className="text-xs text-muted-foreground">/100</span></div>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-medium mb-1">{title}</div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}
