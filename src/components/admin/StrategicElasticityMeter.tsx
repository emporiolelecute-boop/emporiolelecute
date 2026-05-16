import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StrategicElasticityMeter({ elasticity, rigidity }: { elasticity: number; rigidity: number }) {
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium text-sm">Elasticidade Estratégica</h4>
      <div><div className="flex justify-between text-xs mb-1"><span>Elasticidade</span><span>{elasticity}</span></div><Progress value={elasticity} /></div>
      <div><div className="flex justify-between text-xs mb-1"><span>Rigidez</span><span>{rigidity}</span></div><Progress value={rigidity} /></div>
    </Card>
  );
}
