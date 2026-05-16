import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlindspotSignal } from "@/lib/metaIntelligenceEngine";

export default function StrategicBlindspotsPanel({ blindspots }: { blindspots: BlindspotSignal[] }) {
  return (
    <Card className="p-4 space-y-2">
      <h4 className="font-medium">Pontos Cegos Estratégicos</h4>
      {blindspots.length === 0 && <p className="text-xs text-muted-foreground">Nenhum ponto cego relevante.</p>}
      {blindspots.map((b) => (
        <div key={b.key} className="flex justify-between text-sm">
          <span>{b.note}</span>
          <Badge variant={b.severity === "high" ? "destructive" : b.severity === "medium" ? "secondary" : "outline"}>{b.severity}</Badge>
        </div>
      ))}
    </Card>
  );
}
