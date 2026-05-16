// Fase 7.1 — Avaliação SEO operacional para produtos
// Compatível com DbProduct + estatísticas de reviews + relacionamentos opcionais.

export interface ProductSeoInput {
  id?: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  long_description?: string | null;
  editorial_content?: string | null;
  images?: string[] | null;
  price?: number | null;
  keywords?: string[] | null;
  category_id?: string | null;
  badge?: string | null;
  // Relacionamentos opcionais (passe se conhecidos)
  occasionsCount?: number;
  segmentsCount?: number;
  tagsCount?: number;
  reviewsCount?: number;
  avgRating?: number | null;
}

export type SeoGrade = 'Excelente' | 'Bom' | 'Regular' | 'Fraco' | 'Crítico';

export interface SeoIssue {
  level: 'error' | 'warning' | 'info';
  field: string;
  message: string;
}

export interface ProductSeoEvaluation {
  score: number;          // 0–100
  grade: SeoGrade;
  color: 'emerald' | 'lime' | 'amber' | 'orange' | 'rose';
  issues: SeoIssue[];
  strengths: string[];
}

const GENERIC_SLUGS = new Set([
  'produto', 'product', 'lembrancinha', 'item', 'novo', 'sem-titulo', 'untitled',
]);

export function evaluateProductSeo(p: ProductSeoInput): ProductSeoEvaluation {
  const issues: SeoIssue[] = [];
  const strengths: string[] = [];

  const name = (p.name || '').trim();
  const slug = (p.slug || '').trim();
  const desc = (p.description || '').trim();
  const longDesc = (p.long_description || '').trim();
  const editorial = (p.editorial_content || '').trim();
  const images = (p.images || []).filter(Boolean);
  const keywords = (p.keywords || []).filter(Boolean);

  // Nome / Title
  if (!name) issues.push({ level: 'error', field: 'name', message: 'Nome do produto vazio' });
  else if (name.length < 12) issues.push({ level: 'warning', field: 'name', message: 'Nome muito curto (<12)' });
  else if (name.length > 70) issues.push({ level: 'warning', field: 'name', message: 'Nome muito longo (>70)' });
  else strengths.push('Title com tamanho ideal');

  // Slug
  if (!slug) issues.push({ level: 'error', field: 'slug', message: 'Slug vazio' });
  else if (GENERIC_SLUGS.has(slug) || /^prod(uto)?-?\d*$/.test(slug)) {
    issues.push({ level: 'error', field: 'slug', message: 'Slug genérico — prejudica SEO' });
  } else if (slug.length < 6) {
    issues.push({ level: 'warning', field: 'slug', message: 'Slug muito curto' });
  }

  // Descrição curta (meta)
  if (!desc) issues.push({ level: 'error', field: 'description', message: 'Descrição curta vazia (usada como meta)' });
  else if (desc.length < 60) issues.push({ level: 'warning', field: 'description', message: 'Descrição curta com menos de 60 caracteres' });
  else if (desc.length > 200) issues.push({ level: 'warning', field: 'description', message: 'Descrição curta acima de 200 caracteres' });
  else strengths.push('Meta description com tamanho ideal');

  // Descrição longa
  if (!longDesc) issues.push({ level: 'warning', field: 'long_description', message: 'Descrição detalhada ausente' });
  else if (longDesc.length < 200) issues.push({ level: 'warning', field: 'long_description', message: 'Descrição detalhada muito curta (<200)' });
  else strengths.push('Descrição detalhada robusta');

  // Conteúdo editorial
  if (!editorial) issues.push({ level: 'info', field: 'editorial_content', message: 'Sem conteúdo editorial (recomendado para autoridade)' });
  else if (editorial.length >= 300) strengths.push('Conteúdo editorial enriquece a página');

  // Conteúdo duplicado (descrição == long_description)
  if (desc && longDesc && desc.length > 40 && longDesc.startsWith(desc)) {
    issues.push({ level: 'warning', field: 'long_description', message: 'Descrição longa duplica a curta' });
  }

  // Imagens
  if (images.length === 0) issues.push({ level: 'error', field: 'images', message: 'Produto sem imagens' });
  else if (images.length < 2) issues.push({ level: 'warning', field: 'images', message: 'Apenas 1 imagem cadastrada' });
  else strengths.push(`${images.length} imagens cadastradas`);

  // Preço
  if (p.price == null || Number(p.price) <= 0) {
    issues.push({ level: 'error', field: 'price', message: 'Preço ausente ou zero' });
  }

  // Keywords
  if (!keywords.length) issues.push({ level: 'warning', field: 'keywords', message: 'Sem palavras-chave SEO' });
  else if (keywords.length < 3) issues.push({ level: 'info', field: 'keywords', message: 'Poucas keywords (<3)' });
  else strengths.push(`${keywords.length} keywords`);

  // Relacionamentos semânticos
  if (!p.category_id) issues.push({ level: 'error', field: 'category', message: 'Produto sem categoria' });
  if ((p.occasionsCount ?? 0) === 0) issues.push({ level: 'warning', field: 'occasions', message: 'Sem ocasiões vinculadas' });
  if ((p.segmentsCount ?? 0) === 0) issues.push({ level: 'info', field: 'segments', message: 'Sem segmentos vinculados' });
  if ((p.tagsCount ?? 0) === 0) issues.push({ level: 'info', field: 'tags', message: 'Sem tags visuais' });

  // Reviews
  const reviewsCount = p.reviewsCount ?? 0;
  if (reviewsCount === 0) issues.push({ level: 'info', field: 'reviews', message: 'Sem avaliações reais (rich snippets perdem força)' });
  else if (reviewsCount >= 3) strengths.push(`${reviewsCount} avaliações`);

  // Score: começa em 100, penaliza por issue.
  let score = 100;
  for (const i of issues) {
    score -= i.level === 'error' ? 12 : i.level === 'warning' ? 6 : 2;
  }
  // Pequeno bônus por força semântica
  if (reviewsCount >= 3) score += 4;
  if (editorial.length >= 300) score += 3;
  if (images.length >= 4) score += 2;

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    grade: gradeOf(score),
    color: colorOf(score),
    issues,
    strengths,
  };
}

