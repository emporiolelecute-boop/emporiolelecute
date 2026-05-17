import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  continuity: number;
  longevity: number;
  viability: number;
  decay: number;
  breakpoints: string[];
}
export default function StrategicContinuityTimeline(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Continuity</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <p><span className="text-muted-foreground">Continuity:</span> <strong>{p.continuity}</strong></p>
        <p><span className="text-muted-foreground">Longevity:</span> {p.longevity}</p>
        <p><span className="text-muted-foreground">Long-Term Viability:</span> {p.viability}</p>
        <p><span className="text-muted-foreground">Decay:</span> {p.decay}</p>
        {p.breakpoints.length > 0 && (
          <ul className="pt-2 border-t mt-2">
            {p.breakpoints.map((b, i) => <li key={i}>• {b}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
