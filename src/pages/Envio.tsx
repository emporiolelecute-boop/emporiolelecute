import { Truck, MapPin, Package, Clock, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { states } from "@/data/products";
import DynamicSEO from "@/components/DynamicSEO";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";

const Envio = () => {
  const breadcrumbItems = [
    { name: 'Início', url: 'https://emporiolelecute.com.br/' },
    { name: 'Envio', url: 'https://emporiolelecute.com.br/envio' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO
        title="Envio para Todo Brasil | Empório LeleCute"
        description="Enviamos lembrancinhas artesanais para todo o Brasil com embalagem segura e rastreamento. Confira nossas opções de frete."
        url="https://emporiolelecute.com.br/envio"
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-light via-cream to-primary-light py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-dotted-pattern opacity-30" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Truck className="h-4 w-4" />
              Envio Nacional
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Enviamos para <span className="text-primary">Todo Brasil</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossas lembrancinhas artesanais chegam até você em qualquer estado brasileiro, 
              embaladas com carinho e segurança para eventos especiais.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Benefits */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Package, title: "Embalagem Segura", desc: "Produtos protegidos" },
              { icon: Clock, title: "Prazo Confiável", desc: "Entrega no prazo" },
              { icon: Shield, title: "Rastreamento", desc: "Acompanhe seu pedido" },
              { icon: MapPin, title: "Todo Brasil", desc: "27 estados atendidos" }
            ].map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-2xl shadow-soft border border-border/50 text-center">
                <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* States Grid */}
          <div className="mb-16">
            <h2 className="font-display text-3xl text-foreground text-center mb-8">
              Estados <span className="text-primary">Atendidos</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {states.map((state) => (
                <div 
                  key={state}
                  className="bg-card p-4 rounded-xl shadow-soft border border-border/50 flex items-center gap-3 hover:border-primary/50 transition-colors"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground font-medium">{state}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-card p-8 md:p-12 rounded-2xl shadow-soft border border-border/50">
            <h2 className="font-display text-3xl text-foreground text-center mb-8">
              Como Funciona o <span className="text-primary">Envio</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-display">
                  1
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">Faça seu Pedido</h3>
                <p className="text-muted-foreground">
                  Entre em contato via WhatsApp, informe o CEP e receba o orçamento com frete incluso.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-display">
                  2
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">Produção Artesanal</h3>
                <p className="text-muted-foreground">
                  Suas lembrancinhas são produzidas com carinho, uma a uma, com os detalhes personalizados.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-display">
                  3
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">Envio Seguro</h3>
                <p className="text-muted-foreground">
                  Embalamos com muito cuidado e enviamos pelos Correios ou transportadora com código de rastreio.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h3 className="font-display text-2xl text-foreground mb-4">
              Pronto para encomendar?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Solicite um orçamento com frete calculado para sua região. 
              Atendemos pedidos para todo o Brasil com prazos diferenciados.
            </p>
            <a
              href="https://wa.me/5541992214299?text=Olá! Gostaria de saber sobre o frete para minha região."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-8">
                <Truck className="h-5 w-5 mr-2" />
                Calcular Frete no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Envio;
