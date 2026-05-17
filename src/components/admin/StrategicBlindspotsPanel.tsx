import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlindspotSignal } from "@/lib/metaIntelligenceEngine";

interface Props { blindspots: BlindspotSignal[]; }
export default function StrategicBlindspotsPanel({ blindspots }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Blindspots</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {blindspots.length === 0 && (
          <p className="text-muted-foreground">Nenhum blindspot detectado.</p>
        )}
        {blindspots.map((b, i) => (
          <div key={i} className="flex items-start gap-2">
            <Badge variant={b.severity === "high" ? "destructive" : "outline"}>{b.severity}</Badge>
            <div>
              <p className="font-medium">{b.key}</p>
              <p className="text-muted-foreground">{b.note}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
