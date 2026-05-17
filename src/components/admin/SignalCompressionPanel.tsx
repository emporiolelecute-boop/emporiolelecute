import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompressedSignalMap } from "@/lib/metricCompression";

export default function SignalCompressionPanel({ map }: { map: CompressedSignalMap }) {
  const pct = Math.round(map.compression_ratio * 100);
  return (
    <Card>
      <CardHeader><CardTitle>Signal Compression</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="flex items-baseline gap-3">
          <div className="text-3xl font-semibold">{pct}%</div>
          <p className="text-muted-foreground">
            {map.compressed_signal_count} executive signals from {map.raw_metric_count} raw metrics.
          </p>
        </div>
        <ul className="text-xs space-y-1">
          {map.signals.map((s) => (
            <li key={s.key} className="border rounded p-2">
              <div className="flex justify-between font-medium">
                <span>{s.label}</span>
                <span>{s.value}/100 · conf {s.confidence}%</span>
              </div>
              <div className="text-muted-foreground">from: {s.composition.join(", ") || "—"}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
