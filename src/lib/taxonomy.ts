// Helpers compartilhados de taxonomia (Fase 3.2)
export type TaxonomyKind = 'categoria' | 'ocasiao' | 'segmento' | 'tag';

export const TAXONOMY_LABELS: Record<TaxonomyKind, { singular: string; plural: string; urlPrefix: string }> = {
  categoria: { singular: 'Categoria', plural: 'Categorias', urlPrefix: '/categoria/' },
  ocasiao:   { singular: 'Ocasião',  plural: 'Ocasiões',   urlPrefix: '/ocasiao/'   },
  segmento:  { singular: 'Segmento', plural: 'Segmentos',  urlPrefix: '/segmento/'  },
  tag:       { singular: 'Tag',      plural: 'Tags',       urlPrefix: '/tag/'       },
};

export function slugify(name: string) {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface TaxonomyFaq { question: string; answer: string; [key: string]: string }

export interface TaxonomyEntity {
  id: string;
  name: string;
  slug: string;
  position?: number;
  description?: string | null;
  image_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  h1_override?: string | null;
  description_seo?: string | null;
  is_indexed?: boolean;
  faqs?: TaxonomyFaq[] | null;
}

export interface SeoIssues {
  noMetaTitle: boolean;
  shortMetaTitle: boolean;
  noMetaDescription: boolean;
  shortMetaDescription: boolean;
  noImage: boolean;
  noDescription: boolean;
  notIndexed: boolean;
  noDescriptionSeo: boolean;
  noFaq: boolean;
}

export function normalizeFaqs(raw: unknown): TaxonomyFaq[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => {
      const o = r as { question?: unknown; answer?: unknown };
      const q = typeof o?.question === 'string' ? o.question.trim() : '';
      const a = typeof o?.answer === 'string' ? o.answer.trim() : '';
      return q && a ? { question: q, answer: a } : null;
    })
    .filter((x): x is TaxonomyFaq => !!x);
}

export function evaluateSeo(e: TaxonomyEntity): SeoIssues {
  const mt = (e.meta_title || '').trim();
  const md = (e.meta_description || '').trim();
  const ds = (e.description_seo || '').trim();
  const faqs = normalizeFaqs(e.faqs);
  return {
    noMetaTitle: mt.length === 0,
    shortMetaTitle: mt.length > 0 && mt.length < 30,
    noMetaDescription: md.length === 0,
    shortMetaDescription: md.length > 0 && md.length < 80,
    noImage: !e.image_url,
    noDescription: !(e.description && e.description.trim().length > 0),
    notIndexed: e.is_indexed === false,
    noDescriptionSeo: ds.length < 120,
    noFaq: faqs.length === 0,
  };
}

export function hasAnyIssue(s: SeoIssues) {
  return Object.values(s).some(Boolean);
}
