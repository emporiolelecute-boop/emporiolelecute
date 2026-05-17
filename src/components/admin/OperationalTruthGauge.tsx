import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { truth: number; honesty: number; reliability: number; transparency: number; fictions: string[]; }
export default function OperationalTruthGauge({ truth, honesty, reliability, transparency, fictions }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Truth</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{truth}</div>
        <p><span className="text-muted-foreground">Execution Honesty:</span> {honesty}</p>
        <p><span className="text-muted-foreground">Execution Reliability:</span> {reliability}</p>
        <p><span className="text-muted-foreground">Transparency:</span> {transparency}</p>
        {fictions.length > 0 && (
          <ul className="mt-2 space-y-0.5">{fictions.map((f, i) => <li key={i}>• {f}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
