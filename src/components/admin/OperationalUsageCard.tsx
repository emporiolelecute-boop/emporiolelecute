import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OperationalUsageCard({
  operationalValue,
  dashboardEngagement,
  unusedDashboards,
  unusedMetrics,
  unusedEngines,
}: {
  operationalValue: number;
  dashboardEngagement: number;
  unusedDashboards: number;
  unusedMetrics: number;
  unusedEngines: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Usage</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{operationalValue}</div>
        <Progress value={operationalValue} />
        <div className="flex justify-between"><span className="text-muted-foreground">Dashboard engagement</span><b>{dashboardEngagement}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Unused dashboards</span><b>{unusedDashboards}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Unused metrics</span><b>{unusedMetrics}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Unused engines</span><b>{unusedEngines}</b></div>
      </CardContent>
    </Card>
  );
}
