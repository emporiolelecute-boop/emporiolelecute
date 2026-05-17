import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategicLongevityPanel({ longevity, consistency, horizon }: { longevity: number; consistency: number; horizon: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Longevity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{longevity}</div>
        <div className="flex justify-between"><span className="text-muted-foreground">Consistência</span><b>{consistency}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Horizonte</span><b>{horizon}</b></div>
      </CardContent>
    </Card>
  );
}
