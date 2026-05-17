import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface StabilityExecutiveMetrics {
  stability: number;
  integrity: number;
  equilibrium: number;
  resilience: number;
  degradation: number;
  continuity: number;
  verdict: string;
}

export default function StabilityExecutiveSummary({ metrics }: { metrics: StabilityExecutiveMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Stability Executive Summary <Badge>{metrics.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
          <Tile label="Stability" value={metrics.stability} />
          <Tile label="Integrity" value={metrics.integrity} />
          <Tile label="Equilibrium" value={metrics.equilibrium} />
          <Tile label="Resilience" value={metrics.resilience} />
          <Tile label="Degradation" value={metrics.degradation} />
          <Tile label="Continuity" value={metrics.continuity} />
        </div>
      </CardContent>
    </Card>
  );
}

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
