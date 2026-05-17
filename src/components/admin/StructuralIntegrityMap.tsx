import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StructuralIntegrityMap({
  integrity, resilience, fragmentation, ecosystem,
}: { integrity: number; resilience: number; fragmentation: number; ecosystem: number }) {
  const rows: [string, number][] = [
    ["Integridade", integrity],
    ["Resiliência", resilience],
    ["Fragmentação", fragmentation],
    ["Ecossistema", ecosystem],
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Structural Integrity Map</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rows.map(([l, v]) => (
          <div key={l}>
            <div className="flex justify-between text-xs mb-1"><span>{l}</span><span>{v}</span></div>
            <Progress value={v} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
