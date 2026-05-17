import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExecutionCycle } from "@/lib/executionOrchestrator";

export default function ExecutionCadenceCard({ cycles }: { cycles: ExecutionCycle[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Execution Cadence</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        {cycles.map((c) => (
          <div key={c.label}>
            <div className="flex justify-between font-medium mb-1">
              <span>{c.label}</span>
              <Badge variant="secondary">{c.items.length}</Badge>
            </div>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {c.items.slice(0, 6).map((i) => (
                <li key={i.metric}>{i.metric} — {i.classification}</li>
              ))}
              {c.items.length > 6 && <li className="italic">+{c.items.length - 6} more…</li>}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
