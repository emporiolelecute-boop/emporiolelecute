/**
 * Fase 9 — Blog SEO Health
 * Avalia qualidade SEO/editorial de um post.
 */
import type { DbBlogPost } from "@/hooks/useDbBlogPosts";

export interface BlogSeoScore {
  score: number;
  classification: "excellent" | "good" | "needs-work" | "critical";
  issues: string[];
}

export function evaluateBlogPost(post: DbBlogPost): BlogSeoScore {
  let score = 100;
  const issues: string[] = [];

  const titleLen = (post.meta_title || post.title || "").length;
  if (titleLen < 30 || titleLen > 65) {
    score -= 10;
    issues.push("Título fora da faixa ideal (30–65)");
  }

  const descLen = (post.meta_description || post.excerpt || "").length;
  if (descLen < 80 || descLen > 165) {
    score -= 10;
    issues.push("Descrição fora da faixa ideal (80–165)");
  }

  const contentLen = (post.content || "").replace(/<[^>]+>/g, " ").length;
  if (contentLen < 800) {
    score -= 20;
    issues.push("Conteúdo curto (mínimo 800 chars)");
  }
  if (contentLen < 300) {
    score -= 15;
    issues.push("Thin content crítico");
  }

  if (!post.cover_image) {
    score -= 10;
    issues.push("Sem imagem de capa");
  } else if (!post.cover_image_alt) {
    score -= 5;
    issues.push("Capa sem alt text");
  }

  if (!post.faqs || post.faqs.length < 2) {
    score -= 5;
    issues.push("Menos de 2 FAQs");
  }

  const relCount =
    (post.related_products?.length || 0) +
    (post.related_categories?.length || 0) +
    (post.related_occasions?.length || 0) +
    (post.related_segments?.length || 0) +
    (post.related_tags?.length || 0);
  if (relCount < 2) {
    score -= 15;
    issues.push("Poucos relacionamentos semânticos");
  }

  score = Math.max(0, score);
  const classification: BlogSeoScore["classification"] =
    score >= 85 ? "excellent" : score >= 65 ? "good" : score >= 40 ? "needs-work" : "critical";

  return { score, classification, issues };
}
