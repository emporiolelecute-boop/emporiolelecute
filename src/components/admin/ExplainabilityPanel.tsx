import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExplainabilityPanel({
  score, avgConfidence, opaque,
}: { score: number; avgConfidence: number; opaque: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Explainability</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{score}</div>
        <div className="flex justify-between"><span className="text-muted-foreground">Confiança média</span><b>{avgConfidence}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Métricas opacas</span><b>{opaque.length}</b></div>
        {opaque.length > 0 && (
          <div>
            <p className="font-medium text-xs">Detalhes</p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">
              {opaque.slice(0, 8).map((o) => <li key={o}>{o}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
