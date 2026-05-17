import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KernelReport } from "@/lib/seoKernel";

export default function KernelCoherenceCard({ report }: { report: KernelReport }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Kernel Coherence <Badge variant="outline">{report.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-5xl font-bold">{report.coherence}</div>
        <p className="text-xs text-muted-foreground">{report.summary}</p>
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          <Row label="Compressão" v={report.compression} />
          <Row label="Orquestração" v={report.orchestration} />
          <Row label="Manutenibilidade" v={report.maintainability} />
          <Row label="Entropia" v={report.entropy} />
          <Row label="Redundância" v={report.redundancy} />
          <Row label="Overlap" v={report.overlap} />
        </div>
      </CardContent>
    </Card>
  );
}
function Row({ label, v }: { label: string; v: number }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><b>{v}</b></div>;
}
