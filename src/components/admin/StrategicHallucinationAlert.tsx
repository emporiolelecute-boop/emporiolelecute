import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Props { risk: number; falseConfidence: number; drivers: string[] }

export default function StrategicHallucinationAlert({ risk, falseConfidence, drivers }: Props) {
  const variant = risk >= 70 ? "destructive" : "default";
  return (
    <Alert variant={variant as never}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Strategic Hallucination Risk: {risk}</AlertTitle>
      <AlertDescription className="space-y-1">
        <p>False confidence score: <strong>{falseConfidence}</strong></p>
        {drivers.length > 0 && (
          <ul className="text-sm">{drivers.map((d, i) => <li key={i}>• {d}</li>)}</ul>
        )}
      </AlertDescription>
    </Alert>
  );
}
