import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SystemComplexityCard({
  complexity,
  cognitive,
  usability,
}: {
  complexity: number;
  cognitive: number;
  usability: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">System Complexity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Complexity</span>
            <b>{complexity}</b>
          </div>
          <Progress value={complexity} />
        </div>
        <div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cognitive load</span>
            <b>{cognitive}</b>
          </div>
          <Progress value={cognitive} />
        </div>
        <div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Executive usability</span>
            <b>{usability}</b>
          </div>
          <Progress value={usability} />
        </div>
      </CardContent>
    </Card>
  );
}
