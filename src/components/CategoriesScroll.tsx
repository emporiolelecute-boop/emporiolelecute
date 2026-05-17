import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDbCategories } from "@/hooks/useProducts";
import { LucideIcon } from "@/components/LucideIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Elegant, lively horizontal scroll of categories (Instagram-stories style).
 * - Native touch swipe on mobile (overflow-x with snap + momentum)
 * - Pointer drag-to-scroll on desktop (mouse / trackpad)
 * - Continuous "alive" micro-animations: floating, rotating gradient ring, glow pulse, shimmer
 * Data 100% managed via admin (categories table).
 */
const CategoriesScroll = () => {
  const { data: categories, isLoading } = useDbCategories();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const visible = (categories ?? []).filter((c) => c.is_indexed !== false);

  // ---------- Drag-to-scroll (desktop pointer) ----------
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only enable drag for mouse / pen — let touch use native momentum scroll.
    if (e.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: 0 };
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.abs(dx);
    el.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
    const el = scrollerRef.current;
    if (el) {
      try { el.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    }
  };

  // Block click after a real drag (avoid accidental navigation)
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = 0;
    }
  };

  // ---------- Arrow controls + scroll progress ----------
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, visible.length]);

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
            disabled={!canLeft}
            className={cn(
              "hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/95 backdrop-blur shadow-medium items-center justify-center text-foreground transition-all",
              "hover:bg-primary hover:text-primary-foreground hover:scale-110",
              "opacity-0 group-hover:opacity-100",
              !canLeft && "!opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Próximo"
            disabled={!canRight}
            className={cn(
              "hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/95 backdrop-blur shadow-medium items-center justify-center text-foreground transition-all",
              "hover:bg-primary hover:text-primary-foreground hover:scale-110",
              "opacity-0 group-hover:opacity-100",
              !canRight && "!opacity-0 pointer-events-none"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onClickCapture}
            className={cn(
              "flex gap-5 md:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "[-webkit-overflow-scrolling:touch] [touch-action:pan-x] [overscroll-behavior-x:contain]",
              isDragging ? "cursor-grabbing select-none" : "md:cursor-grab"
            )}
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
                    draggable={false}
                    className={cn(
                      "group/item flex flex-col items-center gap-3 shrink-0 snap-start",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${Math.min(i * 60, 480)}ms` }}
                  >
                    <div
                      className="relative w-24 h-24 md:w-32 md:h-32 animate-bounce-soft"
                      style={{ animationDelay: `${(i % 5) * 0.35}s`, animationDuration: `${3 + (i % 3) * 0.4}s` }}
                    >
                      {/* Rotating conic gradient ring */}
                      <div
                        className="absolute -inset-[2px] rounded-full opacity-80 group-hover/item:opacity-100 transition-opacity duration-500 animate-spin-slow"
                        style={{
                          background:
                            "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary-light, var(--primary))), hsl(var(--primary)))",
                          animationDuration: `${10 + (i % 4) * 2}s`,
                        }}
                        aria-hidden
                      />

                      {/* Static gradient ring + inner content */}
                      <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-primary via-primary-light to-accent p-[3px] transition-transform duration-500 group-hover/item:scale-105 group-hover/item:-rotate-3">
                        <div className="w-full h-full rounded-full bg-background p-1">
                          <div className="relative w-full h-full rounded-full overflow-hidden bg-muted">
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                loading="lazy"
                                decoding="async"
                                draggable={false}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20">
                                <LucideIcon
                                  name={category.icon}
                                  className="w-10 h-10 text-primary transition-transform duration-500 group-hover/item:scale-110 group-hover/item:rotate-6"
                                />
                              </div>
                            )}
                            {/* Shimmer sweep on hover */}
                            <div
                              className="pointer-events-none absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"
                              style={{
                                background:
                                  "linear-gradient(115deg, transparent 30%, hsl(var(--background) / 0.55) 50%, transparent 70%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.6s linear infinite",
                              }}
                              aria-hidden
                            />
                            {/* Soft darken on hover */}
                            <div className="absolute inset-0 bg-foreground/0 group-hover/item:bg-foreground/10 transition-colors duration-300" />
                          </div>
                        </div>
                      </div>

                      {/* Floating icon badge */}
                      {category.icon && category.image_url && (
                        <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-background shadow-medium flex items-center justify-center ring-2 ring-primary/20 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:-rotate-12">
                          <LucideIcon name={category.icon} className="w-4 h-4 text-primary" />
                        </div>
                      )}

                      {/* Glow pulse */}
                      <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl opacity-20 group-hover/item:opacity-70 transition-opacity duration-500 -z-10 animate-pulse-slow" />
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
