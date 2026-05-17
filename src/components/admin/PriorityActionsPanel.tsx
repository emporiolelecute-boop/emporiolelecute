import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PriorityAction } from "@/lib/executiveMode";

export default function PriorityActionsPanel({ actions }: { actions: PriorityAction[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Priority Actions</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {actions.length === 0 && <div className="text-muted-foreground">No actions queued.</div>}
        {actions.slice(0, 8).map((a) => (
          <div key={a.id} className="flex items-center justify-between border-b pb-1">
            <div className="truncate">{a.title}</div>
            <div className="flex gap-1">
              <Badge variant="outline">{a.category}</Badge>
              <Badge>{a.impact}/{a.effort}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
