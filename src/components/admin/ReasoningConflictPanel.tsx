import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ReasoningConflict } from "@/lib/conflictResolution";

const tone: Record<ReasoningConflict["severity"], string> = {
  critical: "bg-red-500/15 text-red-700",
  high: "bg-orange-500/15 text-orange-700",
  medium: "bg-amber-500/15 text-amber-700",
  low: "bg-muted text-foreground",
};

export default function ReasoningConflictPanel({ conflicts }: { conflicts: ReasoningConflict[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Conflitos de Raciocínio</CardTitle></CardHeader>
      <CardContent className="text-sm">
        {conflicts.length === 0 ? (
          <p className="text-muted-foreground">Sem conflitos detectados.</p>
        ) : (
          <ul className="space-y-2">
            {conflicts.map((c, i) => (
              <li key={i} className="flex items-start justify-between gap-2 border-b pb-2 last:border-b-0">
                <div>
                  <div className="font-medium">{c.layerA} ↔ {c.layerB}</div>
                  <div className="text-xs text-muted-foreground">{c.description}</div>
                </div>
                <Badge className={tone[c.severity]} variant="outline">{c.severity}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
