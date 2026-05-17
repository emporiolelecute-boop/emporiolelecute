import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OperationalFatigueHeatmap({
  fatigue,
  theaterCount,
  inflated,
  overloaded,
}: {
  fatigue: number;
  theaterCount: number;
  inflated: string[];
  overloaded: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Operational Fatigue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{fatigue}</div>
        <Progress value={fatigue} />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Analytics theater</span>
          <b>{theaterCount}</b>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Inflated</span>
          <b>{inflated.length}</b>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Overloaded</span>
          <b>{overloaded.length}</b>
        </div>
      </CardContent>
    </Card>
  );
}
