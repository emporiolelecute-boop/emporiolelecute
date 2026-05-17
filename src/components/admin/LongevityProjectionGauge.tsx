import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  longevity: number;
  viability: number;
  survival: number;
}

export default function LongevityProjectionGauge({ longevity, viability, survival }: Props) {
  const bar = (label: string, value: number) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span><span>{value}</span>
      </div>
      <div className="bg-muted h-2 rounded">
        <div className="h-2 rounded bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Longevity Projection</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {bar("Systemic Longevity", longevity)}
        {bar("Long-Term Reasoning Viability", viability)}
        {bar("Strategic Survival Confidence", survival)}
      </CardContent>
    </Card>
  );
}
