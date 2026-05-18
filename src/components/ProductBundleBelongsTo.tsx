import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useKitsContainingProduct } from "@/hooks/useKits";

interface Props {
  productId: string | undefined;
}

const BUNDLE_LABEL: Record<string, string> = {
  suggested: "Kit sugerido",
  curated: "Kit curado",
  premium: "Kit premium",
};

/** Mostra os kits ativos dos quais o produto atual faz parte. */
export default function ProductBundleBelongsTo({ productId }: Props) {
  const { data: kits } = useKitsContainingProduct(productId);

  if (!kits || kits.length === 0) return null;

  return (
    <section className="mb-10" aria-labelledby="bundle-belongs-title">
      <h2 id="bundle-belongs-title" className="font-display text-xl text-foreground mb-1 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        Faz parte destes kits
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Composições prontas que já incluem este produto — ideais para presentear ocasiões completas.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {kits.slice(0, 4).map((k) => (
          <Link
            key={k.id}
            to={`/kit/${k.slug}`}
            className="group flex items-center gap-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors p-3"
          >
            <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center">
              {k.image_url ? (
                <img src={k.image_url} alt={k.name} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <Package className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="text-[10px] mb-1">
                {BUNDLE_LABEL[k.bundle_type] || "Kit"}
              </Badge>
              <p className="font-medium truncate group-hover:text-primary transition-colors">{k.name}</p>
              {k.description && <p className="text-xs text-muted-foreground line-clamp-1">{k.description}</p>}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
      {kits.length > 0 && (
        <div className="mt-3">
          <Button asChild variant="outline" size="sm">
            <Link to={`/kit/${kits[0].slug}`}>
              Ver kit completo
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
