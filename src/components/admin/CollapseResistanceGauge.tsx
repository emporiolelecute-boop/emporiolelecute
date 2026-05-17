import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CollapseResistanceGauge({ resistance, probability, vectors }: { resistance: number; probability: number; vectors: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Collapse Resistance</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-4xl font-bold">{resistance}</div>
        <Progress value={resistance} />
        <div className="flex justify-between"><span className="text-muted-foreground">Probabilidade de Colapso</span><b>{probability}</b></div>
        {vectors.length > 0 && (
          <div>
            <p className="font-medium text-xs">Vetores</p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">{vectors.map((v) => <li key={v}>{v}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
