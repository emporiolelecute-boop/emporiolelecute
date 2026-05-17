import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NoiseVsSignalGauge({
  signalToNoise, observabilityNoise, entropy, efficiency,
}: { signalToNoise: number; observabilityNoise: number; entropy: number; efficiency: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Noise vs Signal</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="text-3xl font-semibold">{signalToNoise}<span className="text-base text-muted-foreground">/100 SNR</span></div>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Observability noise" v={observabilityNoise} />
          <Stat label="Signal entropy" v={entropy} />
          <Stat label="Observability efficiency" v={efficiency} />
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
