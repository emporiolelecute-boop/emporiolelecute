import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface DependencyRow {
  source: string;
  target: string;
  fragility: number;
  critical?: boolean;
}

export default function DependencyFragilityRadar({ items }: { items: DependencyRow[] }) {
  if (!items.length) {
    return <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Sem dependências mapeadas.</CardContent></Card>;
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Fragilidade de Dependências</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {items.slice(0, 20).map((d, i) => (
          <div key={i} className="flex items-center justify-between border rounded-md px-3 py-2">
            <div className="font-mono text-xs">{d.source} → {d.target}</div>
            <div className="flex items-center gap-2">
              {d.critical && <Badge variant="destructive" className="text-[10px]">CRÍTICA</Badge>}
              <span className="font-mono">{d.fragility}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
