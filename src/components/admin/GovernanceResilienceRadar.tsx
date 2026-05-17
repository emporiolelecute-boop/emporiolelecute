import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props {
  resilience: number;
  recovery: number;
  cascadeProtection: number;
  survival: number;
  weakZones: string[];
}
export default function GovernanceResilienceRadar(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Governance Resilience</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-3xl font-bold">{p.resilience}</div>
        <p><span className="text-muted-foreground">Recovery Elasticity:</span> {p.recovery}</p>
        <p><span className="text-muted-foreground">Cascade Protection:</span> {p.cascadeProtection}</p>
        <p><span className="text-muted-foreground">Survival Probability:</span> {p.survival}</p>
        {p.weakZones.length > 0 && (
          <ul className="pt-2 border-t mt-2">
            {p.weakZones.map((z, i) => <li key={i}>• {z}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
