import { Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDbCategories } from "@/hooks/useProducts";
import { LucideIcon } from "@/components/LucideIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Elegant horizontal scroll of categories (Instagram-stories style).
 * Data 100% managed via admin (categories table: name, slug, image_url, icon, is_indexed, position).
 */
const CategoriesScroll = () => {
  const { data: categories, isLoading } = useDbCategories();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const visible = (categories ?? []).filter((c) => c.is_indexed !== false);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 600), behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-background" aria-label="Categorias">
      <div className="container mx-auto px-4">
        <h1 className="sr-only">Empório LeleCute - Lembrancinhas Artesanais Personalizadas</h1>

        <div className="relative group">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />

          {/* Arrows (desktop) */}
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Anterior"
            className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/95 backdrop-blur shadow-medium items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Próximo"
            className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/95 backdrop-blur shadow-medium items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex gap-5 md:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 shrink-0 snap-start">
                    <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                ))
              : visible.map((category, i) => (
                  <Link
                    key={category.id}
                    to={`/categoria/${category.slug}`}
                    aria-label={category.name}
                    className={cn(
                      "group/item flex flex-col items-center gap-3 shrink-0 snap-start",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${Math.min(i * 60, 480)}ms` }}
                  >
                    <div className="relative w-24 h-24 md:w-32 md:h-32">
                      {/* Animated gradient ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-primary-light to-accent p-[3px] transition-transform duration-500 group-hover/item:scale-105 group-hover/item:rotate-3">
                        <div className="w-full h-full rounded-full bg-background p-1">
                          <div className="relative w-full h-full rounded-full overflow-hidden bg-muted">
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20">
                                <LucideIcon
                                  name={category.icon}
                                  className="w-10 h-10 text-primary"
                                />
                              </div>
                            )}
                            {/* Soft overlay on hover */}
                            <div className="absolute inset-0 bg-foreground/0 group-hover/item:bg-foreground/15 transition-colors duration-300" />
                          </div>
                        </div>
                      </div>

                      {/* Floating icon badge */}
                      {category.icon && category.image_url && (
                        <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-background shadow-medium flex items-center justify-center ring-2 ring-primary/20 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:-rotate-6">
                          <LucideIcon name={category.icon} className="w-4 h-4 text-primary" />
                        </div>
                      )}

                      {/* Glow pulse */}
                      <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl opacity-0 group-hover/item:opacity-50 transition-opacity duration-500 -z-10" />
                    </div>

                    <span className="text-xs md:text-sm font-medium text-foreground text-center max-w-[7rem] truncate transition-colors group-hover/item:text-primary">
                      {category.name}
                    </span>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesScroll;
