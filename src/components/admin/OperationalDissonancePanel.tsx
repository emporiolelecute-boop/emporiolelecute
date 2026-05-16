import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OperationalDissonancePanel({
  dissonance, fragmentation, misalignment,
}: { dissonance: number; fragmentation: number; misalignment: number }) {
  const rows = [
    { label: "Dissonância Operacional", v: dissonance },
    { label: "Fragmentação", v: fragmentation },
    { label: "Desalinhamento", v: misalignment },
  ];
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium">Dissonância Operacional</h4>
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-xs mb-1"><span>{r.label}</span><span className="font-medium">{r.v}</span></div>
          <Progress value={r.v} />
        </div>
      ))}
    </Card>
  );
}
