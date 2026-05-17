import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { harmony: number; synchronization: number; flow: number; conflicts: string[]; }
export default function OperationalHarmonyPanel({ harmony, synchronization, flow, conflicts }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Harmony</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{harmony}</div>
        <p><span className="text-muted-foreground">Execution Synchronization:</span> {synchronization}</p>
        <p><span className="text-muted-foreground">Operational Flow:</span> {flow}</p>
        {conflicts.length > 0 && (
          <ul className="mt-2">{conflicts.map((c, i) => <li key={i}>• {c}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
