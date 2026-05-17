import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { distortions: string[]; warnings: string[]; }
export default function RealityDistortionMap({ distortions, warnings }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Reality Distortions</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        {distortions.length === 0 && warnings.length === 0 && (
          <p className="text-muted-foreground">Nenhuma distorção relevante detectada.</p>
        )}
        {distortions.length > 0 && (
          <div>
            <p className="font-medium">Distortions</p>
            <ul>{distortions.map((d, i) => <li key={i}>• {d}</li>)}</ul>
          </div>
        )}
        {warnings.length > 0 && (
          <div>
            <p className="font-medium">Operational Warnings</p>
            <ul>{warnings.map((w, i) => <li key={i}>• {w}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
