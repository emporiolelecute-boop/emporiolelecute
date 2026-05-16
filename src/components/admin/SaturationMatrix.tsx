import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SaturationBucket } from "@/lib/saturationEngine";

export interface SaturationRow {
  cluster: string;
  bucket: SaturationBucket;
  score: number;
  reasons: string[];
}

const variantMap: Record<SaturationBucket, "default" | "secondary" | "destructive"> = {
  Untapped: "default",
  Growing: "default",
  Competitive: "secondary",
  Saturated: "destructive",
  Overloaded: "destructive",
};

export function SaturationMatrix({ rows }: { rows: SaturationRow[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Matriz de Saturação</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 && <p className="text-sm text-muted-foreground">Sem clusters analisados.</p>}
        {rows.map((r) => (
          <div key={r.cluster} className="flex items-center justify-between border-b py-2">
            <div>
              <p className="font-medium text-sm">{r.cluster}</p>
              {r.reasons.length > 0 && (
                <p className="text-xs text-muted-foreground">{r.reasons.join(" · ")}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">{r.score}</span>
              <Badge variant={variantMap[r.bucket]}>{r.bucket}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
