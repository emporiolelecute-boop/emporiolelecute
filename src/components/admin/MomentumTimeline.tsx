import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface MomentumPoint {
  snapshot_date: string;
  strategic_value: number;
}

export function MomentumTimeline({ points }: { points: MomentumPoint[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Momentum Estratégico</CardTitle></CardHeader>
      <CardContent>
        {points.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem snapshots ainda.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {points.map((p, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">{new Date(p.snapshot_date).toLocaleDateString()}</span>
                <span className="font-mono">{p.strategic_value}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
