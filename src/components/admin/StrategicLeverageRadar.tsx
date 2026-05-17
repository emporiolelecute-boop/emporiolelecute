import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DecisionItem } from "@/lib/executiveDecisionEngine";

export default function StrategicLeverageRadar({ items }: { items: DecisionItem[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Strategic Leverage</CardTitle></CardHeader>
      <CardContent className="text-sm">
        <ul className="space-y-1 max-h-[460px] overflow-y-auto">
          {items.map((i) => (
            <li key={i.metric} className="border rounded p-2">
              <div className="flex justify-between">
                <span className="font-medium">{i.metric}</span>
                <Badge variant="secondary">{i.classification}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Leverage {i.leverage} · Compounding {i.compounding}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
