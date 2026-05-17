import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { resilience: number; recovery: number; elasticity: number; weakening: string[]; }
export default function ResilienceContinuumCard({ resilience, recovery, elasticity, weakening }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Resilience Continuum</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{resilience}</div>
        <p><span className="text-muted-foreground">Recovery:</span> {recovery}</p>
        <p><span className="text-muted-foreground">Elasticity:</span> {elasticity}</p>
        {weakening.length > 0 && (
          <ul className="mt-2">{weakening.map((w, i) => <li key={i}>• {w}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
