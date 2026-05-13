import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Sparkles, Truck, Heart, CheckCircle2, Star, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DynamicSEO from "@/components/DynamicSEO";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";
import FAQStructuredData from "@/components/FAQStructuredData";
import ItemListStructuredData from "@/components/ItemListStructuredData";
import ProductCard from "@/components/ProductCard";
import { useDbProducts, type DbProduct } from "@/hooks/useProducts";
import { LEMBRANCINHAS_LANDINGS, getLandingByRouteSlug, type LembrancinhasLandingConfig } from "@/data/lembrancinhasLandings";
import type { Product } from "@/data/products";

interface Props {
  configKey: string;
}

const SITE = "https://emporiolelecute.com.br";

const dbToProduct = (p: DbProduct): Product => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  description: p.description || "",
  longDescription: p.long_description || undefined,
  price: `R$ ${Number(p.price).toFixed(2).replace(".", ",")}`,
  originalPrice: p.original_price ? `R$ ${Number(p.original_price).toFixed(2).replace(".", ",")}` : undefined,
  image: p.images?.[0] || "",
  images: p.images || [],
  link: p.elo7_link || `${SITE}/produtos/${p.slug}`,
  badge: p.badge || undefined,
  rating: Number(p.rating || 5),
  category: "outros" as const,
  occasions: [],
  keywords: p.keywords || [],
});

const LembrancinhasLanding = ({ configKey }: Props) => {
  const config = getLandingByRouteSlug(configKey) as LembrancinhasLandingConfig;
  const { data: dbProducts, isLoading } = useDbProducts();

  const filteredProducts = useMemo(() => {
    if (!dbProducts) return [];
    return dbProducts.filter((p) =>
      (p.occasions || []).some((o) => o.slug === config.occasionSlug)
    );
  }, [dbProducts, config.occasionSlug]);

  const productsForCard = filteredProducts.map(dbToProduct);

  const breadcrumbItems = [
    { name: "Início", url: `${SITE}/` },
    { name: "Lembrancinhas", url: `${SITE}/ocasioes` },
    { name: config.heroBadge, url: `${SITE}/lembrancinhas-${config.routeSlug}` },
  ];

  const itemListProducts = productsForCard.slice(0, 12).map((p) => ({
    name: p.name,
    description: p.description,
    image: p.image,
    price: Number(p.price.replace(/[^\d,]/g, "").replace(",", ".")) || 0,
    slug: p.slug,
  }));

  const whatsappHref = `https://wa.me/5541992214299?text=${encodeURIComponent(config.whatsappMessage)}`;
  const relatedLandings = config.relatedRouteSlugs
    .map((s) => LEMBRANCINHAS_LANDINGS.find((l) => l.routeSlug === s))
    .filter(Boolean) as LembrancinhasLandingConfig[];

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO
        title={config.seoTitle}
        description={config.seoDescription}
        url={`${SITE}/lembrancinhas-${config.routeSlug}`}
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <FAQStructuredData faqs={config.faqs.map((f, i) => ({ id: String(i), ...f }))} />
      {itemListProducts.length > 0 && (
        <ItemListStructuredData products={itemListProducts} listName={config.h1} />
      )}

      <Header />

      <main className="pt-24 pb-16">
        {/* HERO */}
        <section className={`bg-gradient-to-br ${config.themeAccent}`}>
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 bg-white/70 backdrop-blur text-foreground rounded-full text-sm font-medium mb-6">
                {config.heroBadge}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
                {config.h1}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                {config.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Orçamento via WhatsApp
                  </Button>
                </a>
                <a href="#produtos">
                  <Button size="lg" variant="outline" className="gap-2">
                    Ver modelos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="container mx-auto px-4 py-10 border-b border-border/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
            {[
              { icon: Sparkles, label: "Artesanal", text: "Feito à mão" },
              { icon: Heart, label: "Personalizado", text: "Com nome e data" },
              { icon: Truck, label: "Brasil inteiro", text: "Envio Correios" },
              { icon: CheckCircle2, label: "10+ anos", text: "Experiência" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <item.icon className="h-6 w-6 text-primary" />
                <p className="font-display text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUTOS */}
        <section id="produtos" className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
                Modelos de {config.heroBadge}
              </h2>
              <p className="text-muted-foreground">
                Escolha o seu favorito e clique para orçar com personalização
              </p>
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-12">Carregando produtos...</p>
            ) : productsForCard.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-2xl">
                <p className="text-muted-foreground mb-4">
                  Nosso catálogo para esta ocasião está em atualização.
                </p>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <Button>Falar com a artesã pelo WhatsApp</Button>
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsForCard.slice(0, 12).map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 3} />
                ))}
              </div>
            )}

            {productsForCard.length > 12 && (
              <div className="text-center mt-10">
                <Link to={`/produtos?ocasiao=${config.occasionSlug}`}>
                  <Button variant="outline" size="lg">
                    Ver todos os {productsForCard.length} modelos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-12">
                Como Funciona o Pedido
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { n: "1", t: "Escolha o modelo", d: "Selecione a lembrancinha que combina com sua ocasião" },
                  { n: "2", t: "Personalize", d: "Defina nome, data, cores e quantidade" },
                  { n: "3", t: "Receba o orçamento", d: "Confirmamos prazo e calculamos o frete pelo CEP" },
                  { n: "4", t: "Aprove a arte", d: "Enviamos a arte personalizada antes da produção" },
                ].map((step) => (
                  <div key={step.n} className="bg-background rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display text-xl mx-auto mb-4">
                      {step.n}
                    </div>
                    <h3 className="font-display text-base mb-2">{step.t}</h3>
                    <p className="text-sm text-muted-foreground">{step.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEO COPY */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto prose prose-neutral">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
              Sobre nossas {config.heroBadge.toLowerCase().includes("aniversário") ? "lembrancinhas de aniversário infantil" : `lembrancinhas de ${config.heroBadge.toLowerCase()}`}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{config.seoCopy}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-10">
              Perguntas Frequentes
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {config.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-display">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className={`bg-gradient-to-br ${config.themeAccent} py-16`}>
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Vamos criar a sua lembrancinha?
            </h2>
            <p className="text-muted-foreground mb-8">
              Atendimento direto com a artesã pelo WhatsApp. Resposta em até 2 horas em horário comercial.
            </p>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground gap-2">
                <MessageCircle className="h-5 w-5" />
                Solicitar orçamento agora
              </Button>
            </a>
          </div>
        </section>

        {/* VOCÊ TAMBÉM PODE GOSTAR — INTERLINK SILO */}
        {relatedLandings.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl text-center text-foreground mb-10">
                Você também pode gostar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedLandings.map((rel) => (
                  <Link
                    key={rel.routeSlug}
                    to={`/lembrancinhas-${rel.routeSlug}`}
                    className="group block bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <span className="text-xs text-primary font-medium uppercase tracking-wide">
                      {rel.heroBadge}
                    </span>
                    <h3 className="font-display text-lg text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                      {rel.h1}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {rel.heroSubtitle}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm mt-4 group-hover:gap-3 transition-all">
                      Ver lembrancinhas
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/ocasioes" className="text-sm text-primary hover:underline">
                  Ver todas as ocasiões →
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LembrancinhasLanding;
