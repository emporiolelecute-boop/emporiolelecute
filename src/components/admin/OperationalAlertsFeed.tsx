import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OperationalAlert } from "@/lib/executiveMode";

export default function OperationalAlertsFeed({ alerts }: { alerts: OperationalAlert[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Alerts</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {alerts.length === 0 && <div className="text-muted-foreground">No alerts.</div>}
        {alerts.map((a) => (
          <div key={a.id} className="flex items-center justify-between border-b pb-1">
            <div className="truncate">{a.message}</div>
            <Badge variant={a.severity === "critical" ? "destructive" : "outline"}>{a.severity}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
