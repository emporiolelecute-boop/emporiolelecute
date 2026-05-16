import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PressureReport } from "@/lib/strategicPressure";

export default function PressureHeatmap({ items }: { items: PressureReport[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Mapa de Pressão Estratégica</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {items.map((p) => {
            const hue = 120 - Math.round(p.score * 1.2); // 120 verde → 0 vermelho
            return (
              <div key={p.area} className="rounded-md p-3 text-white" style={{ backgroundColor: `hsl(${Math.max(0, hue)} 70% 45%)` }}>
                <div className="text-xs uppercase opacity-80">{p.area}</div>
                <div className="text-2xl font-bold">{p.score}</div>
                <div className="text-xs opacity-90 mt-1">{p.severity}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid gap-2">
          {items.map((p) => (
            <div key={p.area + "-mit"} className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground capitalize">{p.area}:</span> {p.mitigation.join(" · ")}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
