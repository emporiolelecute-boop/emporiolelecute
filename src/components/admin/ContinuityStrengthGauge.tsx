import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { strength: number; persistence: number; signals: string[]; }
export default function ContinuityStrengthGauge({ strength, persistence, signals }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Continuity Strength</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{strength}</div>
        <p><span className="text-muted-foreground">Persistence:</span> {persistence}</p>
        {signals.length > 0 && (
          <ul className="mt-2">{signals.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
