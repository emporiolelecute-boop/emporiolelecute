import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategicAlignmentPanel({
  alignment, systemic, persistence,
}: { alignment: number; systemic: number; persistence: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Strategic Alignment</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Alignment" v={alignment} />
          <Stat label="Systemic" v={systemic} />
          <Stat label="Persistence" v={persistence} />
        </div>
        <p className="text-muted-foreground">
          Composite cross-engine alignment. Stable above 70/100.
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
