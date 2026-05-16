import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SemanticDriftRadar({ drift, longevity, aging }: { drift: number; longevity: number; aging: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Semantic Drift</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{drift}</div>
        <p className="text-xs text-muted-foreground">Drift semântico atual (0–100)</p>
        <div className="flex justify-between"><span className="text-muted-foreground">Longevidade semântica</span><b>{longevity}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Envelhecimento</span><b>{aging}</b></div>
      </CardContent>
    </Card>
  );
}
