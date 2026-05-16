/**
 * Fase 11.2 — Editorial Brief Engine (SAFE MODE).
 *
 * Gera briefings estratégicos ASSISTIVOS para humanos. Nada aqui
 * publica, salva ou indexa. Saída pura — pronta para um painel.
 */

import {
  calculateAuthority,
  calculateTopicalCoverage,
  classifyAuthority,
  detectThinContent,
  type AuthoritySignals,
} from "./authorityEngine";

export type BriefEntityType =
  | "product"
  | "category"
  | "occasion"
  | "segment"
  | "tag"
  | "theme"
  | "combination"
  | "blog_post";

export interface BriefEntityInput {
  type: BriefEntityType;
  slug: string;
  name: string;
  signals: AuthoritySignals;
  hasFaq?: boolean;
  hasEditorial?: boolean;
  hasHeroImage?: boolean;
  editorialLength?: number;
  faqCount?: number;
  competingSlugs?: string[];
  relatedSlugs?: string[];
  contextEntities?: string[];
  searchIntentHint?: string;
}

export interface FaqSuggestion {
  question: string;
  rationale: string;
  impact: "high" | "medium" | "low";
}

export interface OutlineSection {
  heading: string;
  purpose: string;
  suggestedLength: number;
}

export interface InternalLinkSuggestion {
  anchor: string;
  targetType: BriefEntityType | "page";
  targetSlug: string;
  reason: string;
}

export interface EditorialBrief {
  entity: { type: BriefEntityType; slug: string; name: string };
  objective: string;
  searchIntent: "informational" | "commercial" | "transactional" | "navigational";
  authorityLevel: ReturnType<typeof classifyAuthority>;
  weaknesses: string[];
  opportunities: string[];
  suggestedSections: OutlineSection[];
  suggestedFaqs: FaqSuggestion[];
  suggestedInternalLinks: InternalLinkSuggestion[];
  suggestedEntities: string[];
  contentDepth: "shallow" | "balanced" | "deep" | "comprehensive";
  recommendedWordCount: number;
  semanticCoverage: number; // 0..100
  cannibalizationWarnings: string[];
}

function inferIntent(e: BriefEntityInput): EditorialBrief["searchIntent"] {
  if (e.searchIntentHint) {
    const h = e.searchIntentHint.toLowerCase();
    if (h.includes("buy") || h.includes("compra")) return "transactional";
    if (h.includes("info")) return "informational";
  }
  switch (e.type) {
    case "blog_post":
      return "informational";
    case "product":
      return "transactional";
    case "theme":
    case "category":
    case "occasion":
    case "segment":
    case "tag":
      return "commercial";
    case "combination":
      return "commercial";
  }
}

function depthFromAuthority(authority: number): EditorialBrief["contentDepth"] {
  if (authority >= 85) return "comprehensive";
  if (authority >= 70) return "deep";
  if (authority >= 55) return "balanced";
  return "shallow";
}

function recommendedWordCount(depth: EditorialBrief["contentDepth"]): number {
  switch (depth) {
    case "comprehensive": return 1400;
    case "deep": return 900;
    case "balanced": return 600;
    case "shallow": return 350;
  }
}

