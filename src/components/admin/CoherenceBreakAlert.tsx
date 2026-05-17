import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Boxes } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CoherenceBreakAlert({ breaks }: { breaks: string[] }) {
  if (!breaks || breaks.length === 0) {
    return (
      <Alert>
        <Boxes className="h-4 w-4" />
        <AlertTitle>No coherence breaks detected</AlertTitle>
        <AlertDescription>Strategic Coherence Matrix is operating within nominal bounds.</AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="destructive">
      <Boxes className="h-4 w-4" />
      <AlertTitle>Coherence breaks detected</AlertTitle>
      <AlertDescription>
        <div className="flex flex-wrap gap-1 mt-2">
          {breaks.map((b) => <Badge key={b} variant="destructive">{b}</Badge>)}
        </div>
      </AlertDescription>
    </Alert>
  );
}
