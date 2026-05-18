import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { logTelemetryEvent } from "@/lib/telemetry";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Optional extra class for the wrapper (controls size). */
  wrapperClassName?: string;
  /** Root margin for IntersectionObserver. */
  rootMargin?: string;
}

/**
 * Image with real lazy loading via IntersectionObserver and a shimmer
 * skeleton fallback shown until the image is in view AND loaded.
 *
 * Falls back to native `loading="lazy"` if IntersectionObserver is not
 * available (very old browsers / SSR).
 */
export const LazyImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  rootMargin = "200px",
  ...imgProps
}: LazyImageProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0.01 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return (
    <div ref={wrapperRef} className={cn("relative w-full h-full overflow-hidden", wrapperClassName)}>
      {!loaded && (
        <div
          className="absolute inset-0 bg-muted/70"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, hsl(var(--background) / 0.85) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.4s linear infinite",
            }}
          />
        </div>
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            className,
          )}
          {...imgProps}
        />
      )}
    </div>
  );
};

export default LazyImage;
