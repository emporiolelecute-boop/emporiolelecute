import { Heart, Sparkles, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import banner from "@/assets/banner.jpg";

const Hero = () => {
  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      aria-label="Seção principal - Empório LeleCute"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dotted-pattern opacity-60" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/50 via-background to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-32 left-10 w-20 h-20 border-dashed-coral opacity-30 animate-pulse-slow" />
      <div className="absolute bottom-40 right-16 w-16 h-16 border-dashed-coral opacity-20 animate-pulse-slow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/3 right-1/4 w-12 h-12 border-dashed-coral opacity-25 animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Ateliê Criativo</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 animate-fade-in-up leading-tight">
            Lembrancinhas Artesanais que{" "}
            <span className="text-primary relative inline-block">
              Perfumam
              <Heart className="absolute -top-2 -right-6 h-6 w-6 text-primary animate-float fill-primary/20" />
            </span>{" "}
            seus Momentos Especiais
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up font-body" style={{ animationDelay: "0.2s" }}>
            Sabonetes artesanais, velas perfumadas e presentes personalizados feitos com{" "}
            <span className="text-primary font-semibold">amor e carinho</span> para maternidade, 
            chá de bebê, batizado, casamento e todas as suas comemorações.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="text-center">
              <p className="text-3xl font-display font-semibold text-primary">81+</p>
              <p className="text-sm text-muted-foreground">Produtos Únicos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-semibold text-primary">37+</p>
              <p className="text-sm text-muted-foreground">Avaliações 5★</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-semibold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Feito à Mão</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a
              href="https://www.elo7.com.br/emporiolelecute"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-8 py-6 text-lg shadow-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                <Gift className="h-5 w-5 mr-2" />
                Ver Produtos no Elo7
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            
            <a
              href="https://wa.me/5541992214299?text=Olá! Vim pelo site e gostaria de fazer um orçamento personalizado."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary-light rounded-full px-8 py-6 text-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Heart className="h-5 w-5 mr-2" />
                Orçamento via WhatsApp
              </Button>
            </a>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Envio para todo Brasil</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Produtos Hipoalergênicos</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Personalização Completa</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#sobre" aria-label="Rolar para próxima seção">
          <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;