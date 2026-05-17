import { Card } from "@/components/ui/card";

interface Props {
  consistency: number;
  operational: number;
  strategic: number;
  semantic: number;
  authority: number;
}

export default function SystemicConsistencyMatrix({ consistency, operational, strategic, semantic, authority }: Props) {
  const rows = [
    { label: "Operacional", value: operational },
    { label: "Estratégico", value: strategic },
    { label: "Semântico", value: semantic },
    { label: "Autoridade", value: authority },
  ];
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium">Systemic Consistency</p>
        <span className="text-2xl font-bold">{consistency}</span>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs"><span>{r.label}</span><b>{r.value}</b></div>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${r.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
