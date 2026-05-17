import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ExecutiveFocusGauge({ score }: { score: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Focus</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold">{score}</div>
        <Progress value={score} />
        <div className="text-xs text-muted-foreground">Higher = more focused on high-impact work</div>
      </CardContent>
    </Card>
  );
}
