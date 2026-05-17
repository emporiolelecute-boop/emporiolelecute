/**
 * Navigation Compression — read-only menu diagnostics.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export type NavGroup =
  | "CORE"
  | "CONTENT"
  | "DISCOVERY"
  | "INTELLIGENCE"
  | "GOVERNANCE"
  | "SYSTEM"
  | "ARCHIVE";

export interface NavItem {
  label: string;
  path: string;
}

export interface GroupedNavigation {
  group: NavGroup;
  items: NavItem[];
}

const GROUP_KEYWORDS: Record<NavGroup, string[]> = {
  CORE: ["dashboard", "home", "overview"],
  CONTENT: [
    "produto",
    "categori",
    "tag",
    "ocasi",
    "blog",
    "page",
    "menu",
    "hero",
    "homepage",
    "testimonial",
    "faq",
    "instagram",
    "tema",
    "combination",
    "landing",
    "review",
  ],
  DISCOVERY: [
    "seo",
    "sitemap",
    "robots",
    "redirect",
    "discovery",
    "merchant",
    "authority",
    "search",
    "indexation",
    "knowledge",
    "taxonom",
    "content gap",
  ],
  INTELLIGENCE: [
    "intelligence",
    "telemetry",
    "simulation",
    "executive",
    "cognitive",
    "reasoning",
    "consciousness",
    "nexus",
    "fabric",
    "kernel",
    "command",
    "grid",
    "continuum",
    "convergence",
    "evolution",
    "operating",
    "orchestrat",
    "matrix",
    "war room",
    "control tower",
    "singular",
    "civilization",
    "audit",
  ],
  GOVERNANCE: [
    "governance",
    "access",
    "user",
    "role",
    "audit",
    "security",
    "diagnostics",
    "cron",
    "shipping",
    "reality",
  ],
  SYSTEM: [
    "settings",
    "tracking",
    "cloudflare",
    "import",
    "health",
    "robots",
  ],
  ARCHIVE: ["legacy", "lab", "experimental", "old"],
};

export function classifyNavItem(item: NavItem): NavGroup {
  const l = item.label.toLowerCase();
  const p = item.path.toLowerCase();
  let best: NavGroup = "SYSTEM";
  let bestHits = 0;
  for (const g of Object.keys(GROUP_KEYWORDS) as NavGroup[]) {
    const hits = GROUP_KEYWORDS[g].filter(
      (k) => l.includes(k) || p.includes(k),
    ).length;
    if (hits > bestHits) {
      bestHits = hits;
      best = g;
    }
  }
  return best;
}

export function groupNavigation(items: NavItem[]): GroupedNavigation[] {
  const map = new Map<NavGroup, NavItem[]>();
  for (const i of items) {
    const g = classifyNavItem(i);
    (map.get(g) ?? map.set(g, []).get(g)!).push(i);
  }
  const order: NavGroup[] = [
    "CORE",
    "CONTENT",
    "DISCOVERY",
    "INTELLIGENCE",
    "GOVERNANCE",
    "SYSTEM",
    "ARCHIVE",
  ];
  return order
    .filter((g) => map.has(g))
    .map((g) => ({ group: g, items: map.get(g)! }));
}

export function detectRedundantLabels(items: NavItem[]): string[][] {
  const buckets = new Map<string, string[]>();
  for (const i of items) {
    const norm = i.label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .replace(/seo|admin/g, "");
    if (!norm) continue;
    (buckets.get(norm) ?? buckets.set(norm, []).get(norm)!).push(i.label);
  }
  return [...buckets.values()].filter((v) => v.length > 1);
}

export function detectSemanticallyEquivalent(items: NavItem[]): string[][] {
  const pairs = [
    ["nexus", "convergence", "fabric"],
    ["kernel", "core", "command"],
    ["consciousness", "intelligence", "cognitive"],
    ["governance", "operations", "reality"],
    ["executive", "summary", "overview"],
  ];
  const out: string[][] = [];
  for (const group of pairs) {
    const hits = items
      .filter((i) =>
        group.some((kw) => i.label.toLowerCase().includes(kw)),
      )
      .map((i) => i.label);
    if (hits.length >= 2) out.push(hits);
  }
  return out;
}

export function calculateNavigationEntropy(items: NavItem[]): number {
  const groups = groupNavigation(items);
  const total = items.length || 1;
  let h = 0;
  for (const g of groups) {
    const p = g.items.length / total;
    if (p > 0) h -= p * Math.log2(p);
  }
  return clamp((h / Math.log2(7)) * 100);
}

export function calculateMenuFatigue(input: {
  itemCount: number;
  depth: number;
  redundantLabels: number;
  semanticDupes: number;
}): number {
  return clamp(
    input.itemCount * 1.2 +
      input.depth * 8 +
      input.redundantLabels * 6 +
      input.semanticDupes * 8,
  );
}

export function calculateAdminDiscoverability(input: {
  fatigue: number;
  entropy: number;
  groupCount: number;
}): number {
  return clamp(
    100 - input.fatigue * 0.5 + (input.groupCount >= 5 ? 10 : 0) -
      Math.abs(50 - input.entropy) * 0.4,
  );
}

export interface MenuCompressionSuggestion {
  group: NavGroup;
  action: "collapse" | "merge" | "rename" | "archive";
  items: string[];
  rationale: string;
}

export function suggestMenuCompression(
  items: NavItem[],
): MenuCompressionSuggestion[] {
  const grouped = groupNavigation(items);
  const out: MenuCompressionSuggestion[] = [];
  for (const g of grouped) {
    if (g.items.length >= 6) {
      out.push({
        group: g.group,
        action: "collapse",
        items: g.items.map((i) => i.label),
        rationale: `${g.items.length} items in ${g.group} — collapse under mega-group.`,
      });
    }
  }
  for (const dupes of detectRedundantLabels(items)) {
    out.push({
      group: "SYSTEM",
      action: "rename",
      items: dupes,
      rationale: "Redundant labels — disambiguate.",
    });
  }
  for (const eq of detectSemanticallyEquivalent(items)) {
    out.push({
      group: "INTELLIGENCE",
      action: "merge",
      items: eq,
      rationale: "Semantically equivalent — merge into one entry.",
    });
  }
  return out;
}
