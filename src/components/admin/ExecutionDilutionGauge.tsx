import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExecutionDilutionGauge({ dilution, waste, noise }: { dilution: number; waste: number; noise: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Execution Dilution</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{dilution}</div>
        <p className="text-xs text-muted-foreground">Diluição operacional (menor é melhor)</p>
        <div className="flex justify-between"><span className="text-muted-foreground">Desperdício</span><b>{waste}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Ruído de execução</span><b>{noise}</b></div>
      </CardContent>
    </Card>
  );
}
