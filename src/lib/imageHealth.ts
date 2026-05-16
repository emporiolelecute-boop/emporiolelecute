/**
 * Fase 9 — Image Health / SEO de imagens
 */

export interface ImageIssue {
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  issues: string[];
}

export interface ImageHealthSummary {
  total: number;
  withoutAlt: number;
  withoutImages: number;
  smallFilename: number;
  duplicates: number;
  issues: ImageIssue[];
}

const MIN_FILENAME_LEN = 8;

function looksLikePoorFilename(url: string): boolean {
  try {
    const u = new URL(url, "https://emporiolelecute.com.br");
    const last = (u.pathname.split("/").pop() || "").toLowerCase();
    const base = last.replace(/\.[a-z0-9]+$/i, "");
    if (base.length < MIN_FILENAME_LEN) return true;
    if (/^[0-9a-f-]{16,}$/i.test(base)) return true; // hashes/uuid
    if (/^(img|image|photo|dsc|untitled)[-_0-9]*$/i.test(base)) return true;
    return false;
  } catch {
    return false;
  }
}

export interface ProductLite {
  id: string;
  slug: string;
  name: string;
  images?: string[] | null;
}

export function analyzeImageHealth(products: ProductLite[]): ImageHealthSummary {
  const seen = new Map<string, number>();
  const issues: ImageIssue[] = [];
  let withoutImages = 0;
  let withoutAlt = 0; // proxy: filename pobre => alt provavelmente fraco
  let smallFilename = 0;
  let total = 0;

  for (const p of products) {
    const imgs = p.images || [];
    if (imgs.length === 0) {
      withoutImages++;
      issues.push({
        productId: p.id,
        productSlug: p.slug,
        productName: p.name,
        imageUrl: "",
        issues: ["Produto sem imagens"],
      });
      continue;
    }
    for (const url of imgs) {
      total++;
      seen.set(url, (seen.get(url) || 0) + 1);
      const found: string[] = [];
      if (looksLikePoorFilename(url)) {
        smallFilename++;
        withoutAlt++;
        found.push("Filename não-semântico");
      }
      if (found.length > 0) {
        issues.push({
          productId: p.id,
          productSlug: p.slug,
          productName: p.name,
          imageUrl: url,
          issues: found,
        });
      }
    }
  }

  let duplicates = 0;
  for (const [, count] of seen) if (count > 1) duplicates += count - 1;

  return { total, withoutAlt, withoutImages, smallFilename, duplicates, issues };
}
