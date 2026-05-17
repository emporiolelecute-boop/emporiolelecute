import { Card } from "@/components/ui/card";

export default function OperationalPredictabilityCard({ predictability, efficiency, noise }: { predictability: number; efficiency: number; noise: number }) {
  return (
    <Card className="p-4 space-y-2">
      <p className="text-base font-medium">Operational Predictability</p>
      <div className="text-5xl font-bold">{predictability}</div>
      <p className="text-xs text-muted-foreground">Eficiência <b>{efficiency}</b> · Ruído <b>{noise}</b></p>
      <div className="h-2 bg-muted rounded overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${predictability}%` }} />
      </div>
    </Card>
  );
}