export function buildFaqSuggestions(e: BriefEntityInput): FaqSuggestion[] {
  const name = e.name;
  const base: FaqSuggestion[] = [
    {
      question: `O que são ${name.toLowerCase()} e quando usar?`,
      rationale: "Cobre a busca informacional inicial.",
      impact: "high",
    },
    {
      question: `Quais materiais e cuidados envolvem ${name.toLowerCase()}?`,
      rationale: "Aumenta confiança e densidade semântica.",
      impact: "medium",
    },
    {
      question: `Posso personalizar ${name.toLowerCase()}?`,
      rationale: "Reforça USP do Empório LeleCute.",
      impact: "high",
    },
    {
      question: `Qual o prazo de produção para ${name.toLowerCase()}?`,
      rationale: "Reduz objeções de compra.",
      impact: "medium",
    },
    {
      question: `Como é o frete e a embalagem de ${name.toLowerCase()}?`,
      rationale: "Resolve dúvida transacional.",
      impact: "medium",
    },
    {
      question: `Quantas unidades mínimas de ${name.toLowerCase()} preciso pedir?`,
      rationale: "Importante para combinações e temas.",
      impact: "high",
    },
    {
      question: `Quais ocasiões combinam com ${name.toLowerCase()}?`,
      rationale: "Reforça linking semântico interno.",
      impact: "medium",
    },
    {
      question: `Como escolher entre ${name.toLowerCase()} e opções semelhantes?`,
      rationale: "Reduz canibalização interna.",
      impact: "low",
    },
  ];
  // Remove duplicações semânticas grosseiras pelo prefixo da pergunta.
  const seen = new Set<string>();
  return base
    .filter((f) => {
      const key = f.question.slice(0, 16).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

export function buildSemanticOutline(e: BriefEntityInput): OutlineSection[] {
  const sections: OutlineSection[] = [
    { heading: `Sobre ${e.name}`, purpose: "Introdução editorial e contexto", suggestedLength: 140 },
    { heading: "Por que vale a pena", purpose: "Diferenciais artesanais e curadoria", suggestedLength: 180 },
    { heading: "Ocasiões e usos recomendados", purpose: "Conexões com ocasiões reais", suggestedLength: 160 },
    { heading: "Como personalizar", purpose: "Reforça USP do Empório", suggestedLength: 140 },
    { heading: "Inspirações e combinações", purpose: "Linking interno semântico", suggestedLength: 160 },
    { heading: "Perguntas frequentes", purpose: "FAQ contextual (3 a 5 perguntas)", suggestedLength: 200 },
  ];
  if (e.type === "blog_post") {
    sections.unshift({ heading: "Contexto e tendência", purpose: "Gancho informacional", suggestedLength: 180 });
  }
  return sections;
}

export function buildInternalLinkPlan(e: BriefEntityInput): InternalLinkSuggestion[] {
  const out: InternalLinkSuggestion[] = [];
  const related = (e.relatedSlugs ?? []).slice(0, 6);
  for (const slug of related) {
    out.push({
      anchor: slug.replace(/-/g, " "),
      targetType: "category",
      targetSlug: slug,
      reason: "Reforça cluster temático",
    });
  }
  const context = (e.contextEntities ?? []).slice(0, 4);
  for (const slug of context) {
    out.push({
      anchor: slug.replace(/-/g, " "),
      targetType: "occasion",
      targetSlug: slug,
      reason: "Conecta a ocasião relevante",
    });
  }
  // limite anti-overlinking
  return out.slice(0, 8);
}

export function buildEditorialBrief(e: BriefEntityInput): EditorialBrief {
  const authority = calculateAuthority(e.signals);
  const topical = calculateTopicalCoverage(e.signals);
  const thin = detectThinContent(e.signals);
  const intent = inferIntent(e);
  const depth = depthFromAuthority(authority);

  const weaknesses: string[] = [];
  if ((e.editorialLength ?? 0) < 300) weaknesses.push("Editorial curto (<300 chars)");
  if (!e.hasFaq) weaknesses.push("Sem FAQ contextual");
  if (!e.hasHeroImage) weaknesses.push("Sem imagem hero forte");
  if (e.signals.internalLinksCount < 3) weaknesses.push("Poucos links internos");
  if (e.signals.reviewsCount < 3) weaknesses.push("Poucas avaliações");
  if (thin.risk) weaknesses.push(...thin.reasons.map((r) => `Risco: ${r}`));

  const opportunities: string[] = [];
  if (e.signals.productsCount >= 8 && (e.editorialLength ?? 0) < 600) {
    opportunities.push("Catálogo robusto: aprofundar editorial gera ganho rápido");
  }
  if (e.signals.blogPostsCount === 0 && authority >= 60) {
    opportunities.push("Criar 1 post de blog suporte para esta entidade");
  }
  if (topical >= 60 && (e.faqCount ?? 0) < 3) {
    opportunities.push("Adicionar 3 FAQs contextuais aumenta cobertura semântica");
  }
  if (e.signals.visualDiversity < 0.4) {
    opportunities.push("Diversificar imagens para reforçar autoridade visual");
  }

  const cannibalWarn: string[] = [];
  const slugL = e.slug.toLowerCase();
  for (const c of e.competingSlugs ?? []) {
    if (c.toLowerCase() === slugL) {
      cannibalWarn.push(`Slug compete diretamente com "${c}"`);
    }
  }

  return {
    entity: { type: e.type, slug: e.slug, name: e.name },
    objective: depth === "shallow"
      ? `Construir base mínima editorial para ${e.name}`
      : `Consolidar ${e.name} como hub de autoridade real`,
    searchIntent: intent,
    authorityLevel: classifyAuthority(authority),
    weaknesses,
    opportunities,
    suggestedSections: buildSemanticOutline(e),
    suggestedFaqs: buildFaqSuggestions(e),
    suggestedInternalLinks: buildInternalLinkPlan(e),
    suggestedEntities: (e.relatedSlugs ?? []).slice(0, 8),
    contentDepth: depth,
    recommendedWordCount: recommendedWordCount(depth),
    semanticCoverage: topical,
    cannibalizationWarnings: cannibalWarn,
  };
}
