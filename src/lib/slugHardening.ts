/**
 * Fase 4.1 — Hardening de geração de slug.
 *
 * Objetivo único: impedir que slugs ruins (truncados, com hash residual,
 * cortados no meio da palavra) reapareçam.
 *
 * Sem persistência, sem backend. Lib pura, testável.
 */

import { normalizeSlug } from "@/lib/slug";

/** Stopwords curtas que podem ser removidas só se necessário para encurtar. */
const SHORT_STOPWORDS = new Set([
  "de", "da", "do", "das", "dos",
  "no", "na", "nos", "nas",
  "em", "com", "para", "por",
  "a", "o", "e",
]);

/** Limite saudável de comprimento de slug (Google indexa bem até ~75). */
export const SLUG_MAX_HEALTHY = 60;
/** Limite duro além do qual a UI deve forçar correção. */
export const SLUG_MAX_HARD = 75;

/**
 * Gera slug a partir de um nome, com truncamento token-aware:
 * nunca corta no meio de uma palavra. Se exceder `maxLen`, remove
 * tokens inteiros do final (preferindo stopwords curtas) até caber.
 *
 * NÃO adiciona hash. NÃO trunca mid-word. Determinístico.
 */
export function generateSafeSlug(name: string, maxLen: number = SLUG_MAX_HEALTHY): string {
  const base = normalizeSlug(name);
  if (base.length <= maxLen) return base;

  const tokens = base.split("-").filter(Boolean);

  // Primeira passada: remove apenas stopwords do FIM enquanto exceder o limite.
  while (joinLen(tokens) > maxLen && tokens.length > 2) {
    const lastStopwordIdx = lastIndexOf(tokens, (t) => SHORT_STOPWORDS.has(t));
    if (lastStopwordIdx === -1) break;
    tokens.splice(lastStopwordIdx, 1);
  }

  // Segunda passada: se ainda exceder, remove o último token inteiro
  // (nunca corta no meio). Preserva pelo menos 2 tokens iniciais.
  while (joinLen(tokens) > maxLen && tokens.length > 2) {
    tokens.pop();
  }

  return tokens.join("-");
}

function joinLen(tokens: string[]): number {
  if (tokens.length === 0) return 0;
  return tokens.reduce((s, t) => s + t.length, 0) + tokens.length - 1;
}

function lastIndexOf<T>(arr: T[], pred: (t: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) if (pred(arr[i])) return i;
  return -1;
}

// ─── Quality assessor ──────────────────────────────────────────────────────

export type SlugSeverity = "ok" | "warn" | "error";
export type SlugQuality = {
  severity: SlugSeverity;
  issues: string[];
};

/** Detecta hash residual "estilo Lovable" (4 chars sem vogais OU com dígitos). */
const HASH_TAIL_RE = /-([a-z0-9]{3,5})$/;
const DIGIT_RE = /[0-9]/;
const VOWEL_RE = /[aeiou]/;

function looksLikeHash(token: string): boolean {
  if (token.length < 3 || token.length > 5) return false;
  // Hash típico: tem dígito misturado com letra, OU letras sem vogal.
  const hasDigit = DIGIT_RE.test(token);
  const hasLetter = /[a-z]/.test(token);
  const hasVowel = VOWEL_RE.test(token);
  if (hasDigit && hasLetter) return true; // ex: ii6z, js6l, y5yi
  if (!hasVowel && token.length >= 4) return true; // ex: hxsv, bwvf
  return false;
}

/** Tokens muito curtos no final tendem a ser palavras cortadas. */
function looksTruncated(token: string): boolean {
  if (token.length > 2) return false;
  // numerais isolados são legítimos (ex: "3-letras", "15-anos")
  if (/^[0-9]+$/.test(token)) return false;
  // stopwords curtas legítimas (ex: ...-no-tule, ...-com-tag)
  if (SHORT_STOPWORDS.has(token)) return false;
  return true;
}

/**
 * Avalia a qualidade de um slug e retorna severidade + lista de issues.
 *
 * - `error`: bloqueante. Hash residual claro OU comprimento absurdo.
 * - `warn`: aviso visual. Comprimento elevado, possível truncamento.
 * - `ok`: tudo certo.
 */
export function assessSlugQuality(rawSlug: string): SlugQuality {
  const slug = (rawSlug ?? "").trim().toLowerCase();
  const issues: string[] = [];
  let severity: SlugSeverity = "ok";
  const bump = (lvl: SlugSeverity) => {
    if (lvl === "error") severity = "error";
    else if (lvl === "warn" && severity !== "error") severity = "warn";
  };

  if (!slug) return { severity: "ok", issues: [] };

  if (slug.length > SLUG_MAX_HARD) {
    issues.push(`Slug muito longo (${slug.length} chars). Máx. recomendado: ${SLUG_MAX_HEALTHY}.`);
    bump("error");
  } else if (slug.length > SLUG_MAX_HEALTHY) {
    issues.push(`Slug longo (${slug.length} chars). Ideal ≤ ${SLUG_MAX_HEALTHY}.`);
    bump("warn");
  }

  const tail = slug.match(HASH_TAIL_RE)?.[1];
  if (tail && looksLikeHash(tail)) {
    issues.push(`Sufixo "-${tail}" parece hash residual. Remova ou substitua por palavra.`);
    bump("error");
  }

  const tokens = slug.split("-").filter(Boolean);
  const last = tokens[tokens.length - 1] ?? "";
  if (last && looksTruncated(last)) {
    issues.push(`Último token "${last}" parece palavra truncada. Complete-a.`);
    bump("warn");
  }

  return { severity, issues };
}
