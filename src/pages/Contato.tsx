import { Helmet } from "react-helmet";
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import QuoteFormSection from "@/components/QuoteFormSection";

const Contato = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contato | Empório LeleCute - Fale Conosco</title>
        <meta name="description" content="Entre em contato com o Empório LeleCute. Atendimento personalizado via WhatsApp para orçamentos de lembrancinhas artesanais." />
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Fale Conosco
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Entre em Contato
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Estamos prontos para ajudar você a criar as lembrancinhas perfeitas 
              para o seu evento especial.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-card rounded-xl p-6 text-center border border-border/50">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                <p className="text-sm text-muted-foreground mb-3">Atendimento rápido</p>
                <a 
                  href="https://wa.me/5541992214299"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  (41) 99221-4299
                </a>
              </div>

              <div className="bg-card rounded-xl p-6 text-center border border-border/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">E-mail</h3>
                <p className="text-sm text-muted-foreground mb-3">Para orçamentos</p>
                <a 
                  href="mailto:contato@emporiolelecute.com.br"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  contato@emporiolelecute.com.br
                </a>
              </div>

              <div className="bg-card rounded-xl p-6 text-center border border-border/50">
                <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Instagram className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instagram</h3>
                <p className="text-sm text-muted-foreground mb-3">Siga-nos</p>
                <a 
                  href="https://www.instagram.com/emporiolelecute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  @emporiolelecute
                </a>
              </div>

              <div className="bg-card rounded-xl p-6 text-center border border-border/50">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Horário</h3>
                <p className="text-sm text-muted-foreground mb-3">Atendimento</p>
                <p className="text-sm text-foreground font-medium">
                  Seg - Sex: 9h às 18h
                </p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 md:p-12 text-center text-white mb-16">
              <MessageCircle className="h-12 w-12 mx-auto mb-4" />
              <h2 className="font-display text-2xl md:text-3xl mb-4">
                Prefere falar pelo WhatsApp?
              </h2>
              <p className="text-green-100 mb-6 max-w-xl mx-auto">
                Atendemos de forma personalizada pelo WhatsApp. Tire suas dúvidas, 
                solicite orçamentos e acompanhe seu pedido em tempo real.
              </p>
              <a
                href="https://wa.me/5541992214299?text=Olá! Vim pelo site e gostaria de saber mais sobre as lembrancinhas personalizadas."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Iniciar Conversa
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

export default Contato;
