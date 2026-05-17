import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExecutionSustainabilityCard({
  sustainability, harmony, overload, drag, thrashing,
}: { sustainability: number; harmony: number; overload: number; drag: number; thrashing: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Execution Sustainability</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="text-3xl font-semibold">{sustainability}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Stat label="Operational harmony" v={harmony} />
          <Stat label="Overload pressure" v={overload} />
          <Stat label="Operational drag" v={drag} />
          <Stat label="Strategic thrashing" v={thrashing} />
        </div>
      </CardContent>
    </Card>
  );
}
function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}<span className="text-xs text-muted-foreground">/100</span></div>
    </div>
  );
}
