import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  cross: number;
  strategic: number;
  operational: number;
  semantic: number;
  authority: number;
  governance: number;
  breakpoints: string[];
}

const cellClass = (v: number) =>
  v >= 75 ? "bg-emerald-500/15 text-emerald-700"
  : v >= 55 ? "bg-amber-500/15 text-amber-700"
  : "bg-rose-500/15 text-rose-700";

export default function CoherenceMatrixHeatmap({
  cross, strategic, operational, semantic, authority, governance, breakpoints,
}: Props) {
  const items = [
    { k: "Cross-Layer", v: cross },
    { k: "Strategic", v: strategic },
    { k: "Operational", v: operational },
    { k: "Semantic", v: semantic },
    { k: "Authority", v: authority },
    { k: "Governance", v: governance },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Coherence Matrix</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {items.map((it) => (
            <div key={it.k} className={`rounded p-3 ${cellClass(it.v)}`}>
              <div className="text-xs">{it.k}</div>
              <div className="text-xl font-bold">{it.v}</div>
            </div>
          ))}
        </div>
        {breakpoints.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            Quebras: {breakpoints.join(", ")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
