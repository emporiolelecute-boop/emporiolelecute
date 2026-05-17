import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gauge } from "lucide-react";

interface Props {
  pressure: number;
  plan: string[];
}

export function PerformanceHardeningCard({ pressure, plan }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" /> Performance Pressure
        </CardTitle>
        <span className="text-2xl font-bold tabular-nums">{pressure}</span>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={pressure} />
        <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
          {plan.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
