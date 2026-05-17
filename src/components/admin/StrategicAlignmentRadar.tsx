import { Card } from "@/components/ui/card";

export default function StrategicAlignmentRadar({
  alignment, consensus, coherence,
}: { alignment: number; consensus: number; coherence: number }) {
  return (
    <Card className="p-4 space-y-3">
      <p className="text-base font-medium">Strategic Alignment</p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div><div className="text-3xl font-bold">{alignment}</div><p className="text-xs text-muted-foreground">alignment</p></div>
        <div><div className="text-3xl font-bold">{consensus}</div><p className="text-xs text-muted-foreground">consensus</p></div>
        <div><div className="text-3xl font-bold">{coherence}</div><p className="text-xs text-muted-foreground">coherence</p></div>
      </div>
    </Card>
  );
}
