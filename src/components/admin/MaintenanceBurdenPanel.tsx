import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function MaintenanceBurdenPanel({
  burdenScore,
  complexityCost,
  lowValueSystems,
}: {
  burdenScore: number;
  complexityCost: number;
  lowValueSystems: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Maintenance Burden</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{burdenScore}</div>
        <Progress value={burdenScore} />
        <div className="flex justify-between"><span className="text-muted-foreground">Complexity cost</span><b>{complexityCost}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Low-value systems</span><b>{lowValueSystems}</b></div>
      </CardContent>
    </Card>
  );
}
