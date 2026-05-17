import { Card } from "@/components/ui/card";
import type { ConsensusCell } from "@/lib/engineConsensus";

export default function EngineConsensusMatrix({ cells }: { cells: ConsensusCell[] }) {
  return (
    <Card className="p-4 space-y-3">
      <p className="text-base font-medium">Engine Consensus Matrix</p>
      {cells.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sem pares.</p>
      ) : (
        <div className="space-y-2">
          {cells.slice(0, 24).map((c) => (
            <div key={`${c.engine_a}-${c.engine_b}`} className="flex items-center justify-between text-xs">
              <span className="truncate">{c.engine_a} ↔ {c.engine_b}</span>
              <span className="font-mono">{c.agreement}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
