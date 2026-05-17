import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExecutionItem } from "@/lib/executionOrchestrator";

export default function CompoundingLeveragePanel({
  compounding, authority, semantic, longTermValue,
}: {
  compounding: ExecutionItem[];
  authority: number; semantic: number; longTermValue: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle>Compounding Leverage</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Compounding authority" v={authority} />
          <Stat label="Semantic compounding" v={semantic} />
          <Stat label="Long-term value" v={longTermValue} />
        </div>
        <div>
          <div className="font-medium mb-1">Compounding sequence</div>
          <ul className="text-xs space-y-1">
            {compounding.map((i) => (
              <li key={i.metric} className="border rounded p-2 flex justify-between">
                <span>{i.metric}</span>
                <span className="text-muted-foreground">comp {i.compounding} · lev {i.leverage}</span>
              </li>
            ))}
            {!compounding.length && <li className="text-muted-foreground">No compounding-class items.</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}<span className="text-xs text-muted-foreground">/100</span></div>
    </div>
  );
}
