import { Helmet } from "react-helmet";
import { Heart, Award, Leaf, Users, Star, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Sobre = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sobre Nós | Empório LeleCute - Lembrancinhas Artesanais</title>
        <meta name="description" content="Conheça a história do Empório LeleCute. Há mais de 10 anos criando lembrancinhas artesanais com amor e dedicação para momentos especiais." />
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Nossa História
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Empório LeleCute
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Há mais de 10 anos transformando momentos especiais em memórias eternas 
              através de lembrancinhas artesanais únicas e personalizadas.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl text-foreground mb-6">
                  Como tudo começou
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  O Empório LeleCute nasceu do amor pela arte e pelo desejo de criar 
                  peças únicas que pudessem eternizar os momentos mais especiais da 
                  vida das pessoas.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Começamos pequeno, em um ateliê caseiro, fazendo sabonetes artesanais 
                  para amigos e familiares. A paixão pelo trabalho manual e a dedicação 
                  em cada detalhe logo chamaram a atenção de mais pessoas.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Hoje, somos referência em lembrancinhas personalizadas para maternidade, 
                  batizado, casamento e eventos especiais em todo o Brasil.
                </p>
              </div>
              <div className="bg-primary-light rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary mb-2">10+</p>
                    <p className="text-sm text-muted-foreground">Anos de experiência</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary mb-2">50k+</p>
                    <p className="text-sm text-muted-foreground">Clientes atendidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary mb-2">100k+</p>
                    <p className="text-sm text-muted-foreground">Lembrancinhas criadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary mb-2">4.9</p>
                    <p className="text-sm text-muted-foreground">Avaliação no Elo7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl text-foreground text-center mb-12">
                Nossos Valores
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card rounded-xl p-6 text-center border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Amor</h3>
                  <p className="text-sm text-muted-foreground">
                    Cada peça é feita com carinho e dedicação
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Qualidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Materiais premium e acabamento impecável
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Sustentável</h3>
                  <p className="text-sm text-muted-foreground">
                    Ingredientes naturais e embalagens eco-friendly
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Atendimento</h3>
                  <p className="text-sm text-muted-foreground">
                    Suporte personalizado do início ao fim
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Differentials */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl text-foreground text-center mb-12">
              Por que escolher o Empório LeleCute?
            </h2>
            <div className="space-y-4">
              {[
                "100% artesanal - cada peça é única",
                "Produtos hipoalergênicos e seguros",
                "Personalização completa com nome e data",
                "Envio para todo o Brasil com embalagem especial",
                "Mais de 50 mil clientes satisfeitos",
                "Avaliação 4.9 estrelas no Elo7",
                "Atendimento humanizado via WhatsApp",
                "Prazo de produção transparente",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border/50">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Sobre;
