import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function SilentDegradationPanel({
  silent, authority, semantic, operational, velocity, risk,
}: { silent: number; authority: number; semantic: number; operational: number; velocity: number; risk: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Silent Degradation <Badge variant="outline">{risk}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Silent signals" value={silent} />
        <Row label="Authority decay" value={authority} />
        <Row label="Semantic erosion" value={semantic} />
        <Row label="Operational regression" value={operational} />
        <Row label="Degradation velocity" value={velocity} />
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
