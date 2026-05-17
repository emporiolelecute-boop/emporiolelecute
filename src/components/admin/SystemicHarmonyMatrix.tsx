import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { harmony: number; alignment: number; synchronization: number; dissonances: string[]; }
export default function SystemicHarmonyMatrix({ harmony, alignment, synchronization, dissonances }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Systemic Harmony</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{harmony}</div>
        <p><span className="text-muted-foreground">Cross-Layer Alignment:</span> {alignment}</p>
        <p><span className="text-muted-foreground">Operational Synchronization:</span> {synchronization}</p>
        {dissonances.length > 0 && (
          <ul className="mt-2">{dissonances.map((d, i) => <li key={i}>• {d}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
