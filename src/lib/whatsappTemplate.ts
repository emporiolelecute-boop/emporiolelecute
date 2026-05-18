/**
 * Renderiza o template do WhatsApp gerenciado pelo admin
 * com validação/normalização de quantidade e personalização.
 *
 * Placeholders suportados:
 *   {produto} {qtd} {preco} {link} {imagem}
 *   {categoria} {ocasiao} {segmento} {contexto}
 *   {personalizacao} {personalizacao_linha}  (linha completa, removida se vazio)
 *   {imagem_linha}                            (linha completa com prefixo, removida se vazio)
 */
export interface WhatsAppTemplateVars {
  productName: string;
  productSlug: string;
  link: string;
  quantity: number | string | null | undefined;
  personalization?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  occasion?: string | null;
  segment?: string | null;
}

const MAX_PERSONALIZATION = 600;
const MAX_PRODUCT_NAME = 200;

/** Normaliza quantidade: inteiro >=1, default 1, máximo 99999. */
export function normalizeQuantity(q: unknown): number {
  const n = Math.floor(Number(q));
  if (!isFinite(n) || n < 1) return 1;
  if (n > 99999) return 99999;
  return n;
}

/** Normaliza personalização: trim, colapsa espaços, remove controles, limita tamanho. */
export function normalizePersonalization(p: unknown): string {
  if (typeof p !== "string") return "";
  const cleaned = p
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cleaned.slice(0, MAX_PERSONALIZATION);
}

function normalizeText(s: unknown, max = 200): string {
  if (typeof s !== "string") return "";
  return s.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

export function renderWhatsAppMessage(template: string, vars: WhatsAppTemplateVars): string {
  const qty = normalizeQuantity(vars.quantity);
  const personalization = normalizePersonalization(vars.personalization);
  const productName = normalizeText(vars.productName, MAX_PRODUCT_NAME) || "Produto";
  const link = normalizeText(vars.link, 500);
  const price = normalizeText(vars.price, 40);
  const imageUrl = normalizeText(vars.imageUrl, 500);
  const category = normalizeText(vars.category, 80);
  const occasion = normalizeText(vars.occasion, 80);
  const segment = normalizeText(vars.segment, 80);

  const ctxParts: string[] = [];
  if (category) ctxParts.push(`categoria *${category}*`);
  if (occasion) ctxParts.push(`ocasião *${occasion}*`);
  if (segment) ctxParts.push(`segmento *${segment}*`);
  const contexto = ctxParts.length ? `\n🏷️ Contexto: ${ctxParts.join(" · ")}` : "";

  const personalizacaoLinha = personalization ? `- Personalização: ${personalization}\n` : "";
  const imagemLinha = imageUrl ? `\n🖼️ Imagem: ${imageUrl}` : "";

  const map: Record<string, string> = {
    produto: productName,
    qtd: String(qty),
    preco: price,
    link,
    imagem: imageUrl,
    categoria: category,
    ocasiao: occasion,
    segmento: segment,
    contexto,
    personalizacao: personalization,
    personalizacao_linha: personalizacaoLinha,
    imagem_linha: imagemLinha,
  };

  let out = template || "";
  // Substituição segura de placeholders
  out = out.replace(/\{(\w+)\}/g, (full, key) => {
    return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : full;
  });

  // Remove eventuais linhas órfãs que ficaram vazias após substituição
  out = out.replace(/^[ \t]*\n/gm, (m, offset, str) => {
    // Mantém linhas em branco intencionais (entre parágrafos)
    const prev = str[offset - 1];
    const next = str[offset + m.length];
    if (prev === "\n" || next === "\n") return m;
    return "";
  });

  return out.trim();
}
