import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WasteItem } from "@/lib/executionLeverage";

export default function ExecutionWasteHeatmap({ waste }: { waste: WasteItem[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Execution Waste</CardTitle></CardHeader>
      <CardContent className="text-sm">
        {!waste.length && <p className="text-muted-foreground">No waste detected.</p>}
        <ul className="space-y-1 max-h-[460px] overflow-y-auto">
          {waste.map((w) => (
            <li key={w.metric} className="border rounded p-2">
              <div className="flex justify-between">
                <span className="font-medium">{w.metric}</span>
                <span>{w.waste_score}/100</span>
              </div>
              <div className="text-xs text-muted-foreground">{w.reason}</div>
              <div className="h-1.5 bg-muted rounded mt-1 overflow-hidden">
                <div className="h-full bg-destructive" style={{ width: `${w.waste_score}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
