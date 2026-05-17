import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function EcosystemSurvivabilityGauge({ survivability, longTerm, viability }: { survivability: number; longTerm: number; viability: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Ecosystem Survivability</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-4xl font-bold">{survivability}</div>
        <Progress value={survivability} />
        <div className="flex justify-between"><span className="text-muted-foreground">Long-Term Viability</span><b>{longTerm}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Viability Forecast</span><b>{viability}</b></div>
      </CardContent>
    </Card>
  );
}
