import { Card } from "@/components/ui/card";

export default function StrategicGovernabilityGauge({ governability, alignment, focus }: { governability: number; alignment: number; focus: number }) {
  return (
    <Card className="p-4 space-y-2">
      <p className="text-base font-medium">Strategic Governability</p>
      <div className="text-5xl font-bold">{governability}</div>
      <p className="text-xs text-muted-foreground">Alinhamento <b>{alignment}</b> · Foco <b>{focus}</b></p>
      <div className="h-2 bg-muted rounded overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${governability}%` }} />
      </div>
    </Card>
  );
}
