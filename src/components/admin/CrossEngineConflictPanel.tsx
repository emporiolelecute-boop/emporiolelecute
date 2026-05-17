import { Card } from "@/components/ui/card";
import type { EngineConflict } from "@/lib/engineConsensus";

export default function CrossEngineConflictPanel({
  conflicts,
}: { conflicts: EngineConflict[] }) {
  return (
    <Card className="p-4 space-y-3">
      <p className="text-base font-medium">Cross-Engine Conflicts</p>
      {conflicts.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sem conflitos detectados.</p>
      ) : (
        <ul className="space-y-1 text-xs">
          {conflicts.slice(0, 12).map((c, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span className="truncate">{c.engine_a} ↔ {c.engine_b}</span>
              <span className="font-mono uppercase text-muted-foreground">{c.severity}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