export function scoreProductSeo(p: ProductSeoInput): number {
  return evaluateProductSeo(p).score;
}

export function gradeOf(score: number): SeoGrade {
  if (score >= 90) return 'Excelente';
  if (score >= 75) return 'Bom';
  if (score >= 55) return 'Regular';
  if (score >= 35) return 'Fraco';
  return 'Crítico';
}

export function colorOf(score: number): ProductSeoEvaluation['color'] {
  if (score >= 90) return 'emerald';
  if (score >= 75) return 'lime';
  if (score >= 55) return 'amber';
  if (score >= 35) return 'orange';
  return 'rose';
}

// ----- Fase 11.2 — Product Maturity -----

export interface ProductMaturityInput {
  editorialLength?: number;
  reviewsCount?: number;
  faqCount?: number;
  imagesCount?: number;
  internalLinksCount?: number;
  occasionsCount?: number;
  segmentsCount?: number;
  tagsCount?: number;
  hasCta?: boolean;
  badge?: string | null;
  avgRating?: number | null;
}

export interface ProductMaturityResult {
  score: number;
  classification: 'Elite' | 'Forte' | 'Média' | 'Fraca' | 'Crítica';
  signals: Record<string, number>;
}

export function calculateProductMaturity(i: ProductMaturityInput): ProductMaturityResult {
  const s: Record<string, number> = {};
  s.editorial = Math.min(18, Math.round((i.editorialLength ?? 0) / 80));
  s.reviews = Math.min(12, (i.reviewsCount ?? 0));
  s.rating = Math.round(((i.avgRating ?? 0) / 5) * 6);
  s.faq = Math.min(8, (i.faqCount ?? 0) * 2);
  s.images = Math.min(10, (i.imagesCount ?? 0) * 2);
  s.links = Math.min(10, (i.internalLinksCount ?? 0));
  s.taxonomy = Math.min(12, ((i.occasionsCount ?? 0) + (i.segmentsCount ?? 0) + (i.tagsCount ?? 0)));
  s.cta = i.hasCta ? 6 : 0;
  s.badge = i.badge ? 4 : 0;
  s.semantic = Math.min(8, Math.round(((i.internalLinksCount ?? 0) + (i.occasionsCount ?? 0)) * 0.8));
  const total = Object.values(s).reduce((a, b) => a + b, 0);
  const score = Math.max(0, Math.min(100, total));
  const classification =
    score >= 85 ? 'Elite' :
    score >= 70 ? 'Forte' :
    score >= 50 ? 'Média' :
    score >= 30 ? 'Fraca' : 'Crítica';
  return { score, classification, signals: s };
}
