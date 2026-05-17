import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface Props { reliability: number; priorities: string[] }

export function DocumentationReliabilityGauge({ reliability, priorities }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Documentation Reliability
        </CardTitle>
        <span className="text-2xl font-bold tabular-nums">{reliability}</span>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={reliability} />
        <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
          {priorities.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
