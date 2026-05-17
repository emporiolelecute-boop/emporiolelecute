import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function GrowthMomentumCard({ score }: { score: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Growth Momentum</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold">{score}</div>
        <Progress value={score} />
      </CardContent>
    </Card>
  );
}
