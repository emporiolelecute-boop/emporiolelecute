import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  awareness: number;
  reflectionDepth: number;
  humility: number;
  overconfidence: number;
  blindZones: string[];
}

export default function StrategicSelfAwarenessPanel({
  awareness, reflectionDepth, humility, overconfidence, blindZones,
}: Props) {
  const row = (label: string, value: number | string) => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Self-Awareness</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {row("Self-Awareness", awareness)}
        {row("Reflection Depth", reflectionDepth)}
        {row("Strategic Humility", humility)}
        {row("Overconfidence", overconfidence)}
        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-1">Blind Zones</p>
          {blindZones.length === 0
            ? <p className="text-sm">Nenhuma detectada.</p>
            : <ul className="text-sm">{blindZones.map((b, i) => <li key={i}>• {b}</li>)}</ul>}
        </div>
      </CardContent>
    </Card>
  );
}
