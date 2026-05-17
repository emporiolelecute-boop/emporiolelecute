import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDbOccasions } from "@/hooks/useProducts";
import { LucideIcon } from "@/components/LucideIcon";
import { cn } from "@/lib/utils";

const SCROLL_KEY = "occasionsThumbs:left";
const ACTIVE_SWITCH_THRESHOLD = 18;

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
          "linear-gradient(115deg, transparent 30%, hsl(var(--background) / 0.75) 50%, transparent 70%)",
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

  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const lastActiveRef = useRef(0);
  const lastBestDistRef = useRef(Infinity);
  const persistRaf = useRef<number | null>(null);

  const updateState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let bestIdx = lastActiveRef.current;
    let bestDist = Infinity;
    itemsRef.current.forEach((node, i) => {
      if (!node) return;
      const c = node.offsetLeft + node.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    });
    if (
      bestIdx !== lastActiveRef.current &&
      Math.abs(bestDist - lastBestDistRef.current) > ACTIVE_SWITCH_THRESHOLD
    ) {
      lastActiveRef.current = bestIdx;
      lastBestDistRef.current = bestDist;
      setActiveIdx(bestIdx);
    } else if (bestIdx === lastActiveRef.current) {
      lastBestDistRef.current = bestDist;
    }
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
  }, [updateState, list.length]);

  useEffect(() => {
    if (isLoading || list.length === 0) return;
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
  }, [isLoading, list.length]);

  const scrollToIndex = (i: number, focus = false) => {
    const node = itemsRef.current[i];
    const el = scrollerRef.current;
    if (!node || !el) return;
    const target = node.offsetLeft - el.clientWidth / 2 + node.offsetWidth / 2;
    el.scrollTo({ left: target, behavior: "smooth" });
    if (focus) requestAnimationFrame(() => node.focus({ preventScroll: true }));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!list.length) return;
    let next = activeIdx;
    switch (e.key) {
      case "ArrowRight": next = Math.min(activeIdx + 1, list.length - 1); break;
      case "ArrowLeft":  next = Math.max(activeIdx - 1, 0); break;
      case "Home":       next = 0; break;
      case "End":        next = list.length - 1; break;
      default: return;
    }
    e.preventDefault();
    setActiveIdx(next);
    lastActiveRef.current = next;
    scrollToIndex(next, true);
  };

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

        <div
          ref={scrollerRef}
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
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
          )}
        >
          {(isLoading ? Array.from({ length: 8 }) : list).map((o: any, i) => {
            if (!o) {
              return (
                <ShimmerBlock
                  key={i}
                  className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl snap-start"
                />
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
                className={cn(
                  "group shrink-0 flex flex-col items-center gap-1.5 snap-start outline-none",
                  "focus-visible:ring-2 focus-visible:ring-primary/60 rounded-2xl"
                )}
              >
                <div
                  className={cn(
                    "relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/20 ring-1 ring-border/60 transition-all duration-300 group-hover:ring-primary group-hover:-translate-y-0.5 group-hover:shadow-medium hover:animate-bounce-soft",
                    isActive && "ring-primary scale-105 shadow-medium"
                  )}
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
    </section>
  );
};

export default OccasionsThumbs;
