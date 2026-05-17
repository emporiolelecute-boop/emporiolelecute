import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function MetricRedundancyMatrix({
  redundancy, total, redundant, inflation,
}: { redundancy: number; total: number; redundant: number; inflation: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Metric Redundancy</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-4xl font-bold">{redundancy}%</div>
        <Progress value={redundancy} />
        <div className="flex justify-between"><span className="text-muted-foreground">Métricas totais</span><b>{total}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Redundantes</span><b>{redundant}</b></div>
        {inflation.length > 0 && (
          <div>
            <p className="font-medium text-xs">Grupos inflacionados</p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">{inflation.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
