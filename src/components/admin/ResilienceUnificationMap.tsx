import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { resilience: number; recovery: number; synchronization: number; cascades: string[]; }
export default function ResilienceUnificationMap({ resilience, recovery, synchronization, cascades }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Resilience Unification</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{resilience}</div>
        <p><span className="text-muted-foreground">Recovery Capacity:</span> {recovery}</p>
        <p><span className="text-muted-foreground">Resilience Sync:</span> {synchronization}</p>
        {cascades.length > 0 && (
          <ul className="mt-2">{cascades.map((c, i) => <li key={i}>• {c}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
