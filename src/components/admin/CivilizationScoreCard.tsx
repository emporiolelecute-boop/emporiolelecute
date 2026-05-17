import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CivilizationReport } from "@/lib/civilizationEngine";

export default function CivilizationScoreCard({ report }: { report: CivilizationReport }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Civilization Score <Badge variant="outline">{report.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-5xl font-bold">{report.score}</div>
        <p className="text-xs text-muted-foreground">{report.summary}</p>
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          <Row label="Survivability" v={report.survivability} />
          <Row label="Continuidade" v={report.semanticContinuity} />
          <Row label="Legado" v={report.authorityLegacy} />
          <Row label="Longevidade" v={report.strategicLongevity} />
          <Row label="Durabilidade" v={report.operationalDurability} />
          <Row label="Compounding" v={report.compounding} />
          <Row label="Integridade" v={report.integrity} />
        </div>
      </CardContent>
    </Card>
  );
}
function Row({ label, v }: { label: string; v: number }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><b>{v}</b></div>;
}
