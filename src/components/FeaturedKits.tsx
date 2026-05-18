// Sprint 3 Fase B — Bloco editorial de kits na home
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useKits, type KitBundleType } from "@/hooks/useKits";
import { optimizeImage } from "@/lib/image";
import { event as gaEvent } from "@/lib/analytics";
import { useHomeRegistry } from "@/contexts/HomeRegistry";

interface FeaturedKitsProps {
  title?: string;
  subtitle?: string;
  bundleType?: KitBundleType | "all";
  cta?: string;
  ctaPath?: string;
  maxItems?: number;
}

const FeaturedKits = ({
  title = "Monte seu kit",
  subtitle,
  bundleType = "all",
  cta = "Ver kit",
  ctaPath,
  maxItems = 3,
}: FeaturedKitsProps) => {
  const { data: kits, isLoading } = useKits({ onlyActive: true, onlyHome: true });
  const registry = useHomeRegistry();

  const items = useMemo(() => {
    const list = (kits ?? []).filter(
      (k) => bundleType === "all" || k.bundle_type === bundleType
    );
    // Sprint final — dedupe global: kits já mostrados em outros blocos saem.
    const remaining = new Set(registry.filterKits(list.map((k) => k.slug)));
    const filtered = list.filter((k) => remaining.has(k.slug));
    const pool = filtered.length > 0 ? filtered : list;
    const chosen = pool
      .slice()
      .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0))
      .slice(0, Math.max(1, Math.min(maxItems, 12)));
    registry.claimKits(chosen.map((k) => k.slug));
    return chosen;
  }, [kits, bundleType, maxItems, registry]);

  if (!isLoading && items.length === 0) return null;

  const handleClick = (slug: string, idx: number, type: KitBundleType) => {
    gaEvent("home_kit_click", {
      slug,
      position: idx,
      bundle_type: type,
      origin: "home",
    });
  };

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h2 className="text-2xl lg:text-3xl font-display font-semibold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground mt-2 max-w-xl">{subtitle}</p>
            )}
          </div>
          {ctaPath && (
            <Link
              to={ctaPath}
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {items.map((k, idx) => (
            <Link
              key={k.id}
              to={`/kit/${k.slug}`}
              onClick={() => handleClick(k.slug, idx, k.bundle_type)}
              className="group relative block aspect-[4/5] rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-shadow"
            >
              {k.image_url ? (
                <img
                  src={optimizeImage(k.image_url, { width: 720, resize: "cover" })}
                  alt={k.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/40 to-accent/30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 text-background">
                <span className="text-[10px] uppercase tracking-widest opacity-90">
                  {k.bundle_type === "premium" ? "Kit premium"
                    : k.bundle_type === "curated" ? "Curadoria"
                    : "Sugerido"}
                </span>
                <h3 className="font-display text-xl lg:text-2xl font-semibold mt-1">
                  {k.name}
                </h3>
                {k.description && (
                  <p className="text-sm opacity-90 line-clamp-2 mt-1">
                    {k.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium">
                  {cta} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedKits;
