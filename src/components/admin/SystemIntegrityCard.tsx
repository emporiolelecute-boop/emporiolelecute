import { Card } from "@/components/ui/card";

export default function SystemIntegrityCard({
  integrity, viability, entropy,
}: { integrity: number; viability: number; entropy: number }) {
  return (
    <Card className="p-4 space-y-3">
      <p className="text-base font-medium">System Integrity</p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div><div className="text-3xl font-bold">{integrity}</div><p className="text-xs text-muted-foreground">integrity</p></div>
        <div><div className="text-3xl font-bold">{viability}</div><p className="text-xs text-muted-foreground">viability</p></div>
        <div><div className="text-3xl font-bold">{entropy}</div><p className="text-xs text-muted-foreground">entropy</p></div>
      </div>
    </Card>
  );
}
