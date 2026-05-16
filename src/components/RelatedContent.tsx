/**
 * Fase 9 — Related Content Engine
 * Fase 11 — Editorial mode: prioriza posts reais, hubs fortes e taxonomias com autoridade.
 */
import { Link } from "react-router-dom";
import { BookOpen, Tag as TagIcon, Package } from "lucide-react";

export interface RelatedItem {
  type: "post" | "category" | "occasion" | "segment" | "tag" | "product" | "theme";
  slug: string;
  title: string;
  description?: string;
  image?: string;
  /** Fase 11 — sinais usados pelo modo editorial */
  authority?: number;
  readiness?: number;
  isStrongHub?: boolean;
}

interface RelatedContentProps {
  title?: string;
  items: RelatedItem[];
  className?: string;
  /** Fase 11 — "editorial" prioriza autoridade real, reduz links borderline. */
  mode?: "default" | "editorial";
  /** máximo de itens renderizados. */
  max?: number;
}

const ROUTE_PREFIX: Record<RelatedItem["type"], string> = {
  post: "/blog/",
  category: "/categoria/",
  occasion: "/ocasiao/",
  segment: "/segmento/",
  tag: "/tag/",
  product: "/produtos/",
  theme: "/tema/",
};

const LABEL: Record<RelatedItem["type"], string> = {
  post: "Artigo",
  category: "Categoria",
  occasion: "Ocasião",
  segment: "Segmento",
  tag: "Tag",
  product: "Produto",
  theme: "Tema",
};

const IconFor = ({ type }: { type: RelatedItem["type"] }) => {
  if (type === "post") return <BookOpen className="h-4 w-4" />;
  if (type === "product") return <Package className="h-4 w-4" />;
  return <TagIcon className="h-4 w-4" />;
};

/**
 * Fase 11 — Helper para gerar sugestões editoriais a partir de qualquer
 * conjunto candidato. Priorização:
 *   1. posts reais
 *   2. hubs/temas fortes (isStrongHub ou authority >= 80)
 *   3. taxonomias com authority >= 70
 * Penaliza borderline (authority < 55) descartando.
 */
export function editorialLinkSuggestions(
  candidates: RelatedItem[],
  opts: { limit?: number; minAuthority?: number } = {},
): RelatedItem[] {
  const limit = opts.limit ?? 9;
  const minAuthority = opts.minAuthority ?? 55;

  const filtered = candidates.filter((c) => {
    if (c.type === "post") return true;
    const a = c.authority ?? 0;
    if (c.isStrongHub) return true;
    return a >= minAuthority;
  });

  const score = (c: RelatedItem): number => {
    let s = 0;
    if (c.type === "post") s += 100;
    if (c.isStrongHub) s += 60;
    s += (c.authority ?? 0);
    s += (c.readiness ?? 0) * 0.4;
    return s;
  };

  return [...filtered]
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export default function RelatedContent({
  title = "Conteúdo relacionado",
  items,
  className = "",
  mode = "default",
  max,
}: RelatedContentProps) {
  if (!items || items.length === 0) return null;

  const list = mode === "editorial"
    ? editorialLinkSuggestions(items, { limit: max ?? 9 })
    : items.slice(0, max ?? 9);

  if (list.length === 0) return null;

  return (
    <section className={`mt-12 ${className}`}>
      <h2 className="font-display text-2xl text-foreground mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((item) => (
          <Link
            key={`${item.type}-${item.slug}`}
            to={`${ROUTE_PREFIX[item.type]}${item.slug}`}
            className="group block bg-card rounded-2xl p-5 border border-border/40 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-primary font-medium">
              <IconFor type={item.type} />
              {LABEL[item.type]}
            </span>
            <h3 className="font-display text-base text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
