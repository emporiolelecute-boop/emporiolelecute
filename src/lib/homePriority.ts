// Sprint final — score editorial determinístico para a home.
//
// Combina sinais já existentes no banco (featured_weight, presença em kits,
// presença em coleções, prioridade manual via badge) num score numérico
// estável. Usado para ordenar listas de destaque e priorizar produtos com
// maior valor curatorial. Pure function — sem efeitos.

export interface HomePriorityInput {
  /** featured_weight (0-100). Sinal principal de prioridade manual. */
  featured_weight?: number | null;
  /** Produto presente em pelo menos um kit ativo. */
  in_kit?: boolean;
  /** Produto presente em pelo menos uma coleção ativa em destaque. */
  in_collection?: boolean;
  /** Badge manual ("Mais vendido", "Novo"...) atribuído pelo admin. */
  badge?: string | null;
  /** Posição manual (menor = mais prioritário). */
  position?: number | null;
}

export function homePriorityScore(input: HomePriorityInput): number {
  const fw = Math.max(0, Math.min(100, Number(input.featured_weight ?? 0)));
  const kit = input.in_kit ? 15 : 0;
  const collection = input.in_collection ? 10 : 0;
  const manual = input.badge && input.badge.trim().length > 0 ? 5 : 0;
  // Position desempata; penalidade leve, evita overpower.
  const posPenalty = Math.min(10, Math.max(0, Number(input.position ?? 0))) * 0.2;
  return fw + kit + collection + manual - posPenalty;
}

/** Ordenação descendente e estável (preserva ordem original em empate). */
export function sortByHomePriority<T extends HomePriorityInput>(items: T[]): T[] {
  return items
    .map((item, idx) => ({ item, idx, score: homePriorityScore(item) }))
    .sort((a, b) => (b.score - a.score) || (a.idx - b.idx))
    .map((x) => x.item);
}
