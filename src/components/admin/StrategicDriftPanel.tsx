import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StrategicDriftPanel({
  drift, oscillation, memoryInconsistency,
}: { drift: number; oscillation: number; memoryInconsistency: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Strategic Drift</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Drift rate" value={drift} />
        <Row label="Oscillation" value={oscillation} />
        <Row label="Memory inconsistency" value={memoryInconsistency} />
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1"><span>{label}</span><span>{value}</span></div>
      <Progress value={value} />
    </div>
  );
}
