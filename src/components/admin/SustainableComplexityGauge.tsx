import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf } from "lucide-react";

interface Props { sustainable: number; bloat: number; backlog: number }

export function SustainableComplexityGauge({ sustainable, bloat, backlog }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Leaf className="h-4 w-4 text-primary" /> Sustainable Complexity
        </CardTitle>
        <span className="text-2xl font-bold tabular-nums">{sustainable}</span>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={sustainable} />
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div>Operational bloat: <span className="font-medium text-foreground">{bloat}</span></div>
          <div>Backlog items: <span className="font-medium text-foreground">{backlog}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
