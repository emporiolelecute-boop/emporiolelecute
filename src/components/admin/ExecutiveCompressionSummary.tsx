import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CompressionSummaryMetrics {
  canon_score: number;
  compression_ratio: number;
  signal_to_noise: number;
  observability_efficiency: number;
  decision_confidence: number;
  artificial_complexity: number;
  redundant_count: number;
  core_count: number;
}

export default function ExecutiveCompressionSummary({ m }: { m: CompressionSummaryMetrics }) {
  return (
    <Card>
      <CardHeader><CardTitle>Executive Compression Summary</CardTitle></CardHeader>
      <CardContent className="text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Stat label="Canon health" v={m.canon_score} />
          <Stat label="Compression ratio" v={Math.round(m.compression_ratio * 100)} />
          <Stat label="Signal-to-noise" v={m.signal_to_noise} />
          <Stat label="Observability efficiency" v={m.observability_efficiency} />
          <Stat label="Decision confidence" v={m.decision_confidence} />
          <Stat label="Artificial complexity" v={m.artificial_complexity} />
          <Stat label="CORE metrics" v={m.core_count} raw />
          <Stat label="REDUNDANT metrics" v={m.redundant_count} raw />
        </div>
      </CardContent>
    </Card>
  );
}
function Stat({ label, v, raw }: { label: string; v: number; raw?: boolean }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}{!raw && <span className="text-xs text-muted-foreground">/100</span>}</div>
    </div>
  );
}
