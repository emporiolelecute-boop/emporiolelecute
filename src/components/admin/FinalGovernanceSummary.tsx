import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";

interface Props {
  governance: number;
  sustainable: number;
  liability: number;
  documentation: number;
  commercial: number;
  performance: number;
}

export function FinalGovernanceSummary({
  governance, sustainable, liability, documentation, commercial, performance,
}: Props) {
  const items = [
    { label: "Governance Maturity", value: governance },
    { label: "Sustainable Complexity", value: sustainable },
    { label: "Maintenance Liability", value: liability },
    { label: "Documentation Reliability", value: documentation },
    { label: "Commercial Leverage", value: commercial },
    { label: "Performance Pressure", value: performance },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Crown className="h-4 w-4 text-primary" /> Final Governance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.label} className="rounded-md border border-border/60 p-3">
              <div className="text-xs text-muted-foreground">{it.label}</div>
              <div className="text-2xl font-bold tabular-nums">{it.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
