import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NervousSystemReport } from "@/lib/strategicNervousSystem";

const toneFor = (v: string) =>
  v === "ASCENDED" || v === "EVOLVED" ? "default"
  : v === "STABLE" ? "secondary"
  : "destructive";

export default function NervousSystemCard({ report }: { report: NervousSystemReport }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Nervous System</CardTitle>
        <Badge variant={toneFor(report.verdict) as any}>{report.verdict}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{report.score}</div>
        <p className="text-sm text-muted-foreground mt-2">{report.summary}</p>
      </CardContent>
    </Card>
  );
}
