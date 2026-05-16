import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OperationalHarmonyMatrix({
  harmony, focus, alignment, coherence,
}: { harmony: number; focus: number; alignment: number; coherence: number }) {
  const items = [
    { label: "Harmonia", v: harmony },
    { label: "Foco", v: focus },
    { label: "Alinhamento", v: alignment },
    { label: "Coerência", v: coherence },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Harmony</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {items.map((i) => (
            <div key={i.label} className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">{i.label}</p>
              <p className="text-2xl font-semibold">{i.v}</p>
              <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${i.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
