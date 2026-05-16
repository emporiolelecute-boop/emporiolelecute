import { Link } from "react-router-dom";

export interface SemanticLink {
  label: string;
  path: string;
  type: "theme" | "occasion" | "segment" | "category" | "blog" | "combination";
}

interface Props {
  title: string;
  links: SemanticLink[];
  className?: string;
}

const TYPE_LABEL: Record<SemanticLink["type"], string> = {
  theme: "Tema",
  occasion: "Ocasião",
  segment: "Segmento",
  category: "Categoria",
  blog: "Blog",
  combination: "Coleção",
};

/**
 * Fase 10.5 — Bloco SEO-friendly de linking semântico.
 * Renderiza apenas quando há pelo menos 3 links válidos.
 */
export function SemanticLinkingBlock({ title, links, className }: Props) {
  const valid = links.filter((l) => l.path && l.label);
  if (valid.length < 3) return null;

  return (
    <nav
      aria-label={title}
      className={`mt-10 border-t pt-6 ${className ?? ""}`}
    >
      <h2 className="text-base font-semibold text-foreground mb-3">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {valid.map((l) => (
          <li key={l.path}>
            <Link
              to={l.path}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                {TYPE_LABEL[l.type]}
              </span>
              <span className="font-medium">{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SemanticLinkingBlock;
