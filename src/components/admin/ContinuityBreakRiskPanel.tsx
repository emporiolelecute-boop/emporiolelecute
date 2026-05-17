import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { breakRisk: number; entropy: number; fragmentation: number; warnings: string[]; }
export default function ContinuityBreakRiskPanel({ breakRisk, entropy, fragmentation, warnings }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Continuity Break Risk</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{breakRisk}</div>
        <p><span className="text-muted-foreground">Entropy Accumulation:</span> {entropy}</p>
        <p><span className="text-muted-foreground">Fragmentation:</span> {fragmentation}</p>
        {warnings.length > 0 && (
          <ul className="mt-2">{warnings.map((w, i) => <li key={i}>• {w}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
