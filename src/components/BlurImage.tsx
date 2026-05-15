import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { optimizeImage, buildSrcSet } from "@/lib/image";

interface BlurImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "loading"> {
  src: string;
  alt: string;
  width?: number;
  responsiveWidths?: number[];
  priority?: boolean;
  wrapperClassName?: string;
  /** Aspect ratio class for wrapper, e.g. "aspect-square". Defaults to none (image controls size). */
  aspect?: string;
}

/**
 * BlurImage – progressive image with blur-up placeholder for Supabase Storage URLs.
 * - Generates a tiny blurred preview (width=20) shown until the full image loads.
 * - For non-Storage URLs (local webp, external CDN), only the optimized image is rendered.
 * - Applies fetchpriority="high" + eager loading when priority=true.
 */
export const BlurImage = ({
  src,
  alt,
  width = 800,
  responsiveWidths,
  priority = false,
  className,
  wrapperClassName,
  aspect,
  sizes,
  ...rest
}: BlurImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const isStorage = typeof src === "string" && src.includes("/storage/v1/object/public/");
  const placeholder = isStorage ? optimizeImage(src, { width: 24, quality: 30 }) : null;
  const optimized = optimizeImage(src, { width });
  const srcSet = responsiveWidths ? buildSrcSet(src, responsiveWidths) : undefined;

  return (
    <div className={cn("relative overflow-hidden bg-muted", aspect, wrapperClassName)}>
      {placeholder && !errored && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 w-full h-full object-contain blur-xl transition-opacity duration-500",
            loaded ? "opacity-0" : "opacity-100"
          )}
        />
      )}
      {errored ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span className="sr-only">Imagem indisponível</span>
        </div>
      ) : (
        <img
          {...rest}
          src={optimized}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          // @ts-expect-error – fetchpriority is a valid HTML attribute, not yet typed
          fetchpriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            "w-full h-full object-contain transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}
    </div>
  );
};

export default BlurImage;
