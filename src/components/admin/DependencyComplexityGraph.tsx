import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DependencyComplexityGraph({ complexity, layers }: {
  complexity: number; layers: Array<{ from: string; to: string; count: number }>;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Dependency Complexity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{complexity}</div>
        {layers.length === 0 ? (
          <p className="text-muted-foreground">Sem relações cruzadas mapeadas.</p>
        ) : (
          <ul className="text-xs text-muted-foreground space-y-1">
            {layers.slice(0, 6).map((l) => (
              <li key={`${l.from}-${l.to}`} className="flex justify-between">
                <span>{l.from} → {l.to}</span><b>{l.count}</b>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
