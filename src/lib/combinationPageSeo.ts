/**
 * Fase 9 — Combination Page SEO Score
 *
 * Decide se uma página combinatória (ex: /segmento/lembrancinhas/ocasiao/batizado)
 * pode receber `index,follow` ou deve permanecer `noindex,follow`.
 *
 * Regras (mínimas para indexação):
 *  - >= 6 produtos
 *  - editorial >= 300 chars
 *  - meta_title e meta_description únicos
 *  - >= 2 FAQs
 *  - score >= 70
 */

export interface CombinationPageInput {
  productCount: number;
  editorialChars: number;
  hasUniqueMeta: boolean;
  faqCount: number;
  internalLinks: number;
}

export interface CombinationScore {
  score: number;
  classification: "indexable" | "borderline" | "noindex";
  reasons: string[];
  recommendations: string[];
}

export function scoreCombinationPage(input: CombinationPageInput): CombinationScore {
  let score = 0;
  const reasons: string[] = [];
  const recs: string[] = [];

  // Produtos (peso 35)
  if (input.productCount >= 12) score += 35;
  else if (input.productCount >= 6) score += 25;
  else {
    score += Math.min(15, input.productCount * 2);
    recs.push(`Adicionar ao menos ${6 - input.productCount} produto(s) relacionado(s)`);
  }
  reasons.push(`${input.productCount} produtos`);

  // Editorial (peso 25)
  if (input.editorialChars >= 800) score += 25;
  else if (input.editorialChars >= 300) score += 15;
  else {
    score += 5;
    recs.push("Escrever pelo menos 300 caracteres de conteúdo editorial");
  }
  reasons.push(`${input.editorialChars} chars editorial`);

  // Meta (peso 15)
  if (input.hasUniqueMeta) score += 15;
  else recs.push("Definir meta_title e meta_description únicos");

  // FAQ (peso 15)
  if (input.faqCount >= 4) score += 15;
  else if (input.faqCount >= 2) score += 10;
  else recs.push("Adicionar ao menos 2 perguntas frequentes");
  reasons.push(`${input.faqCount} FAQs`);

  // Internal linking (peso 10)
  if (input.internalLinks >= 5) score += 10;
  else if (input.internalLinks >= 2) score += 6;
  else recs.push("Criar links internos para taxonomias relacionadas");

  const classification: CombinationScore["classification"] =
    score >= 70 && input.productCount >= 6 && input.editorialChars >= 300 && input.faqCount >= 2
      ? "indexable"
      : score >= 50
      ? "borderline"
      : "noindex";

  return { score, classification, reasons, recommendations: recs };
}
