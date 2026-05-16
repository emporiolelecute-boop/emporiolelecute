// Fase 8 — Checklist operacional de produto (não bloqueia save).
import { Check, X, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChecklistResult } from '@/lib/thinContent';

const STATUS_STYLE: Record<ChecklistResult['status'], { label: string; cls: string }> = {
  incompleto: { label: 'Incompleto', cls: 'bg-rose-100 text-rose-700' },
  basico:     { label: 'Básico',     cls: 'bg-amber-100 text-amber-700' },
  bom:        { label: 'Bom',        cls: 'bg-lime-100 text-lime-700' },
  excelente:  { label: 'Excelente',  cls: 'bg-emerald-100 text-emerald-700' },
};

const ProductSeoChecklist = ({ result }: { result: ChecklistResult }) => {
  const style = STATUS_STYLE[result.status];
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Checklist SEO operacional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style.cls}`}>
            {style.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {result.passed}/{result.total} itens · {result.percent}%
          </span>
        </div>
        <Progress value={result.percent} />
        <ul className="space-y-1.5 mt-2">
          {result.items.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              {item.passed ? (
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <X className="h-4 w-4 text-rose-500 shrink-0" />
              )}
              <span className={item.passed ? 'text-foreground' : 'text-muted-foreground'}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-muted-foreground pt-1">
          O checklist é apenas orientativo — não impede salvar o produto.
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductSeoChecklist;
