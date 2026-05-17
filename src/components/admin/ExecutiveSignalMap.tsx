import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExecutiveSignal } from "@/lib/metricCompression";

export default function ExecutiveSignalMap({ signals }: { signals: ExecutiveSignal[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Executive Signal Map</CardTitle></CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2">
          {signals.map((s) => (
            <div key={s.key} className="border rounded p-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{s.label}</span>
                <span>{s.value}/100</span>
              </div>
              <div className="h-2 bg-muted rounded mt-2 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${s.value}%` }} />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Confidence {s.confidence}% · {s.composition.length} sources
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
