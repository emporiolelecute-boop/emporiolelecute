import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthorityInstabilityCard({ instability, persistence, dispersion }: { instability: number; persistence: number; dispersion: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Authority Stability</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{instability}</div>
        <p className="text-xs text-muted-foreground">Instabilidade (menor é melhor)</p>
        <div className="flex justify-between"><span className="text-muted-foreground">Persistência</span><b>{persistence}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Dispersão</span><b>{dispersion}</b></div>
      </CardContent>
    </Card>
  );
}
