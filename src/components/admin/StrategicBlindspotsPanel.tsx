import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { blindspots: string[]; warnings: string[]; }
export default function StrategicBlindspotsPanel({ blindspots, warnings }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Blindspots</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        {blindspots.length === 0 && warnings.length === 0 && (
          <p className="text-muted-foreground">Nenhum blindspot relevante detectado.</p>
        )}
        {blindspots.length > 0 && (
          <div>
            <p className="font-medium">Blindspots</p>
            <ul>{blindspots.map((b, i) => <li key={i}>• {b}</li>)}</ul>
          </div>
        )}
        {warnings.length > 0 && (
          <div>
            <p className="font-medium">Executive Warnings</p>
            <ul>{warnings.map((w, i) => <li key={i}>• {w}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
