import { Card } from "@/components/ui/card";
import type { HeatmapCell } from "@/lib/observabilityMatrix";

export default function ObservabilityCoverageMap({
  coverage, blindspots, heatmap,
}: { coverage: number; blindspots: string[]; heatmap: HeatmapCell[] }) {
  return (
    <Card className="p-4 space-y-3">
      <p className="text-base font-medium">Observability Coverage</p>
      <div className="flex items-baseline gap-4">
        <div className="text-4xl font-bold">{coverage}</div>
        <span className="text-xs text-muted-foreground">cobertura</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {heatmap.map((c) => (
          <div key={c.domain} className="flex justify-between">
            <span>{c.domain}</span>
            <span className="font-mono">{c.health}</span>
          </div>
        ))}
      </div>
      {blindspots.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Blindspots: {blindspots.slice(0, 6).join(", ")}
        </p>
      )}
    </Card>
  );
}
