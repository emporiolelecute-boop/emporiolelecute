import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ArchitecturalEntropyMap({
  entropy, redundancy, overlap, untraceableRatio,
}: { entropy: number; redundancy: number; overlap: number; untraceableRatio: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Architectural Entropy</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-4xl font-bold">{entropy}</div>
        {[
          { label: "Redundância", value: redundancy },
          { label: "Overlap", value: overlap },
          { label: "Sem rastreabilidade", value: untraceableRatio },
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
