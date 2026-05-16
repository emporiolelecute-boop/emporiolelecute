// Fase 8 — Sugestões inteligentes (heurísticas, sem IA) para taxonomias.
// Apenas sugere — nunca salva nem substitui o operador.

export type SuggestionKind = 'tag' | 'occasion' | 'segment' | 'category';

export interface TaxonomySuggestion {
  kind: SuggestionKind;
  /** Nome legível sugerido. */
  label: string;
  /** Slug heurístico (kebab-case). */
  slug: string;
  /** Pontuação 0–1, quanto mais alto, mais confiante. */
  confidence: number;
  /** Termos que ativaram a sugestão (debug/transparência). */
  matchedTerms: string[];
}

interface Rule {
  kind: SuggestionKind;
  label: string;
  slug: string;
  /** Termos que disparam (já normalizados — minúsculas, sem acento). */
  terms: string[];
}

// Regras curadas para a operação do Empório LeleCute.
const RULES: Rule[] = [
  // OCASIÕES
  { kind: 'occasion', label: 'Maternidade',     slug: 'maternidade',    terms: ['maternidade', 'mae', 'mamae', 'gestante', 'gestacao'] },
  { kind: 'occasion', label: 'Chá de bebê',     slug: 'cha-de-bebe',    terms: ['cha de bebe', 'cha bebe', 'baby shower'] },
  { kind: 'occasion', label: 'Chá revelação',   slug: 'cha-revelacao',  terms: ['cha revelacao', 'revelacao', 'gender reveal'] },
  { kind: 'occasion', label: 'Batizado',        slug: 'batizado',       terms: ['batizado', 'batismo', 'cristao', 'cristã'] },
  { kind: 'occasion', label: 'Casamento',       slug: 'casamento',      terms: ['casamento', 'noivos', 'noiva', 'wedding'] },
  { kind: 'occasion', label: 'Aniversário',     slug: 'aniversario',    terms: ['aniversario', 'birthday', 'festa de aniversario'] },
  { kind: 'occasion', label: 'Formatura',       slug: 'formatura',      terms: ['formatura', 'formando', 'graduacao'] },
  { kind: 'occasion', label: 'Páscoa',          slug: 'pascoa',         terms: ['pascoa', 'easter'] },
  { kind: 'occasion', label: 'Natal',           slug: 'natal',          terms: ['natal', 'christmas'] },

  // SEGMENTOS
  { kind: 'segment',  label: 'Infantil',        slug: 'infantil',       terms: ['infantil', 'crianca', 'criança', 'baby', 'bebe'] },
  { kind: 'segment',  label: 'Adulto',          slug: 'adulto',         terms: ['adulto', 'feminino', 'masculino'] },
  { kind: 'segment',  label: 'Corporativo',     slug: 'corporativo',    terms: ['corporativo', 'empresa', 'evento corporativo'] },

  // TAGS TEMÁTICAS (visuais/temas)
  { kind: 'tag', label: 'Safari',        slug: 'safari',        terms: ['safari', 'selva', 'leao', 'girafa', 'zebra'] },
  { kind: 'tag', label: 'Floresta',      slug: 'floresta',      terms: ['floresta', 'bosque', 'arvore', 'raposa'] },
  { kind: 'tag', label: 'Fazendinha',    slug: 'fazendinha',    terms: ['fazendinha', 'fazenda', 'vaquinha', 'cavalo', 'trator'] },
  { kind: 'tag', label: 'Princesa',      slug: 'princesa',      terms: ['princesa', 'castelo', 'realeza', 'coroa'] },
  { kind: 'tag', label: 'Astronauta',    slug: 'astronauta',    terms: ['astronauta', 'espaco', 'foguete', 'planeta'] },
  { kind: 'tag', label: 'Unicórnio',     slug: 'unicornio',     terms: ['unicornio', 'magico', 'magia'] },
  { kind: 'tag', label: 'Floral',        slug: 'floral',        terms: ['floral', 'flor', 'flores', 'jardim'] },
  { kind: 'tag', label: 'Boho',          slug: 'boho',          terms: ['boho', 'bohemian', 'rustico'] },
  { kind: 'tag', label: 'Romântico',     slug: 'romantico',     terms: ['romantico', 'amor', 'coracao', 'apaixonados'] },
  { kind: 'tag', label: 'Natureza',      slug: 'natureza',      terms: ['natureza', 'verde', 'organico'] },
  { kind: 'tag', label: 'Lavanda',       slug: 'lavanda',       terms: ['lavanda', 'lavender'] },
  { kind: 'tag', label: 'Citrus',        slug: 'citrus',        terms: ['citrus', 'laranja', 'limao', 'capim'] },
  { kind: 'tag', label: 'Baunilha',      slug: 'baunilha',      terms: ['baunilha', 'vanilla'] },
];

function normalize(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface SuggestionInput {
  name?: string | null;
  description?: string | null;
  long_description?: string | null;
  editorial_content?: string | null;
  keywords?: string[] | null;
  existingTagSlugs?: string[];
  existingOccasionSlugs?: string[];
  existingSegmentSlugs?: string[];
  existingCategorySlug?: string | null;
}

export function suggestTaxonomies(input: SuggestionInput): TaxonomySuggestion[] {
  const haystack = normalize(
    [
      input.name ?? '',
      input.description ?? '',
      input.long_description ?? '',
      input.editorial_content ?? '',
      (input.keywords ?? []).join(' '),
    ].join(' '),
  );

  if (!haystack) return [];

  const existing: Record<SuggestionKind, Set<string>> = {
    tag: new Set(input.existingTagSlugs ?? []),
    occasion: new Set(input.existingOccasionSlugs ?? []),
    segment: new Set(input.existingSegmentSlugs ?? []),
    category: new Set(input.existingCategorySlug ? [input.existingCategorySlug] : []),
  };

  const results: TaxonomySuggestion[] = [];
  for (const rule of RULES) {
    if (existing[rule.kind].has(rule.slug)) continue;
    const matched = rule.terms.filter((t) => haystack.includes(t));
    if (!matched.length) continue;
    // Confidence: cresce com nº de matches e por aparecer no nome.
    const inName = matched.some((t) => normalize(input.name ?? '').includes(t));
    const confidence = Math.min(1, 0.4 + matched.length * 0.2 + (inName ? 0.2 : 0));
    results.push({
      kind: rule.kind,
      label: rule.label,
      slug: rule.slug,
      confidence,
      matchedTerms: matched,
    });
  }

  results.sort((a, b) => b.confidence - a.confidence);
  return results;
}
