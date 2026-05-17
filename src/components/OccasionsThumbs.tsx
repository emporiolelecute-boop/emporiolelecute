import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDbOccasions } from "@/hooks/useProducts";
import { useAccessibleCarousel } from "@/hooks/useAccessibleCarousel";
import { LucideIcon } from "@/components/LucideIcon";
import { cn } from "@/lib/utils";

// Pool of fallback Lucide icons assigned by index when an occasion has
// neither image_url nor an explicit icon set in the DB.
const FALLBACK_ICONS = [
  "Gift", "Heart", "Cake", "PartyPopper", "Sparkles",
  "Baby", "Flower2", "Crown", "Star", "Bell",
  "Candy", "Ribbon",
];

const pickIcon = (o: { icon?: string | null }, i: number) =>
  o.icon && o.icon.length > 0 ? o.icon : FALLBACK_ICONS[i % FALLBACK_ICONS.length];

const ShimmerBlock = ({ className }: { className?: string }) => (
  <div className={cn("relative overflow-hidden bg-muted/70", className)}>
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(115deg, transparent 30%, hsl(var(--background) / 0.85) 50%, transparent 70%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s linear infinite",
      }}
      aria-hidden
    />
  </div>
);

const OccasionsThumbs = () => {
  const { data: occasions, isLoading } = useDbOccasions();
  const list = (occasions || []).filter((o: any) => o.is_indexed !== false).slice(0, 12);

  const {
    scrollerRef, itemsRef, activeIdx, canLeft, canRight, isDragging,
    scrollBy, onKeyDown, pointerHandlers,
  } = useAccessibleCarousel({
    storageKey: "occasionsThumbs:left",
    total: list.length,
    isLoading,
  });

  if (!isLoading && list.length === 0) return null;

  const activeName = list[activeIdx]?.name ?? "";
  const total = list.length;

  return (
    <section className="pb-8 md:pb-10 bg-background" aria-label="Ocasiões especiais">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-3 md:mb-4">
          <h2 className="font-display text-base md:text-xl text-foreground">
            Ocasiões <span className="font-script text-primary italic">Especiais</span>
          </h2>
          <Link to="/ocasioes" className="text-xs md:text-sm text-primary hover:underline">
            Ver todas
          </Link>
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {activeName ? `Ocasião em foco: ${activeName}. Item ${activeIdx + 1} de ${total}.` : ""}
        </div>

        <div className="relative group">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Ocasião anterior"
            disabled={!canLeft}
            className={cn(
              "hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/95 backdrop-blur shadow-medium items-center justify-center text-foreground transition-all",
              "hover:bg-primary hover:text-primary-foreground hover:scale-110",
              "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary",
              !canLeft && "!opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Próxima ocasião"
            disabled={!canRight}
            className={cn(
              "hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/95 backdrop-blur shadow-medium items-center justify-center text-foreground transition-all",
              "hover:bg-primary hover:text-primary-foreground hover:scale-110",
              "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary",
              !canRight && "!opacity-0 pointer-events-none"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div
            ref={scrollerRef}
            {...pointerHandlers}
            onKeyDown={onKeyDown}
            role="listbox"
            tabIndex={0}
            aria-label="Lista de ocasiões especiais — use as setas do teclado para navegar"
            aria-activedescendant={list[activeIdx]?.id ? `occ-item-${list[activeIdx].id}` : undefined}
            className={cn(
              "flex gap-3 md:gap-4 overflow-x-auto pb-2 -mx-2 px-2",
              "justify-start md:justify-center",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "[-webkit-overflow-scrolling:touch] [touch-action:pan-x] [overscroll-behavior-x:contain]",
              "snap-x snap-mandatory scroll-smooth",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
              isDragging ? "cursor-grabbing select-none" : "md:cursor-grab"
            )}
          >
            {(isLoading ? Array.from({ length: 8 }) : list).map((o: any, i) => {
              if (!o) {
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 snap-start">
                    <ShimmerBlock className="w-16 h-16 md:w-20 md:h-20 rounded-2xl" />
                    <ShimmerBlock className="w-10 h-2.5 rounded-full" />
                  </div>
                );
              }
              const isActive = i === activeIdx;
              const iconName = pickIcon(o, i);
              return (
                <Link
                  key={o.id || o.slug}
                  id={`occ-item-${o.id || o.slug}`}
                  ref={(el) => { itemsRef.current[i] = el; }}
                  to={`/produtos?ocasiao=${o.slug}`}
                  role="option"
                  aria-selected={isActive}
                  aria-current={isActive ? "true" : undefined}
                  aria-setsize={total}
                  aria-posinset={i + 1}
                  aria-label={`${o.name} — ocasião ${i + 1} de ${total}${isActive ? ", em foco" : ""}`}
                  tabIndex={isActive ? 0 : -1}
                  draggable={false}
                  className={cn(
                    "group shrink-0 flex flex-col items-center gap-1.5 snap-start outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary/60 rounded-2xl"
                  )}
                >
                  <div
                    className={cn(
                      "relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/20 ring-1 ring-border/60 transition-all duration-300 group-hover:ring-primary group-hover:-translate-y-0.5 group-hover:shadow-medium animate-pingpong",
                      isActive && "ring-primary scale-105 shadow-medium"
                    )}
                    style={{ animationDelay: `${(i % 5) * 0.5}s`, animationDuration: `${6 + (i % 4) * 1.5}s` }}
                  >
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
                          name={iconName}
                          className="w-6 h-6 md:w-7 md:h-7 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                        />
                      </div>
                    )}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(115deg, transparent 30%, hsl(var(--background) / 0.55) 50%, transparent 70%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.6s linear infinite",
                      }}
                      aria-hidden
                    />
                    <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10 animate-pulse-slow" aria-hidden />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] md:text-xs font-medium text-center max-w-[5.5rem] truncate transition-colors",
                      isActive ? "text-primary" : "text-foreground/80 group-hover:text-primary"
                    )}
                  >
                    {o.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OccasionsThumbs;
