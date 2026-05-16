import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Bottleneck, BottleneckSeverity } from "@/lib/executionBottlenecks";

const tone: Record<BottleneckSeverity, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-amber-400 text-black",
  low: "bg-muted text-foreground",
};

export default function BottleneckMatrix({ items }: { items: Bottleneck[] }) {
  if (!items.length) {
    return <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Sem gargalos relevantes.</CardContent></Card>;
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Matriz de Gargalos</CardTitle></CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {items.map((b, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className={tone[b.severity]}>{b.severity}</Badge>
                  <span className="font-medium text-sm">{b.title}</span>
                  <Badge variant="outline" className="text-xs">{b.area}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{b.description}</p>
              </div>
              <div className="text-sm font-mono">{b.impact}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
