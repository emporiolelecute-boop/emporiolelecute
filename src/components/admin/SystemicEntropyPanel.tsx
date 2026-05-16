import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EntropyMap, EntropyClassification } from "@/lib/systemicEntropy";

const tone: Record<EntropyClassification, string> = {
  ordered: "bg-emerald-500 text-white",
  balanced: "bg-blue-500 text-white",
  unstable: "bg-amber-500 text-white",
  chaotic: "bg-red-600 text-white",
};

export default function SystemicEntropyPanel({ map }: { map: EntropyMap }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Systemic Entropy</CardTitle>
        <Badge className={tone[map.classification]}>{map.classification}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{map.systemic}</div>
        <p className="text-xs text-muted-foreground mt-1">Entropia consolidada (0–100)</p>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <Row label="Semântica" v={map.semantic} />
          <Row label="Execução" v={map.execution} />
          <Row label="Autoridade" v={map.authority} />
          <Row label="Estratégica" v={map.strategic} />
          <Row label="Ruído" v={map.noise} />
          <Row label="Perda de Sinal" v={map.signalLoss} />
        </div>
        {map.leaks.length > 0 && (
          <div className="mt-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Vazamentos detectados:</p>
            <ul className="list-disc pl-5">{map.leaks.map((l) => <li key={l}>{l}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Row({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
