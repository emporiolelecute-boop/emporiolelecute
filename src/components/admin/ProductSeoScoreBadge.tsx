// Fase 7.1 — Badge visual do score SEO de produto
import type { ProductSeoEvaluation } from '@/lib/productSeo';

const COLOR_MAP: Record<ProductSeoEvaluation['color'], string> = {
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  lime:    'bg-lime-100 text-lime-800 border-lime-300',
  amber:   'bg-amber-100 text-amber-800 border-amber-300',
  orange:  'bg-orange-100 text-orange-800 border-orange-300',
  rose:    'bg-rose-100 text-rose-800 border-rose-300',
};

export interface ProductSeoScoreBadgeProps {
  evaluation: ProductSeoEvaluation;
  showGrade?: boolean;
  className?: string;
}

const ProductSeoScoreBadge = ({ evaluation, showGrade = true, className = '' }: ProductSeoScoreBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${COLOR_MAP[evaluation.color]} ${className}`}
      title={`SEO ${evaluation.grade} — ${evaluation.score}/100`}
    >
      SEO {evaluation.score}
      {showGrade && <span className="opacity-80">· {evaluation.grade}</span>}
    </span>
  );
};

export default ProductSeoScoreBadge;
