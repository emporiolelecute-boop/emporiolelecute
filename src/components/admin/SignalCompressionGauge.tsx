import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignalCompressionGauge({
  efficiency, redundancy, loss, overloads,
}: { efficiency: number; redundancy: number; loss: number; overloads: string[] }) {
  const tone = efficiency >= 70 ? "text-emerald-600" : efficiency >= 50 ? "text-amber-600" : "text-red-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Compressão de Sinais</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-5xl font-bold ${tone}`}>{efficiency}</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-muted-foreground">Redundância:</span> <strong>{redundancy}</strong></div>
          <div><span className="text-muted-foreground">Perda:</span> <strong>{loss}</strong></div>
        </div>
        {overloads.length > 0 && (
          <p className="text-xs text-amber-700">Sobrecarga: {overloads.join(", ")}</p>
        )}
      </CardContent>
    </Card>
  );
}
