import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SemanticConfusionMatrix({
  confusion, noise, hallucination, entropy,
}: { confusion: number; noise: number; hallucination: number; entropy: number }) {
  const rows = [
    { label: "Confusão Semântica", v: confusion },
    { label: "Ruído", v: noise },
    { label: "Alucinação", v: hallucination },
    { label: "Entropia", v: entropy },
  ];
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium">Matriz de Confusão Semântica</h4>
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-xs mb-1"><span>{r.label}</span><span className={r.v >= 60 ? "text-red-600 font-medium" : "font-medium"}>{r.v}</span></div>
          <Progress value={r.v} />
        </div>
      ))}
    </Card>
  );
}
