import { Link } from "react-router-dom";
import { Baby, Heart, Church, Cake, Users, Building2, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import QuoteFormSection from "@/components/QuoteFormSection";
import DynamicSEO from "@/components/DynamicSEO";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";

const occasions = [
  {
    id: "maternidade",
    name: "Maternidade",
    description: "Lembrancinhas delicadas para celebrar a chegada do bebê. Sabonetes e velas personalizados com o nome e data do nascimento.",
    icon: Baby,
    color: "bg-pink-100 text-pink-600",
    slug: "maternidade",
  },
  {
    id: "cha-de-bebe",
    name: "Chá de Bebê",
    description: "Presenteie seus convidados com lembrancinhas encantadoras. Opções temáticas para menino, menina ou tema neutro.",
    icon: Gift,
    color: "bg-blue-100 text-blue-600",
    slug: "cha-bebe",
  },
  {
    id: "batizado",
    name: "Batizado",
    description: "Lembrancinhas sagradas para este momento especial. Anjinhos, terços e símbolos religiosos personalizados.",
    icon: Church,
    color: "bg-purple-100 text-purple-600",
    slug: "batizado",
  },
  {
    id: "casamento",
    name: "Casamento",
    description: "Eternize o seu grande dia com lembrancinhas sofisticadas. Sabonetes florais e velas românticas personalizadas.",
    icon: Heart,
    color: "bg-red-100 text-red-600",
    slug: "casamento",
  },
  {
    id: "aniversario",
    name: "Aniversário",
    description: "Torne sua festa ainda mais especial. Lembrancinhas temáticas para todas as idades e estilos de celebração.",
    icon: Cake,
    color: "bg-amber-100 text-amber-600",
    slug: "aniversario",
  },
  {
    id: "eventos-corporativos",
    name: "Eventos Corporativos",
    description: "Brindes personalizados para sua empresa. Ideal para confraternizações, eventos e presentes para clientes.",
    icon: Building2,
    color: "bg-emerald-100 text-emerald-600",
    slug: "corporativo",
  },
];

const Ocasioes = () => {
  const breadcrumbItems = [
    { name: 'Início', url: 'https://emporiolelecute.com.br/' },
    { name: 'Ocasiões', url: 'https://emporiolelecute.com.br/ocasioes' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO
        title="Ocasiões | Empório LeleCute - Lembrancinhas para Cada Momento"
        description="Encontre a lembrancinha perfeita para cada ocasião: maternidade, chá de bebê, batizado, casamento, aniversário e eventos corporativos."
        url="https://emporiolelecute.com.br/ocasioes"
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Ocasiões Especiais
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Lembrancinhas para Cada Momento
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Cada celebração merece uma lembrancinha especial. Encontre a opção 
              perfeita para eternizar seus momentos mais importantes.
            </p>
          </div>
        </section>

        {/* Occasions Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {occasions.map((occasion) => {
                // Mapeia slug do banco para a rota da landing SEO (Horizonte 2)
                const landingRouteMap: Record<string, string> = {
                  "maternidade": "maternidade",
                  "cha-bebe": "cha-de-bebe",
                  "batizado": "batizado",
                  "aniversario": "aniversario-infantil",
                };
                const landingRoute = landingRouteMap[occasion.slug];
                const targetUrl = landingRoute
                  ? `/lembrancinhas-${landingRoute}`
                  : `/produtos?ocasiao=${occasion.slug}`;

                return (
                  <Link 
                    key={occasion.id}
                    to={targetUrl}
                    className="group"
                  >
                    <article className="bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all h-full flex flex-col">
                      <div className={`w-16 h-16 ${occasion.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <occasion.icon className="h-8 w-8" />
                      </div>
                      
                      <h2 className="font-display text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                        {occasion.name}
                      </h2>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                        {occasion.description}
                      </p>
                      
                      <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                        Ver lembrancinhas
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            {/* Linkagem direta para as 2 landings adicionais (chá revelação + formatura) */}
            <div className="mt-10 grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <Link
                to="/lembrancinhas-cha-revelacao"
                className="group flex items-center justify-between bg-card rounded-xl p-5 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div>
                  <p className="font-display text-base text-foreground group-hover:text-primary transition-colors">
                    Chá Revelação
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Rosa, azul ou neutro</p>
                </div>
                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/lembrancinhas-formatura"
                className="group flex items-center justify-between bg-card rounded-xl p-5 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div>
                  <p className="font-display text-base text-foreground group-hover:text-primary transition-colors">
                    Formatura
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">ABC, infantil e universitária</p>
                </div>
                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-light to-primary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
                Não encontrou a ocasião perfeita?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Criamos lembrancinhas personalizadas para qualquer tipo de evento! 
                Entre em contato e conte-nos sobre sua celebração especial.
              </p>
              <a
                href="https://wa.me/5541992214299?text=Olá! Gostaria de um orçamento para lembrancinhas personalizadas."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground">
                  Solicitar Orçamento
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Quote Form */}
        <QuoteFormSection />
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Ocasioes;
