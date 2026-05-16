import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { MetaIntelligenceMap } from "@/lib/metaIntelligenceEngine";

export default function MetaIntelligencePanel({ map }: { map: MetaIntelligenceMap }) {
  const rows = [
    { label: "Meta-Inteligência", v: map.meta },
    { label: "Percepção Estratégica", v: map.perception },
    { label: "Ruído Estratégico", v: map.noise, invert: true },
    { label: "Alucinação Semântica", v: map.hallucination, invert: true },
    { label: "Falso Crescimento", v: map.falseGrowth, invert: true },
  ];
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium">Mapa de Meta-Inteligência</h4>
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-xs mb-1">
            <span>{r.label}</span>
            <span className={r.invert ? (r.v >= 60 ? "text-red-600 font-medium" : "font-medium") : "font-medium"}>{r.v}</span>
          </div>
          <Progress value={r.v} />
        </div>
      ))}
    </Card>
  );
}
