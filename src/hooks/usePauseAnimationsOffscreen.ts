import { useEffect, useRef } from "react";

/**
 * Pause CSS animations inside `ref` whenever the element leaves the viewport
 * or the tab becomes hidden. Resumes when it comes back into view.
 *
 * Uses `animationPlayState` — never unmounts, never re-renders. Safe + cheap.
 *
 * Targets descendants matching `selector` (default: any class starting with
 * `animate-` plus inline `style*=animation`). Override if needed.
 */
export function usePauseAnimationsOffscreen<T extends HTMLElement>(opts?: {
  selector?: string;
  rootMargin?: string;
}) {
  const ref = useRef<T | null>(null);
  const selector =
    opts?.selector ??
    '[class*="animate-"], [style*="animation"]';

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const apply = (state: "running" | "paused") => {
      const nodes = root.querySelectorAll<HTMLElement>(selector);
      nodes.forEach((n) => {
        n.style.animationPlayState = state;
      });
    };

    let visible = true;
    let hidden = document.hidden;
    const sync = () => apply(visible && !hidden ? "running" : "paused");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === root) {
            visible = e.isIntersecting;
            sync();
          }
        }
      },
      { rootMargin: opts?.rootMargin ?? "100px", threshold: 0.01 }
    );
    io.observe(root);

    const onVis = () => {
      hidden = document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [selector, opts?.rootMargin]);

  return ref;
}
