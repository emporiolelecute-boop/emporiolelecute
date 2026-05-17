import { Card } from "@/components/ui/card";

export default function AuthorityBalanceGauge({ balance, instability, overcentralization }: { balance: number; instability: number; overcentralization: number }) {
  return (
    <Card className="p-4 space-y-2">
      <p className="text-base font-medium">Authority Balance</p>
      <div className="text-5xl font-bold">{balance}</div>
      <p className="text-xs text-muted-foreground">Instabilidade <b>{instability}</b> · Sobrecentralização <b>{overcentralization}</b></p>
      <div className="h-2 bg-muted rounded overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${balance}%` }} />
      </div>
    </Card>
  );
}
