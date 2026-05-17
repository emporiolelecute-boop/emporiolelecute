import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  observability: number;
  explainability: number;
  reflection: number;
  integrity: number;
  consensus: number;
}

export default function SystemicReflectionRadar(p: Props) {
  const axes = [
    { k: "Observability", v: p.observability },
    { k: "Explainability", v: p.explainability },
    { k: "Reflection", v: p.reflection },
    { k: "Integrity", v: p.integrity },
    { k: "Consensus", v: p.consensus },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Systemic Reflection</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {axes.map((a) => (
          <div key={a.k} className="flex items-center gap-3">
            <div className="w-32 text-sm">{a.k}</div>
            <div className="flex-1 bg-muted h-2 rounded">
              <div className="h-2 rounded bg-primary" style={{ width: `${a.v}%` }} />
            </div>
            <div className="w-10 text-right text-sm">{a.v}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
