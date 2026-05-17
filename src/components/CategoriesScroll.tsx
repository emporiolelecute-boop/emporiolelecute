import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDbCategories } from "@/hooks/useProducts";
import { LucideIcon } from "@/components/LucideIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const SCROLL_KEY = "categoriesScroll:left";
// Threshold (px) for the most-visible card to change before we update
// activeIdx. Avoids flicker on tiny scroll deltas.
const ACTIVE_SWITCH_THRESHOLD = 24;

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
};

const CategoriesScroll = () => {
  const { data: categories, isLoading } = useDbCategories();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const reducedMotion = usePrefersReducedMotion();

  const visible = (categories ?? []).filter((c) => c.is_indexed !== false);

  // ---------- Drag-to-scroll (desktop pointer) ----------
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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

  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = 0;
    }
  };

  // ---------- Arrow controls, active index, scroll persistence ----------
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const lastActiveRef = useRef(0);
  const lastBestDistRef = useRef(Infinity);
  const persistRaf = useRef<number | null>(null);

  const updateState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);

    // Determine most-visible item (closest center to viewport center)
    const center = el.scrollLeft + el.clientWidth / 2;
    let bestIdx = lastActiveRef.current;
    let bestDist = Infinity;
    itemsRef.current.forEach((node, i) => {
      if (!node) return;
      const c = node.offsetLeft + node.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });

    // Debounce: only switch active when the new candidate is meaningfully
    // closer than the current one (avoids flicker on tiny scroll deltas).
    if (
      bestIdx !== lastActiveRef.current &&
      Math.abs(bestDist - lastBestDistRef.current) > ACTIVE_SWITCH_THRESHOLD
    ) {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate?.(8); } catch { /* noop */ }
      }
      lastActiveRef.current = bestIdx;
      lastBestDistRef.current = bestDist;
      setActiveIdx(bestIdx);
    } else if (bestIdx === lastActiveRef.current) {
      lastBestDistRef.current = bestDist;
    }

    // Persist scroll position (session + local), throttled via rAF.
    if (persistRaf.current == null) {
      persistRaf.current = requestAnimationFrame(() => {
        persistRaf.current = null;
        const left = String(el.scrollLeft);
        try { sessionStorage.setItem(SCROLL_KEY, left); } catch { /* noop */ }
        try { localStorage.setItem(SCROLL_KEY, left); } catch { /* noop */ }
      });
    }
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState, visible.length]);

  // Restore scroll position after items render (session wins; falls back to local).
  useEffect(() => {
    if (isLoading || visible.length === 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    try {
      const saved =
        sessionStorage.getItem(SCROLL_KEY) ?? localStorage.getItem(SCROLL_KEY);
      if (saved) {
        const n = parseInt(saved, 10);
        if (!Number.isNaN(n)) el.scrollLeft = n;
      }
    } catch { /* noop */ }
  }, [isLoading, visible.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 600), behavior: "smooth" });
  };

  const activeName = visible[activeIdx]?.name ?? "";
  const total = visible.length;

  return (
    <section className="py-6 md:py-12 bg-background" aria-label="Categorias">
      <div className="container mx-auto px-4">
        <h1 className="sr-only">Empório LeleCute - Lembrancinhas Artesanais Personalizadas</h1>

        {/* Live region — announces active category to screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {activeName
            ? `Categoria em foco: ${activeName}. Item ${activeIdx + 1} de ${total}.`
            : ""}
        </div>

        <div className="relative group">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-12 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-12 bg-gradient-to-l from-background to-transparent z-10" />

          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Categoria anterior"
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
            aria-label="Próxima categoria"
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
            role="listbox"
            aria-label="Lista de categorias"
            aria-activedescendant={visible[activeIdx]?.id ? `cat-item-${visible[activeIdx].id}` : undefined}
            className={cn(
              "flex gap-3 md:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 md:pb-4 px-1 md:px-2",
              // Center the items horizontally when there are few; still scrolls when overflowing.
              "justify-start md:justify-center",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "[-webkit-overflow-scrolling:touch] [touch-action:pan-x] [overscroll-behavior-x:contain]",
              isDragging ? "cursor-grabbing select-none" : "md:cursor-grab"
            )}
          >
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 shrink-0 snap-start">
                    <Skeleton className="w-16 h-16 md:w-32 md:h-32 rounded-full" />
                    <Skeleton className="w-12 h-3" />
                  </div>
                ))
              : visible.map((category, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <Link
                      key={category.id}
                      id={`cat-item-${category.id}`}
                      ref={(el) => { itemsRef.current[i] = el; }}
                      to={`/categoria/${category.slug}`}
                      role="option"
                      aria-selected={isActive}
                      aria-label={`${category.name} — categoria ${i + 1} de ${total}${isActive ? ", em foco" : ""}`}
                      aria-current={isActive ? "true" : undefined}
                      aria-setsize={total}
                      aria-posinset={i + 1}
                      draggable={false}
                      className={cn(
                        "group/item flex flex-col items-center gap-1.5 md:gap-3 shrink-0 snap-start",
                        "animate-fade-in"
                      )}
                      style={{ animationDelay: `${Math.min(i * 60, 480)}ms` }}
                    >
                      <div
                        className={cn(
                          "relative w-16 h-16 md:w-32 md:h-32 transition-transform duration-500",
                          !reducedMotion && "md:animate-pingpong",
                          isActive && "scale-105 md:scale-110"
                        )}
                        style={
                          reducedMotion
                            ? undefined
                            : { animationDelay: `${(i % 5) * 0.6}s`, animationDuration: `${7 + (i % 4) * 1.5}s` }
                        }
                      >
                        <div
                          className={cn(
                            "absolute -inset-[2px] rounded-full transition-opacity duration-500",
                            !reducedMotion && "animate-spin-slow",
                            isActive ? "opacity-100" : "opacity-70 group-hover/item:opacity-100"
                          )}
                          style={{
                            background:
                              "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary-light, var(--primary))), hsl(var(--primary)))",
                            animationDuration: `${10 + (i % 4) * 2}s`,
                          }}
                          aria-hidden
                        />

                        <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-primary via-primary-light to-accent p-[2px] md:p-[3px] transition-transform duration-500 group-hover/item:scale-105 group-hover/item:-rotate-3">
                          <div className="w-full h-full rounded-full bg-background p-0.5 md:p-1">
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
                                    className="w-6 h-6 md:w-10 md:h-10 text-primary transition-transform duration-500 group-hover/item:scale-110 group-hover/item:rotate-6"
                                  />
                                </div>
                              )}
                              <div
                                className="pointer-events-none absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"
                                style={{
                                  background:
                                    "linear-gradient(115deg, transparent 30%, hsl(var(--background) / 0.55) 50%, transparent 70%)",
                                  backgroundSize: "200% 100%",
                                  animation: reducedMotion ? undefined : "shimmer 1.6s linear infinite",
                                }}
                                aria-hidden
                              />
                              <div className="absolute inset-0 bg-foreground/0 group-hover/item:bg-foreground/10 transition-colors duration-300" />
                            </div>
                          </div>
                        </div>

                        {category.icon && category.image_url && (
                          <div className="hidden md:flex absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-background shadow-medium items-center justify-center ring-2 ring-primary/20 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:-rotate-12">
                            <LucideIcon name={category.icon} className="w-4 h-4 text-primary" />
                          </div>
                        )}

                        <div
                          className={cn(
                            "absolute inset-0 rounded-full bg-primary/30 blur-2xl transition-opacity duration-500 -z-10",
                            !reducedMotion && "animate-pulse-slow",
                            isActive ? "opacity-60" : "opacity-20 group-hover/item:opacity-70"
                          )}
                        />
                      </div>

                      <span
                        className={cn(
                          "text-[10px] md:text-sm font-medium text-center max-w-[5rem] md:max-w-[7rem] truncate transition-colors",
                          isActive ? "text-primary" : "text-foreground group-hover/item:text-primary"
                        )}
                      >
                        {category.name}
                      </span>
                      <span
                        className={cn(
                          "block h-0.5 rounded-full bg-primary transition-all duration-300",
                          isActive ? "w-6 opacity-100" : "w-0 opacity-0"
                        )}
                        aria-hidden
                      />
                    </Link>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesScroll;
