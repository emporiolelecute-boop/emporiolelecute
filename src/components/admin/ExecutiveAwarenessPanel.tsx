import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { awareness: number; perception: number; warnings: string[]; }
export default function ExecutiveAwarenessPanel({ awareness, perception, warnings }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Awareness</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{awareness}</div>
        <p><span className="text-muted-foreground">Strategic Perception:</span> {perception}</p>
        {warnings.length > 0 && (
          <div className="mt-2">
            <p className="font-medium">Warnings</p>
            <ul>{warnings.map((w, i) => <li key={i}>• {w}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
