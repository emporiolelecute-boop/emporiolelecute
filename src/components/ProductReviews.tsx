// Fase 7 — Bloco visual de avaliações de produto
import { Star, BadgeCheck, ExternalLink } from 'lucide-react';
import { useProductReviews, useProductReviewStats } from '@/hooks/useProductReviews';

interface Props {
  productId: string;
}

const formatDate = (iso: string | null) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return ''; }
};

const Stars = ({ value }: { value: number }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} de 5 estrelas`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`h-4 w-4 ${n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`}
      />
    ))}
  </div>
);

const ProductReviews = ({ productId }: Props) => {
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const { data: stats } = useProductReviewStats(productId);

  if (isLoading) return null;
  if (!reviews.length) return null;

  return (
    <section className="mb-16" aria-labelledby="product-reviews-title">
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <h2 id="product-reviews-title" className="font-display text-2xl text-foreground">
          O que dizem nossas clientes
        </h2>
        {stats && (
          <div className="flex items-center gap-2 text-sm">
            <Stars value={Number(stats.avg_rating)} />
            <span className="font-semibold text-foreground">
              {Number(stats.avg_rating).toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({stats.review_count} {stats.review_count === 1 ? 'avaliação' : 'avaliações'})
            </span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <article
            key={r.id}
            className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{r.author_name}</span>
                  {r.is_verified && (
                    <BadgeCheck className="h-4 w-4 text-primary" aria-label="Avaliação verificada" />
                  )}
                </div>
                <div className="mt-1"><Stars value={r.rating} /></div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(r.review_date || r.created_at)}
              </span>
            </div>

            {r.comment && (
              <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
            )}

            {r.source && r.source !== 'manual' && (
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-muted rounded-full capitalize">{r.source}</span>
                {r.source_url && (
                  <a
                    href={r.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    Ver origem <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductReviews;
