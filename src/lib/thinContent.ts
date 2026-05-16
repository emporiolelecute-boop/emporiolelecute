// Fase 8 — Detecção de thin content + checklist operacional do produto.

export interface ThinContentInput {
  name?: string | null;
  description?: string | null;
  long_description?: string | null;
  editorial_content?: string | null;
  images?: string[] | null;
  keywords?: string[] | null;
  category_id?: string | null;
  occasionsCount?: number;
  segmentsCount?: number;
  tagsCount?: number;
  reviewsCount?: number;
  faqsCount?: number;
  is_active?: boolean | null;
  seo_noindex?: boolean | null;
}

export type ThinContentLevel = 'saudavel' | 'medio' | 'fraco' | 'critico';

export interface ThinContentResult {
  level: ThinContentLevel;
  /** Pontuação 0–100 (quanto maior, melhor). */
  score: number;
  reasons: string[];
}

export function detectThinContent(p: ThinContentInput): ThinContentResult {
  const desc = (p.description || '').trim();
  const longDesc = (p.long_description || '').trim();
  const editorial = (p.editorial_content || '').trim();
  const images = (p.images || []).filter(Boolean);
  const tagsCount = p.tagsCount ?? 0;
  const reviewsCount = p.reviewsCount ?? 0;

  let score = 100;
  const reasons: string[] = [];

  if (desc.length < 60) { score -= 14; reasons.push('Descrição curta com menos de 60 caracteres'); }
  if (longDesc.length < 200) { score -= 14; reasons.push('Descrição detalhada muito curta'); }
  if (!editorial) { score -= 18; reasons.push('Sem conteúdo editorial'); }
  else if (editorial.length < 200) { score -= 8; reasons.push('Editorial muito curto'); }
  if (images.length < 2) { score -= 12; reasons.push('Menos de 2 imagens'); }
  if (reviewsCount === 0) { score -= 10; reasons.push('Sem avaliações reais'); }
  if (tagsCount < 2) { score -= 8; reasons.push('Poucas tags visuais'); }
  if ((p.occasionsCount ?? 0) === 0) { score -= 8; reasons.push('Sem ocasião vinculada'); }
  if ((p.segmentsCount ?? 0) === 0) { score -= 4; reasons.push('Sem segmento vinculado'); }
  if (!p.category_id) { score -= 12; reasons.push('Sem categoria'); }
  if (!(p.keywords ?? []).length) { score -= 4; reasons.push('Sem palavras-chave'); }

  score = Math.max(0, Math.min(100, score));

  let level: ThinContentLevel = 'saudavel';
  if (score < 35) level = 'critico';
  else if (score < 55) level = 'fraco';
  else if (score < 75) level = 'medio';

  return { level, score, reasons };
}

// -------- Checklist operacional (Fase 8 / SEO Workflow) --------

export interface ChecklistItem {
  key: string;
  label: string;
  passed: boolean;
  /** 'critical' afeta mais o score percentual. */
  weight: 1 | 2;
}

export interface ChecklistInput extends ThinContentInput {
  slug?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export type ChecklistStatus = 'incompleto' | 'basico' | 'bom' | 'excelente';

export interface ChecklistResult {
  items: ChecklistItem[];
  passed: number;
  total: number;
  /** Percentual ponderado 0–100. */
  percent: number;
  status: ChecklistStatus;
}

export function buildProductChecklist(p: ChecklistInput): ChecklistResult {
  const desc = (p.description || '').trim();
  const longDesc = (p.long_description || '').trim();
  const editorial = (p.editorial_content || '').trim();
  const images = (p.images || []).filter(Boolean);
  const title = (p.meta_title || p.name || '').trim();
  const metaDesc = (p.meta_description || p.description || '').trim();
  const slug = (p.slug || '').trim();

  const items: ChecklistItem[] = [
    { key: 'category',    label: 'Categoria definida',                weight: 2, passed: !!p.category_id },
    { key: 'occasion',    label: 'Ao menos 1 ocasião',                weight: 1, passed: (p.occasionsCount ?? 0) >= 1 },
    { key: 'segment',     label: 'Ao menos 1 segmento',               weight: 1, passed: (p.segmentsCount ?? 0) >= 1 },
    { key: 'images',      label: 'Mínimo de 2 imagens',               weight: 2, passed: images.length >= 2 },
    { key: 'description', label: 'Descrição curta preenchida',        weight: 2, passed: desc.length >= 60 },
    { key: 'long_desc',   label: 'Descrição detalhada robusta',       weight: 1, passed: longDesc.length >= 200 },
    { key: 'editorial',   label: 'Editorial preenchido',              weight: 1, passed: editorial.length >= 200 },
    { key: 'title',       label: 'Meta title em tamanho aceitável',   weight: 2, passed: title.length >= 12 && title.length <= 70 },
    { key: 'meta_desc',   label: 'Meta description aceitável',        weight: 2, passed: metaDesc.length >= 60 && metaDesc.length <= 200 },
    { key: 'slug',        label: 'Slug válido (>= 6 caracteres)',     weight: 2, passed: slug.length >= 6 && !/^prod(uto)?-?\d*$/.test(slug) },
    { key: 'reviews',     label: 'Ao menos 1 avaliação',              weight: 1, passed: (p.reviewsCount ?? 0) >= 1 },
    { key: 'tags',        label: 'Ao menos 2 tags visuais',           weight: 1, passed: (p.tagsCount ?? 0) >= 2 },
    { key: 'indexable',   label: 'Produto indexável (ativo + index)', weight: 2, passed: !!p.is_active && !p.seo_noindex },
  ];

  const passed = items.filter((i) => i.passed).length;
  const total = items.length;
  const num = items.reduce((s, i) => s + (i.passed ? i.weight : 0), 0);
  const den = items.reduce((s, i) => s + i.weight, 0);
  const percent = Math.round((num / den) * 100);

  let status: ChecklistStatus = 'incompleto';
  if (percent >= 90) status = 'excelente';
  else if (percent >= 70) status = 'bom';
  else if (percent >= 45) status = 'basico';

  return { items, passed, total, percent, status };
}
