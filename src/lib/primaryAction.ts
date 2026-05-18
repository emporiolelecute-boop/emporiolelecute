// Sprint 4 — Camada única de decisão de CTA primário.
//
// Regras (acordadas):
//   • Produto personalizável  → WhatsApp-first
//   • Produto pronta entrega   → Carrinho-first
//   • Kit                      → Híbrido (Carrinho primário + WhatsApp secundário)
//
// Use SEMPRE este helper para decidir qual botão é primário.
// Nunca duplicar a lógica em componentes.

export type PrimaryAction = "whatsapp" | "cart" | "bundle" | "unavailable";

export interface PrimaryActionResult {
  /** Ação primária — botão de maior destaque visual */
  primary: PrimaryAction;
  /** Ação secundária — botão outline/sutil. `null` quando não deve aparecer */
  secondary: PrimaryAction | null;
  /** Motivo determinístico — útil para analytics e debug */
  reason:
    | "personalized"
    | "ready_to_ship"
    | "bundle"
    | "inactive"
    | "out_of_stock";
}

export interface ProductLike {
  is_active?: boolean | null;
  personalization_enabled?: boolean | null;
  stock_status?: string | null;
  // Aceitamos qualquer formato — só usamos os campos acima.
  [key: string]: unknown;
}

export interface KitLike {
  is_active?: boolean | null;
  bundle_type?: string | null;
  [key: string]: unknown;
}

/** Resolve a ação primária para um produto individual (PDP, card, sticky CTA). */
export function resolvePrimaryAction(product: ProductLike | null | undefined): PrimaryActionResult {
  if (!product || product.is_active === false) {
    return { primary: "unavailable", secondary: null, reason: "inactive" };
  }
  if (product.stock_status === "out_of_stock") {
    return { primary: "whatsapp", secondary: null, reason: "out_of_stock" };
  }
  if (product.personalization_enabled) {
    return { primary: "whatsapp", secondary: "cart", reason: "personalized" };
  }
  return { primary: "cart", secondary: "whatsapp", reason: "ready_to_ship" };
}

/** Resolve a ação primária para um kit (KitPage, bloco de kits). Sempre híbrido. */
export function resolveKitPrimaryAction(kit: KitLike | null | undefined): PrimaryActionResult {
  if (!kit || kit.is_active === false) {
    return { primary: "unavailable", secondary: null, reason: "inactive" };
  }
  return { primary: "cart", secondary: "whatsapp", reason: "bundle" };
}

/** Label canônico para o CTA — usado em botões e em analytics. */
export const PRIMARY_LABEL: Record<PrimaryAction, string> = {
  cart: "Adicionar ao Carrinho",
  whatsapp: "Fazer Orçamento no WhatsApp",
  bundle: "Adicionar kit ao carrinho",
  unavailable: "Indisponível",
};
