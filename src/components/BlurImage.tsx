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
  const isStorage = typeof src === "string" && src.includes("/storage/v1/object/public/");
  const placeholder = isStorage ? optimizeImage(src, { width: 24, quality: 30 }) : null;
  const optimized = optimizeImage(src, { width });
  const srcSet = responsiveWidths ? buildSrcSet(src, responsiveWidths) : undefined;

  return (
    <div className={cn("relative overflow-hidden", aspect, wrapperClassName)}>
      {placeholder && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 w-full h-full object-cover scale-110 blur-xl transition-opacity duration-500",
            loaded ? "opacity-0" : "opacity-100"
          )}
        />
      )}
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
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </div>
  );
};

export default BlurImage;
