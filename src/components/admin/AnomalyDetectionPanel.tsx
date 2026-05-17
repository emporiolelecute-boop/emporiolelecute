import { Card } from "@/components/ui/card";
import type { Anomaly } from "@/lib/anomalyDetection";

export default function AnomalyDetectionPanel({
  anomalies, riskScore,
}: { anomalies: Anomaly[]; riskScore: number }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium">Anomaly Detection</p>
        <span className="text-2xl font-bold">{riskScore}</span>
      </div>
      {anomalies.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sem anomalias.</p>
      ) : (
        <ul className="space-y-1 text-xs">
          {anomalies.slice(0, 10).map((a, i) => (
            <li key={`${a.metric}-${i}`} className="flex justify-between">
              <span>{a.metric} ({a.category})</span>
              <span className="font-mono uppercase">{a.risk}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
