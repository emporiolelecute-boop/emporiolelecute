/**
 * Supabase Storage image optimization helper.
 *
 * Rewrites public storage URLs to use the on-the-fly image transformation
 * endpoint, which automatically serves modern formats (WebP/AVIF) when the
 * client supports them and resizes the source to the requested width.
 *
 * Non-storage URLs (external CDNs, local imports) are returned unchanged.
 */
export function optimizeImage(
  url: string | undefined | null,
  options: { width?: number; quality?: number; resize?: "cover" | "contain" | "fill" } = {}
): string {
  if (!url) return "/placeholder.svg";
  if (typeof url !== "string") return url;

  // Only transform Supabase Storage public URLs
  const PUBLIC = "/storage/v1/object/public/";
  if (!url.includes(PUBLIC)) return url;

  const { width = 800, quality = 75, resize = "contain" } = options;
  const transformed = url.replace(PUBLIC, "/storage/v1/render/image/public/");
  const sep = transformed.includes("?") ? "&" : "?";
  return `${transformed}${sep}width=${width}&quality=${quality}&resize=${resize}`;
}

/**
 * Build a srcSet string for responsive images served via Supabase transform.
 */
export function buildSrcSet(
  url: string | undefined | null,
  widths: number[] = [400, 600, 800, 1200],
  quality = 75,
  resize: "cover" | "contain" | "fill" = "contain"
): string | undefined {
  if (!url || !url.includes("/storage/v1/object/public/")) return undefined;
  return widths
    .map((w) => `${optimizeImage(url, { width: w, quality, resize })} ${w}w`)
    .join(", ");
}
