import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LineageGraph } from "@/lib/metricLineage";

export default function LineageGraphPanel({
  graph, integrity, cycles, orphans, untraceable,
}: { graph: LineageGraph; integrity: number; cycles: string[]; orphans: string[]; untraceable: string[] }) {
  const nodes = Object.values(graph.nodes);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Metric Lineage</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-baseline gap-3">
          <div className="text-4xl font-bold">{integrity}</div>
          <span className="text-xs text-muted-foreground">{nodes.length} nós</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Stat label="Ciclos" v={cycles.length} />
          <Stat label="Órfãs" v={orphans.length} />
          <Stat label="Sem origem" v={untraceable.length} />
        </div>
        <div className="max-h-64 overflow-auto border rounded p-2">
          {nodes.slice(0, 30).map((n) => (
            <div key={n.metric_key} className="text-xs py-1 border-b last:border-0">
              <b>{n.metric_key}</b>
              <span className="text-muted-foreground"> ← {n.depends_on.join(", ") || "—"} </span>
              <span className="text-muted-foreground">[{n.derived_from_engines.join(", ") || "—"}]</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
function Stat({ label, v }: { label: string; v: number }) {
  return <div className="border rounded p-2"><div className="text-muted-foreground">{label}</div><div className="font-bold">{v}</div></div>;
}
