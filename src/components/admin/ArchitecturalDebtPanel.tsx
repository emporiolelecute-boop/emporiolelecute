import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ArchitecturalDebtPanel({
  debt,
  orphans,
  thin,
  metaExcess,
}: {
  debt: number;
  orphans: string[];
  thin: string[];
  metaExcess: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Architectural Debt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{debt}</div>
        <Progress value={debt} />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Orphan dashboards</span>
          <b>{orphans.length}</b>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Thin dashboards</span>
          <b>{thin.length}</b>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Meta abstraction excess</span>
          <b>{metaExcess}</b>
        </div>
      </CardContent>
    </Card>
  );
}
