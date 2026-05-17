import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wrench } from "lucide-react";

interface Props { liability: number; topItems: Array<{ name: string; complexity: number; valueScore: number }> }

export function MaintenanceLiabilityCard({ liability, topItems }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" /> Maintenance Liability
        </CardTitle>
        <span className="text-2xl font-bold tabular-nums">{liability}</span>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={liability} />
        <div className="space-y-1">
          {topItems.slice(0, 5).map((it) => (
            <div key={it.name} className="flex items-center justify-between text-xs">
              <span className="truncate text-muted-foreground">{it.name}</span>
              <span className="tabular-nums">{it.complexity}/{it.valueScore}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
