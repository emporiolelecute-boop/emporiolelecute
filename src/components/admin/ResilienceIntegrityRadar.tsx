import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResilienceIntegrityMap, ResilienceVerdict } from "@/lib/resilienceIntegrity";

export default function ResilienceIntegrityRadar({
  score, verdict, map, adaptive, instability,
}: {
  score: number; verdict: ResilienceVerdict; map: ResilienceIntegrityMap;
  adaptive: number; instability: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Resilience Integrity <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Adaptive integrity: <span className="font-medium">{adaptive}/100</span></div>
          <div>Recovery instability: <span className="font-medium">{instability}/100</span></div>
          <div>Strongest: <span className="font-medium">{map.strongest}</span></div>
          <div>Weakest: <span className="font-medium">{map.weakest}</span></div>
        </div>
        <div className="space-y-1">
          {map.axes.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <div className="w-40 text-xs text-muted-foreground">{a.name}</div>
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${a.value}%` }} />
              </div>
              <div className="w-12 text-right text-xs">{a.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
