import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OpacityEntry { id: string; unknownDeps: number; reason: string }

export default function DependencyOpacityHeatmap({ entries }: { entries: OpacityEntry[] }) {
  const maxDeps = Math.max(1, ...entries.map((e) => e.unknownDeps));
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Dependency Opacity</CardTitle></CardHeader>
      <CardContent className="text-sm">
        {entries.length === 0 ? (
          <p className="text-xs text-muted-foreground">All dependencies resolve cleanly.</p>
        ) : (
          <ul className="space-y-1 max-h-64 overflow-auto">
            {entries.slice(0, 20).map((e) => {
              const intensity = Math.round((e.unknownDeps / maxDeps) * 100);
              return (
                <li key={e.id} className="text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">{e.id}</span>
                    <b>{e.unknownDeps}</b>
                  </div>
                  <div className="h-1 rounded bg-muted overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: `${intensity}%` }} />
                  </div>
                  <div className="text-muted-foreground truncate">{e.reason}</div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
