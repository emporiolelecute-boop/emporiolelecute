import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Props { items: Array<{ name: string; complexity: number; valueScore: number }> }

export function ComplexityWithoutValueAlert({ items }: Props) {
  if (!items.length) {
    return (
      <Alert>
        <AlertTitle>No high-complexity / low-value items</AlertTitle>
        <AlertDescription>System within sustainable envelope.</AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Complexity Without Value ({items.length})</AlertTitle>
      <AlertDescription>
        <ul className="mt-2 text-xs space-y-1 list-disc pl-4">
          {items.slice(0, 8).map((i) => (
            <li key={i.name}>{i.name} — complexity {i.complexity}, value {i.valueScore}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
