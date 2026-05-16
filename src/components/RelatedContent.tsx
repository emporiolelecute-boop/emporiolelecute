/**
 * Fase 9 — Related Content Engine
 * Mostra conteúdo relacionado: posts, taxonomias e produtos.
 */
import { Link } from "react-router-dom";
import { BookOpen, Tag as TagIcon, Package } from "lucide-react";

export interface RelatedItem {
  type: "post" | "category" | "occasion" | "segment" | "tag" | "product";
  slug: string;
  title: string;
  description?: string;
  image?: string;
}

interface RelatedContentProps {
  title?: string;
  items: RelatedItem[];
  className?: string;
}

const ROUTE_PREFIX: Record<RelatedItem["type"], string> = {
  post: "/blog/",
  category: "/categoria/",
  occasion: "/ocasiao/",
  segment: "/segmento/",
  tag: "/tag/",
  product: "/produtos/",
};

const LABEL: Record<RelatedItem["type"], string> = {
  post: "Artigo",
  category: "Categoria",
  occasion: "Ocasião",
  segment: "Segmento",
  tag: "Tag",
  product: "Produto",
};

const IconFor = ({ type }: { type: RelatedItem["type"] }) => {
  if (type === "post") return <BookOpen className="h-4 w-4" />;
  if (type === "product") return <Package className="h-4 w-4" />;
  return <TagIcon className="h-4 w-4" />;
};

export default function RelatedContent({
  title = "Conteúdo relacionado",
  items,
  className = "",
}: RelatedContentProps) {
  if (!items || items.length === 0) return null;
  return (
    <section className={`mt-12 ${className}`}>
      <h2 className="font-display text-2xl text-foreground mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.slice(0, 9).map((item) => (
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
