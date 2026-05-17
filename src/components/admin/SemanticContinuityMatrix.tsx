import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SemanticContinuityMatrix({ continuity, stability, cohesion, drift }: { continuity: number; stability: number; cohesion: number; drift: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Semantic Continuity Matrix</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-4xl font-bold">{continuity}</div>
        {[
          { label: "Estabilidade", value: stability },
          { label: "Coesão", value: cohesion },
          { label: "Drift", value: drift },
        ].map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs mb-1"><span>{r.label}</span><span>{r.value}</span></div>
            <Progress value={r.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
