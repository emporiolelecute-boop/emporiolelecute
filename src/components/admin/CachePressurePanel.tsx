import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database } from "lucide-react";

interface Props {
  pressure: number;
  load: number;
  report: string[];
}

export function CachePressurePanel({ pressure, load, report }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" /> Cache & Query Governance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-muted-foreground">Cache Pressure</div>
            <div className="text-xl font-bold tabular-nums">{pressure}</div>
            <Progress value={pressure} className="mt-1" />
          </div>
          <div>
            <div className="text-muted-foreground">React Query Load</div>
            <div className="text-xl font-bold tabular-nums">{load}</div>
            <Progress value={load} className="mt-1" />
          </div>
        </div>
        <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
          {report.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
