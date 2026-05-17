import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardNoiseMatrix({ noise, idle, total }: {
  noise: number; idle: number; total: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Dashboard Noise</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{noise}</div>
        <div className="flex justify-between"><span className="text-muted-foreground">Inativos</span><b>{idle}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Total</span><b>{total}</b></div>
        <p className="text-xs text-muted-foreground">
          {noise > 50 ? "Considerar consolidar dashboards inativos." : "Sinal/ruído dentro do envelope."}
        </p>
      </CardContent>
    </Card>
  );
}
