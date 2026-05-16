import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronRight, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import DynamicSEO from "@/components/DynamicSEO";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";
import ItemListStructuredData from "@/components/ItemListStructuredData";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { optimizeImage } from "@/lib/image";
import type { Product } from "@/data/products";

const SITE_ORIGIN = "https://emporiolelecute.com.br";
const MAX_PRODUCTS = 24;

type TaxonomyKind = "categoria" | "ocasiao" | "segmento";

interface TaxonomyConfig {
  kind: TaxonomyKind;
  table: "categories" | "occasions" | "segments";
  joinTable: "products" | "product_occasions" | "product_segments";
  joinCol: "category_id" | "occasion_id" | "segment_id";
  label: string;
  hubPath: string;
  routePrefix: string;
}

const CONFIGS: Record<TaxonomyKind, TaxonomyConfig> = {
  categoria: {
    kind: "categoria",
    table: "categories",
    joinTable: "products",
    joinCol: "category_id",
    label: "Categoria",
    hubPath: "/produtos",
    routePrefix: "/categoria",
  },
  ocasiao: {
    kind: "ocasiao",
    table: "occasions",
    joinTable: "product_occasions",
    joinCol: "occasion_id",
    label: "Ocasião",
    hubPath: "/ocasioes",
    routePrefix: "/ocasiao",
  },
  segmento: {
    kind: "segmento",
    table: "segments",
    joinTable: "product_segments",
    joinCol: "segment_id",
    label: "Segmento",
    hubPath: "/produtos",
    routePrefix: "/segmento",
  },
};

interface TaxonomyEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  h1_override: string | null;
  description_seo: string | null;
  is_indexed: boolean;
}

interface Props {
  kind: TaxonomyKind;
}

