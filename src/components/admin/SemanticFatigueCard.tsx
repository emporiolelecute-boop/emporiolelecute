import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SemanticFatigueCard({ fatigue, saturation, exhaustion }: { fatigue: number; saturation: number; exhaustion: number }) {
  const tone = fatigue >= 60 ? "text-red-600" : fatigue >= 40 ? "text-amber-600" : "text-emerald-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Fadiga Semântica</CardTitle></CardHeader>
      <CardContent>
        <div className={`text-5xl font-bold ${tone}`}>{fatigue}</div>
        <div className="grid grid-cols-2 gap-2 text-sm mt-4">
          <div className="rounded-md border p-2"><div className="text-xs text-muted-foreground">Saturação</div><div className="text-xl font-semibold">{saturation}</div></div>
          <div className="rounded-md border p-2"><div className="text-xs text-muted-foreground">Exaustão</div><div className="text-xl font-semibold">{exhaustion}</div></div>
        </div>
      </CardContent>
    </Card>
  );
}
