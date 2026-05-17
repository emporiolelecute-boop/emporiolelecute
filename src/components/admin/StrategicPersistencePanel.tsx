import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategicPersistencePanel({
  persistence, resilience, continuity,
}: { persistence: number; resilience: number; continuity: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Strategic Persistence</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Persistence" v={persistence} />
          <Stat label="Resilience" v={resilience} />
          <Stat label="Continuity" v={continuity} />
        </div>
        <p className="text-muted-foreground">
          Longitudinal coherence durability. Higher values indicate stronger long-term alignment.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{v}<span className="text-sm text-muted-foreground">/100</span></div>
    </div>
  );
}