const TaxonomyPage = ({ kind }: Props) => {
  const { slug = "" } = useParams<{ slug: string }>();
  const cfg = CONFIGS[kind];

  // 1. Carrega entidade
  const entityQuery = useQuery({
    queryKey: ["taxonomy", cfg.table, slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(cfg.table)
        .select("id, name, slug, description, image_url, meta_title, meta_description, h1_override, description_seo, is_indexed")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as TaxonomyEntity | null;
    },
  });

  const entity = entityQuery.data;

  // 2. Carrega produtos relacionados (sem N+1)
  const productsQuery = useQuery({
    queryKey: ["taxonomy-products", cfg.table, entity?.id],
    enabled: !!entity?.id,
    queryFn: async () => {
      if (cfg.kind === "categoria") {
        const { data, error } = await supabase
          .from("products")
          .select("id, slug, name, description, price, original_price, images, badge, rating, min_quantity, keywords, is_active")
          .eq("is_active", true)
          .eq("category_id", entity!.id)
          .order("created_at", { ascending: false })
          .limit(MAX_PRODUCTS);
        if (error) throw error;
        return data ?? [];
      }

      // ocasiao / segmento — query via tabela de junção
      const { data, error } = await supabase
        .from(cfg.joinTable as "product_occasions" | "product_segments")
        .select(`
          product:products(
            id, slug, name, description, price, original_price,
            images, badge, rating, min_quantity, keywords, is_active, created_at
          )
        `)
        .eq(cfg.joinCol as "occasion_id" | "segment_id", entity!.id);
      if (error) throw error;
      type Row = { product: {
        id: string; slug: string; name: string; description: string | null;
        price: number; original_price: number | null; images: string[];
        badge: string | null; rating: number; min_quantity: number;
        keywords: string[]; is_active: boolean; created_at: string;
      } | null };
      return (data as Row[] | null ?? [])
        .map((r) => r.product)
        .filter((p): p is NonNullable<Row["product"]> => !!p && p.is_active)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .slice(0, MAX_PRODUCTS);
    },
  });

  const dbProducts = productsQuery.data ?? [];

  const products: Product[] = useMemo(
    () =>
      dbProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description || "",
        price: `R$ ${Number(p.price).toFixed(2).replace(".", ",")}`,
        originalPrice: p.original_price
          ? `R$ ${Number(p.original_price).toFixed(2).replace(".", ",")}`
          : undefined,
        image: p.images?.[0] || "/placeholder.svg",
        images: p.images ?? [],
        link: "",
        badge: p.badge || undefined,
        rating: Math.round(p.rating ?? 5),
        category: "outros" as const,
        occasions: [],
        keywords: p.keywords ?? [],
        min_quantity: p.min_quantity || undefined,
      })),
    [dbProducts]
  );

  const loading = entityQuery.isLoading || productsQuery.isLoading;
  const notFound = !entityQuery.isLoading && !entity;

  // ============ SEO ============
  const pageUrl = `${SITE_ORIGIN}${cfg.routePrefix}/${slug}`;
  const fallbackTitle = entity
    ? `${entity.name} — ${cfg.label === "Categoria" ? "Sabonetes e Lembrancinhas" : cfg.label} | Empório LeleCute`
    : "Empório LeleCute";
  const fallbackDesc = entity
    ? `Conheça nossos produtos da ${cfg.label.toLowerCase()} ${entity.name}. Lembrancinhas artesanais personalizadas com entrega para todo Brasil.`
    : undefined;

  const seoTitle = entity?.meta_title?.trim() || fallbackTitle;
  const seoDesc = entity?.meta_description?.trim() || fallbackDesc;
  const h1 = entity?.h1_override?.trim() || entity?.name || "";
  const isIndexed = entity?.is_indexed !== false;

  // ============ Breadcrumb ============
  const breadcrumbItems = entity
    ? [
        { name: "Início", url: `${SITE_ORIGIN}/` },
        { name: cfg.label === "Categoria" ? "Produtos" : cfg.label === "Ocasião" ? "Ocasiões" : "Produtos", url: `${SITE_ORIGIN}${cfg.hubPath}` },
        { name: entity.name, url: pageUrl },
      ]
    : [];

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <meta name="robots" content="noindex,follow" />
          <title>Não encontrado | Empório LeleCute</title>
        </Helmet>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-display font-semibold mb-3">
            {cfg.label} não encontrada
          </h1>
          <p className="text-muted-foreground mb-6">
            A página que você procura não existe ou foi removida.
          </p>
          <Button asChild>
            <Link to="/produtos">Ver todos os produtos</Link>
          </Button>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO core */}
      <DynamicSEO
        title={seoTitle}
        description={seoDesc}
        image={entity?.image_url || undefined}
        url={pageUrl}
        type="website"
      />
      <Helmet>
        <meta
          name="robots"
          content={isIndexed ? "index,follow" : "noindex,follow"}
        />
      </Helmet>

      {entity && breadcrumbItems.length > 0 && (
        <BreadcrumbStructuredData items={breadcrumbItems} />
      )}
      {entity && products.length > 0 && (
        <ItemListStructuredData
          listName={entity.name}
          products={products.map((p) => ({
            name: p.name,
            description: p.description,
            image: p.image,
            price: Number(String(p.price).replace(/[^0-9,]/g, "").replace(",", ".")) || 0,
            slug: p.slug,
          }))}
        />
      )}

      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/40 via-background to-background border-b">
          <div className="container mx-auto px-4 py-10 lg:py-14">
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4" aria-label="Navegação">
              <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={cfg.hubPath} className="hover:text-foreground transition-colors">
                {cfg.label === "Categoria" ? "Produtos" : cfg.label === "Ocasião" ? "Ocasiões" : "Produtos"}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium truncate">{entity?.name ?? ""}</span>
            </nav>

            <div className="flex flex-col-reverse lg:flex-row gap-8 items-start lg:items-center">
              <div className="flex-1 min-w-0">
                <span className="inline-block text-xs uppercase tracking-wider text-primary font-semibold mb-2">
                  {cfg.label}
                </span>
                <h1 className="text-3xl lg:text-4xl font-display font-semibold text-foreground mb-3">
                  {h1}
                </h1>
                {(entity?.description_seo || entity?.description) && (
                  <p className="text-muted-foreground text-base lg:text-lg max-w-2xl">
                    {entity?.description_seo || entity?.description}
                  </p>
                )}
              </div>

              {entity?.image_url && (
                <div className="w-full max-w-xs lg:max-w-sm shrink-0">
                  <img
                    src={optimizeImage(entity.image_url, { width: 640, resize: "cover" })}
                    alt={entity.name}
                    className="w-full aspect-[4/3] object-cover rounded-2xl shadow-card"
                    loading="eager"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto px-4 py-10 lg:py-14">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-display font-semibold mb-2">
                Em breve novos produtos
              </h2>
              <p className="text-muted-foreground mb-6">
                Ainda não temos produtos cadastrados nesta {cfg.label.toLowerCase()}.
                Explore nosso catálogo completo enquanto isso.
              </p>
              <Button asChild>
                <Link to="/produtos">Ver todos os produtos</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-lg font-display font-medium text-foreground">
                  {products.length} {products.length === 1 ? "produto" : "produtos"}
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 4} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TaxonomyPage;
