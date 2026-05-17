import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StrategicEquilibriumPanel({
  equilibrium, integrity, persistence,
}: { equilibrium: number; integrity: number; persistence: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Strategic Equilibrium</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Equilibrium" value={equilibrium} />
        <Row label="Integrity" value={integrity} />
        <Row label="Persistence" value={persistence} />
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
