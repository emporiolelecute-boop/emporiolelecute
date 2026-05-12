import { Heart, Sparkles, Gift, ArrowRight, Instagram, Facebook, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import banner from "@/assets/banner.webp";
import logo from "@/assets/logo.webp";
import { useParallax, useCountUp } from "@/hooks/use-scroll-animation";

const Hero = () => {
  const [parallaxRef, offset] = useParallax(0.3);
  const [productsRef, productsCount] = useCountUp(81, 2000);
  const [reviewsRef, reviewsCount] = useCountUp(37, 2000);

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex flex-col pt-20 overflow-hidden"
      aria-label="Seção principal - Empório LeleCute"
    >
      {/* Full Width Banner Image with Parallax */}
      <div ref={parallaxRef} className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={banner}
          alt="Banner Empório LeleCute - Lembrancinhas Artesanais Personalizadas"
          className="w-full h-full object-cover transition-transform duration-100"
          style={{ transform: `translateY(${offset * 0.5}px)` }}
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        {/* Large Logo Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-lg animate-scale-in">
            <img 
              src={logo}
              alt="Logo Empório LeleCute - Ateliê Criativo"
              className="h-32 md:h-48 lg:h-56 w-auto"
            />
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 bg-background relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dotted-pattern opacity-40" />
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 border-dashed-coral opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-20 right-16 w-12 h-12 border-dashed-coral opacity-20 animate-pulse-slow" style={{ animationDelay: "1s" }} />
        
        <div className="container mx-auto px-4 relative z-10 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ateliê Criativo</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 animate-fade-in-up leading-tight">
              Lembrancinhas Artesanais que{" "}
              <span className="text-primary relative inline-block">
                Perfumam
                <Heart className="absolute -top-2 -right-6 h-6 w-6 text-primary animate-float fill-primary/20" />
              </span>{" "}
              seus Momentos
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up font-body" style={{ animationDelay: "0.2s" }}>
              Sabonetes artesanais, velas perfumadas e presentes personalizados feitos com{" "}
              <span className="text-primary font-semibold">amor e carinho</span> para maternidade, 
              chá de bebê, batizado, casamento e todas as suas comemorações.
            </p>
            
            {/* Stats with Count Up Animation */}
            <div className="flex flex-wrap justify-center gap-8 mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="text-center" ref={productsRef}>
                <p className="text-3xl font-display font-semibold text-primary">{productsCount}+</p>
                <p className="text-sm text-muted-foreground">Produtos Únicos</p>
              </div>
              <div className="text-center" ref={reviewsRef}>
                <p className="text-3xl font-display font-semibold text-primary">{reviewsCount}+</p>
                <p className="text-sm text-muted-foreground">Avaliações 5★</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-semibold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Feito à Mão</p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Link to="/produtos">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-8 py-6 text-lg shadow-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Ver Catálogo
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
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
            
            {/* Social Links */}
            <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <span className="text-sm text-muted-foreground">Siga-nos:</span>
              <a
                href="https://www.instagram.com/emporiolelecute"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                aria-label="Siga no Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/emporiolelecute"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                aria-label="Siga no Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.elo7.com.br/emporiolelecute"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                aria-label="Loja no Elo7"
              >
                <Gift className="h-5 w-5" />
              </a>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <Link to="/envio" className="text-sm hover:text-primary transition-colors">Envio para todo Brasil</Link>
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
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
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
