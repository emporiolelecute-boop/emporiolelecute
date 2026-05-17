import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OperationalCompressionGauge({
  compression, system, opportunities,
}: { compression: number; system: number; opportunities: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Compression</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-4xl font-bold">{compression}</div>
        <Progress value={compression} />
        <div className="flex justify-between"><span className="text-muted-foreground">Compressão sistêmica</span><b>{system}</b></div>
        {opportunities.length > 0 && (
          <div>
            <p className="font-medium text-xs">Oportunidades</p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">
              {opportunities.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
