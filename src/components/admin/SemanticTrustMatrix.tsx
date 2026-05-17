import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrustHeatCell } from "@/lib/semanticTrustMatrix";

export default function SemanticTrustMatrix({
  score, confidence, leak, mismatch, heatmap, verdict,
}: { score: number; confidence: number; leak: number; mismatch: number; heatmap: TrustHeatCell[]; verdict: string; }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Semantic Trust Matrix <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-4 gap-3">
          <Metric label="Trust" value={score} />
          <Metric label="Confidence" value={confidence} />
          <Metric label="Leak" value={leak} />
          <Metric label="Mismatch" value={mismatch} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {heatmap.map((c) => (
            <div key={c.domain} className="rounded border p-2 text-xs">
              <div className="font-medium capitalize">{c.domain}</div>
              <div className="text-muted-foreground">trust {c.trust}</div>
              <div className="h-1.5 mt-1 bg-muted rounded">
                <div className="h-full bg-primary rounded" style={{ width: `${c.trust}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
