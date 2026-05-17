import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CognitiveLoadTimeline({
  points,
}: {
  points: { label: string; value: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cognitive Load Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {points.length === 0 && (
          <div className="text-muted-foreground">No samples available.</div>
        )}
        {points.map((p, i) => (
          <div key={i}>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{p.label}</span>
              <b>{p.value}</b>
            </div>
            <Progress value={p.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
