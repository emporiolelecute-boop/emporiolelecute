import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ExecutiveOverviewCard({ status, score, narrative }: {
  status: string; score: number; narrative: string;
}) {
  const tone = score >= 75 ? "default" : score >= 55 ? "secondary" : "destructive";
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Executive Overview</CardTitle>
        <Badge variant={tone as any}>{status}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-4xl font-bold">{score}</div>
        <p className="text-sm text-muted-foreground">{narrative}</p>
      </CardContent>
    </Card>
  );
}
