import { Link } from "react-router-dom";
import { useCollections } from "@/hooks/useCollections";
import { optimizeImage } from "@/lib/image";

interface FeaturedCollectionsProps {
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

const FeaturedCollections = ({
  title = "Coleções em destaque",
  subtitle,
  maxItems = 6,
}: FeaturedCollectionsProps) => {
  const { data: collections, isLoading } = useCollections({ onlyHome: true, onlyActive: true });
  const items = (collections ?? [])
    .slice()
    .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0))
    .slice(0, Math.max(1, Math.min(maxItems, 12)));

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6">
          {items.map((c) => (
            <Link
              key={c.id}
              to={`/colecao/${c.slug}`}
              className="group relative block aspect-[4/3] rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-shadow"
            >
              {c.image_url ? (
                <img
                  src={optimizeImage(c.image_url, { width: 640, resize: "cover" })}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary/60 to-primary/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 text-background">
                <h3 className="font-display text-lg lg:text-xl font-semibold">{c.name}</h3>
                {c.description && (
                  <p className="text-xs lg:text-sm opacity-90 line-clamp-2 mt-1">{c.description}</p>
                )}
                {typeof c.product_count === "number" && c.product_count > 0 && (
                  <span className="text-[11px] uppercase tracking-wider opacity-80 mt-1 inline-block">
                    {c.product_count} {c.product_count === 1 ? "produto" : "produtos"}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
