import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { resistance: number; structural: number; pressure: number; accelerations: string[]; }
export default function EntropyResistancePanel({ resistance, structural, pressure, accelerations }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Entropy Resistance</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{resistance}</div>
        <p><span className="text-muted-foreground">Structural Persistence:</span> {structural}</p>
        <p><span className="text-muted-foreground">Decay Pressure:</span> {pressure}</p>
        {accelerations.length > 0 && (
          <ul className="mt-2">{accelerations.map((a, i) => <li key={i}>• {a}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
