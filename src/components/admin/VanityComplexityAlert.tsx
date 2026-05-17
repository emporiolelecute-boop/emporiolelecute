import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function VanityComplexityAlert({ items }: { items: { id: string; reason: string }[] }) {
  if (!items || items.length === 0) {
    return (
      <Alert>
        <AlertTitle className="text-sm">No vanity systems detected</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Every active surface is generating real operational signal.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="text-sm">Vanity / unused complexity ({items.length})</AlertTitle>
      <AlertDescription>
        <ul className="text-xs space-y-1 mt-2 max-h-40 overflow-auto">
          {items.slice(0, 10).map((i) => (
            <li key={i.id}><b>{i.id}</b> — {i.reason}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
