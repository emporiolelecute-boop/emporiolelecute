import { useState, useEffect } from "react";
import { Heart, Sparkles, ChevronLeft, ChevronRight, Truck, Percent, Headset, CreditCard, MessageCircle } from "lucide-react";

import { BlurImage } from "@/components/BlurImage";
import sabonetesImg from "@/assets/category-sabonetes.webp";
import lembrancinhasImg from "@/assets/category-lembrancinhas.webp";
import kitsImg from "@/assets/category-kits.webp";

const slides = [
  {
    tagline: "Para qualquer idade e ocasião",
    title: "Lembrancinhas de qualidade premium",
    subtitle: "Cada produto é feito sob encomenda com ingredientes naturais e embalagem especial.",
    image: sabonetesImg,
  },
  {
    tagline: "Ateliê Criativo",
    title: "Lembrancinhas Artesanais que Perfumam seus Momentos",
    subtitle: "Sabonetes artesanais, velas perfumadas e presentes personalizados feitos com amor e carinho.",
    image: lembrancinhasImg,
  },
  {
    tagline: "100% Personalizado",
    title: "Sua celebração com um toque especial",
    subtitle: "Cores, aromas, embalagens e tags personalizadas para seu evento perfeito.",
    image: kitsImg,
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
      className="relative flex flex-col justify-center pt-20 pb-10 md:pb-14 overflow-hidden bg-background"
      aria-label="Seção principal - Empório LeleCute"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dotted-pattern opacity-30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-32 right-[15%] text-amber-400">
        <Sparkles className="h-8 w-8 animate-pulse-slow" fill="currentColor" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 py-10 md:py-16 lg:py-20">
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
              <BlurImage
                src={slides[currentSlide].image}
                alt="Lembrancinhas Artesanais Empório LeleCute"
                width={600}
                priority={currentSlide === 0}
                aspect="aspect-square"
                sizes="(max-width: 1024px) 90vw, 500px"
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
      
      {/* Trust Badges + WhatsApp CTA */}
      <aside
        aria-label="Informações de envio, pagamento e atendimento"
        className="relative z-10 mt-6 md:mt-10 border-t border-border/50 bg-cream/40 py-6 md:py-8"
      >
        <div className="container mx-auto px-4">
          <ul
            role="list"
            className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-8 lg:gap-x-12 items-start"
          >
            {[
              { Icon: Truck, title: "Envio para", subtitle: "Todo o Brasil", aria: "Envio para todo o Brasil" },
              { Icon: Percent, title: "Descontos", subtitle: "3% PIX", aria: "Descontos de 3% no PIX" },
              { Icon: Headset, title: "Atendimento", subtitle: "Personalizado", aria: "Atendimento personalizado" },
              { Icon: CreditCard, title: "Pague com Cartão", subtitle: "Até 3x sem juros", aria: "Pague com cartão em até 3x sem juros" },
            ].map(({ Icon, title, subtitle, aria }) => (
              <li
                key={title}
                aria-label={aria}
                className="flex items-center justify-center md:justify-start gap-3 text-foreground"
              >
                <Icon className="h-7 w-7 md:h-8 md:w-8 text-primary shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <div className="leading-tight">
                  <div className="text-sm md:text-base font-semibold">{title}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{subtitle}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-center">
            <a
              href="https://wa.me/5541992214299?text=Ol%C3%A1!%20Gostaria%20de%20um%20atendimento%20personalizado%20do%20Emp%C3%B3rio%20LeleCute."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp para atendimento personalizado"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white text-sm font-semibold shadow-md hover:scale-105 transition-transform"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Atendimento no WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default HeroSlider;