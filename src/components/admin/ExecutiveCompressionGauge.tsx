import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ExecutiveCompressionGauge({
  compression,
  actionability,
}: {
  compression: number;
  actionability: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Executive Compression</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{compression}</div>
        <Progress value={compression} />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Actionability</span>
          <b>{actionability}</b>
        </div>
      </CardContent>
    </Card>
  );
}
