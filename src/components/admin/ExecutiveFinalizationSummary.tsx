import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ExecutiveFinalizationSummary({ status, score, narrative, highlights }: {
  status: string; score: number; narrative: string; highlights: string[];
}) {
  const tone = score >= 75 ? "default" : score >= 55 ? "secondary" : "destructive";
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Executive Finalization</CardTitle>
        <Badge variant={tone as any}>{status}</Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-4xl font-bold">{score}</div>
        <p className="text-muted-foreground">{narrative}</p>
        {highlights.length > 0 && (
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            {highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
