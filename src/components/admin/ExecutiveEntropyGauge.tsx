import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { entropy: number; disruption: number; instability: number; warnings: string[]; }
export default function ExecutiveEntropyGauge({ entropy, disruption, instability, warnings }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Entropy</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{entropy}</div>
        <p><span className="text-muted-foreground">Operational Disruption:</span> {disruption}</p>
        <p><span className="text-muted-foreground">Strategic Instability:</span> {instability}</p>
        {warnings.length > 0 && (
          <ul className="mt-2">{warnings.map((w, i) => <li key={i}>• {w}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
