import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategicSimplificationRadar({ roadmap, friction, readiness }: {
  roadmap: string[]; friction: number; readiness: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Simplification Radar</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Atrito estratégico</span><b>{friction}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Prontidão para simplificar</span><b>{readiness}</b></div>
        {roadmap.length > 0 && (
          <ul className="list-disc pl-5 text-muted-foreground space-y-1 mt-2">
            {roadmap.map((r) => <li key={r}>{r}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
