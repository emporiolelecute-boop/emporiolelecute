import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ExecutiveSummaryMetrics {
  convergence: number;
  trust: number;
  stability: number;
  coherence: number;
  drift: number;
  integrity: number;
  verdict: string;
}

export default function ExecutiveConvergenceSummary({ metrics }: { metrics: ExecutiveSummaryMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Executive Convergence Summary <Badge>{metrics.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
          <Tile label="Convergence" value={metrics.convergence} />
          <Tile label="Trust" value={metrics.trust} />
          <Tile label="Stability" value={metrics.stability} />
          <Tile label="Coherence" value={metrics.coherence} />
          <Tile label="Drift" value={metrics.drift} />
          <Tile label="Integrity" value={metrics.integrity} />
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
