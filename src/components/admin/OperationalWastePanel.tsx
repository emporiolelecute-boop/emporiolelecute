import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WasteItem, WasteSeverity } from "@/lib/operationalWaste";

const tone: Record<WasteSeverity, string> = {
  severe: "bg-red-600 text-white",
  elevated: "bg-orange-500 text-white",
  controlled: "bg-amber-400 text-black",
  minimal: "bg-muted text-foreground",
};

export default function OperationalWastePanel({ items }: { items: WasteItem[] }) {
  if (!items.length) return <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Sem desperdício relevante.</CardContent></Card>;
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Desperdício Operacional</CardTitle></CardHeader>
      <CardContent className="grid gap-2">
        {items.map((w, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge className={tone[w.severity]}>{w.severity}</Badge>
                <span className="font-medium text-sm">{w.title}</span>
                <Badge variant="outline" className="text-xs">{w.area}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{w.description}</p>
            </div>
            <div className="text-sm font-mono">{w.cost}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
