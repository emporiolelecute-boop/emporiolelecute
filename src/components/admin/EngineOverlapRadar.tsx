import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EngineOverlapRadar({
  overlap, conflicts, duplicates, consolidation,
}: { overlap: number; conflicts: string[]; duplicates: Record<string, string[]>; consolidation: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Engine Overlap</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-4xl font-bold">{overlap}%</div>
        <div>
          <p className="font-medium text-xs">Domínios duplicados</p>
          <ul className="list-disc pl-5 text-xs text-muted-foreground">
            {Object.keys(duplicates).length === 0 && <li>—</li>}
            {Object.entries(duplicates).map(([d, list]) => <li key={d}><b>{d}</b>: {list.join(", ")}</li>)}
          </ul>
        </div>
        <div>
          <p className="font-medium text-xs">Conflitos</p>
          <ul className="list-disc pl-5 text-xs text-muted-foreground">
            {conflicts.length === 0 && <li>—</li>}
            {conflicts.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div>
          <p className="font-medium text-xs">Roadmap de consolidação</p>
          <ul className="list-disc pl-5 text-xs text-muted-foreground">
            {consolidation.length === 0 && <li>—</li>}
            {consolidation.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
