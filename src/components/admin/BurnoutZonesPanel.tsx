import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BurnoutZone } from "@/lib/operationalFatigue";

export default function BurnoutZonesPanel({ zones }: { zones: BurnoutZone[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Zonas de Burnout</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {zones.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma zona crítica detectada.</p>}
        {zones.map((z) => (
          <div key={z.area} className="flex items-center justify-between rounded-md border p-2">
            <span className="text-sm font-medium">{z.area}</span>
            <Badge variant={z.intensity >= 70 ? "destructive" : "secondary"}>{z.intensity}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
