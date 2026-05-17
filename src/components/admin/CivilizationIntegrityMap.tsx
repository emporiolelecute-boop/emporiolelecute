import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CivilizationIntegrityMap({ integrity, ecosystem, governance, structural }: { integrity: number; ecosystem: number; governance: number; structural: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Civilization Integrity Map</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-4xl font-bold">{integrity}</div>
        {[
          { label: "Ecossistema", value: ecosystem },
          { label: "Governança", value: governance },
          { label: "Estrutural", value: structural },
        ].map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs mb-1"><span>{r.label}</span><span>{r.value}</span></div>
            <Progress value={r.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
