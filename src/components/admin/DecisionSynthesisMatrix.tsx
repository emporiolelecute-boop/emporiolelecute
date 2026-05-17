import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DecisionSynthesisMatrix({
  layers,
}: { layers: Record<string, number> }) {
  const entries = Object.entries(layers);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Matriz de Síntese Decisória</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {entries.map(([label, value]) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="capitalize">{label}</span><span>{value}</span>
            </div>
            <Progress value={value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
