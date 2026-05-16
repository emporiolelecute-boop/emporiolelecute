import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CoherenceMap } from "@/lib/systemicCoherenceEngine";

export default function SystemicCoherenceMap({ map }: { map: CoherenceMap }) {
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium">Coerência Sistêmica</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Stat label="Coerência" v={map.coherence} />
        <Stat label="Fragmentação" v={map.fragmentation} invert />
        <Stat label="Desalinhamento" v={map.misalignment} invert />
        <Stat label="Dissonância" v={map.dissonance} invert />
        <Stat label="Consistência Evolutiva" v={map.evolutionary} />
      </div>
      <div className="pt-2 border-t space-y-1">
        {map.contradictions.length === 0 && <p className="text-xs text-muted-foreground">Sem contradições detectadas.</p>}
        {map.contradictions.map((c) => (
          <div key={c.key} className="flex justify-between text-xs">
            <span>{c.note}</span>
            <Badge variant={c.severity === "high" ? "destructive" : "secondary"}>{c.severity}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Stat({ label, v, invert }: { label: string; v: number; invert?: boolean }) {
  const bad = invert ? v >= 60 : v < 40;
  return (
    <div className="rounded-md border p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-semibold ${bad ? "text-red-600" : ""}`}>{v}</div>
    </div>
  );
}
