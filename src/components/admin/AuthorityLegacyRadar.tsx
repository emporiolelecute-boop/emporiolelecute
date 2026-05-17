import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AuthorityLegacyRadar({ legacy, persistence, balance, instability }: { legacy: number; persistence: number; balance: number; instability: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Authority Legacy</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-4xl font-bold">{legacy}</div>
        {[
          { label: "Persistência", value: persistence },
          { label: "Balanço", value: balance },
          { label: "Instabilidade", value: instability },
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
