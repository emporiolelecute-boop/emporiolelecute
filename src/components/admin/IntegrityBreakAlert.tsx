import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function IntegrityBreakAlert({ breaks }: { breaks: string[] }) {
  if (!breaks || breaks.length === 0) {
    return (
      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>No integrity breaks detected</AlertTitle>
        <AlertDescription>Strategic Integrity Grid is operating within nominal bounds.</AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Integrity breaks detected</AlertTitle>
      <AlertDescription>
        <div className="flex flex-wrap gap-1 mt-2">
          {breaks.map((b) => <Badge key={b} variant="destructive">{b}</Badge>)}
        </div>
      </AlertDescription>
    </Alert>
  );
}
