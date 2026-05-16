import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PrioritizedAction } from "@/lib/executionPrioritizer";

export default function ExecutionQueuePanel({ title, items }: { title: string; items: PrioritizedAction[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        {!items.length ? (
          <p className="text-sm text-muted-foreground">Sem itens nesta fila.</p>
        ) : (
          <div className="grid gap-2">
            {items.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{a.entityType}</Badge>
                    <span className="truncate">{a.entityName ?? a.entitySlug ?? a.entityId}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{a.reason}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="text-xs">ROI <span className="font-mono">{a.estimatedROI}</span></div>
                  <div className="text-[10px] text-muted-foreground">esforço {a.effort}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
