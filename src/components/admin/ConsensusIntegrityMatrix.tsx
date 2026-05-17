import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ConsensusMapEntry } from "@/lib/consensusIntegrity";

export default function ConsensusIntegrityMatrix({
  score, verdict, map, divergence, isolation,
}: { score: number; verdict: string; map: ConsensusMapEntry[]; divergence: number; isolation: number; }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Consensus Integrity <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Integrity" value={score} />
          <Stat label="Divergence" value={divergence} />
          <Stat label="Isolation" value={isolation} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {map.map((e) => (
            <div key={e.engine} className="rounded border p-2 text-xs">
              <div className="font-medium capitalize">{e.engine}</div>
              <div className="text-muted-foreground">alignment {e.alignment}</div>
              <div className="h-1.5 mt-1 bg-muted rounded">
                <div className="h-full bg-primary rounded" style={{ width: `${e.alignment}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
