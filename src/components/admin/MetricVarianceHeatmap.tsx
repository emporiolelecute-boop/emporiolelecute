import { Card } from "@/components/ui/card";

export default function MetricVarianceHeatmap({
  variances,
}: { variances: Record<string, number> }) {
  const entries = Object.entries(variances).sort((a, b) => b[1] - a[1]);
  return (
    <Card className="p-4 space-y-3">
      <p className="text-base font-medium">Metric Variance</p>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sem variâncias registradas.</p>
      ) : (
        <ul className="space-y-1 text-xs">
          {entries.slice(0, 16).map(([k, v]) => (
            <li key={k} className="flex justify-between">
              <span className="truncate">{k}</span>
              <span className="font-mono">{v}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
