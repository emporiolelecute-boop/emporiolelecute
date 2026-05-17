import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface CoherenceExecutiveMetrics {
  coherence: number;
  alignment: number;
  cognition: number;
  continuity: number;
  resilience: number;
  persistence: number;
  verdict: string;
}

export default function CoherenceExecutiveSummary({ metrics }: { metrics: CoherenceExecutiveMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Executive Summary <Badge>{metrics.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
          <Stat label="Coherence" v={metrics.coherence} />
          <Stat label="Alignment" v={metrics.alignment} />
          <Stat label="Cognition" v={metrics.cognition} />
          <Stat label="Continuity" v={metrics.continuity} />
          <Stat label="Resilience" v={metrics.resilience} />
          <Stat label="Persistence" v={metrics.persistence} />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{v}<span className="text-sm text-muted-foreground">/100</span></div>
    </div>
  );
}
