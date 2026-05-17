import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StrategicSignalRadar({
  strategic, operational, semantic, authority, governance,
}: {
  strategic: number; operational: number; semantic: number; authority: number; governance: number;
}) {
  const items = [
    { label: "Estratégico", value: strategic },
    { label: "Operacional", value: operational },
    { label: "Semântico", value: semantic },
    { label: "Autoridade", value: authority },
    { label: "Governança", value: governance },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Radar de Clareza de Sinais</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => (
          <div key={it.label}>
            <div className="flex justify-between text-xs mb-1"><span>{it.label}</span><span>{it.value}</span></div>
            <Progress value={it.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
