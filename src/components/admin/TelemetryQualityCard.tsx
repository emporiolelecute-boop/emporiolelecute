import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TelemetryQualityCard({
  quality, corruption, inconsistencies,
}: { quality: number; corruption: string[]; inconsistencies: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Telemetry Quality</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{quality}</div>
        <div>
          <p className="font-medium text-xs">Corrupção detectada</p>
          <ul className="list-disc pl-5 text-xs text-muted-foreground">
            {corruption.length === 0 && <li>—</li>}
            {corruption.slice(0, 6).map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div>
          <p className="font-medium text-xs">Inconsistências diagnósticas</p>
          <ul className="list-disc pl-5 text-xs text-muted-foreground">
            {inconsistencies.length === 0 && <li>—</li>}
            {inconsistencies.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
