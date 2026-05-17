import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { ContinuityProjectionPoint } from "@/lib/resilienceContinuity";

export default function ResilienceContinuityGauge({
  score, verdict, cohesion, durability, fatigue, projection,
}: {
  score: number; verdict: string; cohesion: number; durability: number; fatigue: number;
  projection: ContinuityProjectionPoint[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Resilience Continuity <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <Row label="Cohesion" value={cohesion} />
        <Row label="Durability" value={durability} />
        <Row label="Fatigue" value={fatigue} />
        <div>
          <div className="font-medium mb-1">Projection</div>
          <ul className="grid grid-cols-4 gap-2 text-xs">
            {projection.map((f) => (
              <li key={f.horizon} className="rounded border p-2 text-center">
                <div className="text-muted-foreground">{f.horizon}</div>
                <div className="font-semibold">{f.projected}</div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1"><span>{label}</span><span>{value}</span></div>
      <Progress value={value} />
    </div>
  );
}
