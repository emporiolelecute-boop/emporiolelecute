import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  selfConflict: number;
  contradiction: number;
  overconfidence: number;
  falseConfidence: number;
}

const tone = (v: number) =>
  v >= 65 ? "bg-rose-500/15 text-rose-700"
  : v >= 40 ? "bg-amber-500/15 text-amber-700"
  : "bg-emerald-500/15 text-emerald-700";

export default function SelfConflictMatrix(p: Props) {
  const items = [
    { k: "Self-Conflict", v: p.selfConflict },
    { k: "Contradiction", v: p.contradiction },
    { k: "Overconfidence", v: p.overconfidence },
    { k: "False Confidence", v: p.falseConfidence },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Self-Conflict Matrix</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {items.map((it) => (
            <div key={it.k} className={`rounded p-3 ${tone(it.v)}`}>
              <div className="text-xs">{it.k}</div>
              <div className="text-xl font-bold">{it.v}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
