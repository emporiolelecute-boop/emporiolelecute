import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar } from "lucide-react";

interface CorrelationItem { label: string; pearson: number; sampleSize: number }
interface Props { items: CorrelationItem[]; leverage: number }

export function CommercialCorrelationRadar({ items, leverage }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Radar className="h-4 w-4 text-primary" /> Commercial Correlation
        </CardTitle>
        <span className="text-2xl font-bold tabular-nums">{leverage}</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.label} className="flex items-center justify-between text-xs border-b border-border/40 pb-1">
              <span className="text-muted-foreground">{it.label}</span>
              <span className="tabular-nums">
                r={it.pearson.toFixed(2)} · n={it.sampleSize}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
