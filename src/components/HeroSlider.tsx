import { useState, useEffect } from "react";
import { Heart, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const slides = [
  {
    tagline: "Para qualquer idade e ocasião",
    title: "Lembrancinhas de qualidade premium",
    subtitle: "Cada produto é feito sob encomenda com ingredientes naturais e embalagem especial.",
    image: "https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg",
  },
  {
    tagline: "Ateliê Criativo",
    title: "Lembrancinhas Artesanais que Perfumam seus Momentos",
    subtitle: "Sabonetes artesanais, velas perfumadas e presentes personalizados feitos com amor e carinho.",
    image: "https://img.elo7.com.br/product/685x685/548B92C/lembrancinha-sabonete-borboleta-letra-coracao.jpg",
  },
  {
    tagline: "100% Personalizado",
    title: "Sua celebração com um toque especial",
    subtitle: "Cores, aromas, embalagens e tags personalizadas para seu evento perfeito.",
    image: "https://img.elo7.com.br/product/685x685/576D279/sabonete-lembrancinha-natal-presepio-sagrada-familia-natal-presepio.jpg",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section 
      id="inicio" 
      className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-background"
      aria-label="Seção principal - Empório LeleCute"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dotted-pattern opacity-30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-32 right-[15%] text-amber-400">
        <Sparkles className="h-8 w-8 animate-pulse-slow" fill="currentColor" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <div 
              key={currentSlide}
              className="animate-fade-in"
            >
              {/* Tagline */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{slides[currentSlide].tagline}</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
                {slides[currentSlide].title}
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {slides[currentSlide].subtitle}
              </p>
            </div>
            
            
            {/* Slide Dots */}
            <div className="flex items-center gap-3">
              {slides.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary w-10' 
                      : 'bg-primary/30 w-3 hover:bg-primary/50'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative flex justify-center items-center">
            {/* Decorative Heart */}
            <div className="absolute -bottom-4 right-8 lg:right-16 text-primary z-10">
              <Heart className="h-10 w-10 fill-primary/20 animate-float" />
            </div>
            
            {/* Main Image */}
            <div 
              key={currentSlide}
              className="relative rounded-3xl overflow-hidden shadow-2xl animate-scale-in max-w-md lg:max-w-lg"
            >
              <img 
                src={slides[currentSlide].image}
                alt="Lembrancinhas Artesanais Empório LeleCute"
                className="w-full h-auto object-cover aspect-square"
                loading="eager"
              />
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 lg:-left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Próximo slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Section Below Hero */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cream/80 to-transparent py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-primary">74+</p>
              <p className="text-sm text-muted-foreground">Produtos Únicos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-primary">34+</p>
              <p className="text-sm text-muted-foreground">Avaliações 5★</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Feito à Mão</p>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-muted-foreground">
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
    </section>
  );
};

export default HeroSlider;