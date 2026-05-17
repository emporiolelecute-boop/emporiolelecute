import { Link } from "react-router-dom";
import { useDbOccasions } from "@/hooks/useProducts";
import { LucideIcon } from "@/components/LucideIcon";
import { cn } from "@/lib/utils";

/**
 * Compact horizontal "thumbs" row of special occasions, placed right under
 * the categories scroller. 100% admin-managed (occasions table).
 */
const OccasionsThumbs = () => {
  const { data: occasions, isLoading } = useDbOccasions();
  const list = (occasions || []).filter((o: any) => o.is_indexed !== false).slice(0, 12);

  if (!isLoading && list.length === 0) return null;

  return (
    <section className="pb-8 md:pb-10 bg-background" aria-label="Ocasiões especiais">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-3 md:mb-4">
          <h2 className="font-display text-base md:text-xl text-foreground">
            Ocasiões <span className="font-script text-primary italic">Especiais</span>
          </h2>
          <Link
            to="/ocasioes"
            className="text-xs md:text-sm text-primary hover:underline"
          >
            Ver todas
          </Link>
        </div>

        <div
          className={cn(
            "flex gap-3 md:gap-4 overflow-x-auto pb-2 -mx-2 px-2",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "[-webkit-overflow-scrolling:touch] [touch-action:pan-x] [overscroll-behavior-x:contain]",
            "snap-x snap-mandatory"
          )}
        >
          {(isLoading ? Array.from({ length: 8 }) : list).map((o: any, i) => {
            if (!o) {
              return (
                <div
                  key={i}
                  className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-muted animate-pulse snap-start"
                />
              );
            }
            return (
              <Link
                key={o.id || o.slug}
                to={`/produtos?ocasiao=${o.slug}`}
                aria-label={o.name}
                className="group shrink-0 flex flex-col items-center gap-1.5 snap-start"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/20 ring-1 ring-border/60 transition-all duration-300 group-hover:ring-primary group-hover:-translate-y-0.5 group-hover:shadow-medium">
                  {o.image_url ? (
                    <img
                      src={o.image_url}
                      alt={o.name}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LucideIcon
                        name={o.icon || "Sparkles"}
                        className="w-6 h-6 md:w-7 md:h-7 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                      />
                    </div>
                  )}
                </div>
                <span className="text-[10px] md:text-xs font-medium text-foreground/80 text-center max-w-[5.5rem] truncate group-hover:text-primary transition-colors">
                  {o.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OccasionsThumbs;
