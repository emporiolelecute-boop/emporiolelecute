import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Caroline Amorim",
      text: "Excelente compra do começo, meio e fim. Muito obrigada pelo tratamento e cuidado no envio. Indico e comprarei mais vezes.",
      product: "Lembrancinha Sabonete Letra Brasão + Espírito Santo",
      occasion: "Lembrancinhas de aniversário",
      rating: 5,
      date: "26/06/2025",
    },
    {
      id: 2,
      name: "Cintia Queiroz",
      text: "Lembrancinhas linda e feitas com muito cuidado. Ficou exatamente do jeito que pedi.",
      product: "Lembrancinha Sabonete Margarida na Caixinha",
      occasion: "Lembrancinha aniversário",
      rating: 5,
      date: "08/05/2025",
    },
    {
      id: 3,
      name: "Fernanda Martins",
      text: "Os produtos chegaram perfeitos, lindos e cheirosos!",
      product: "Sabonete Letra Brasão + Espírito Santo com Mini Terço",
      occasion: "Batizado",
      rating: 5,
      date: "24/05/2025",
    },
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section 
      id="depoimentos" 
      className="py-20 md:py-28 bg-cream/30 relative overflow-hidden"
      aria-labelledby="depoimentos-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hearts-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-primary" />
              Depoimentos
            </span>
            <h2 id="depoimentos-heading" className="font-display text-4xl md:text-5xl text-foreground mb-6">
              O que Nossas <span className="text-primary">Clientes</span> Dizem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mais de 37 avaliações positivas no Elo7! Confira alguns depoimentos 
              de clientes que amaram suas lembrancinhas personalizadas.
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="relative bg-card rounded-3xl p-8 md:p-12 shadow-medium border border-border/50 mb-12">
            <Quote className="absolute top-8 left-8 h-12 w-12 text-primary/20" />
            
            <div className="relative">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-6 justify-center">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-amber-400 fill-amber-400" />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-xl md:text-2xl font-display text-foreground text-center mb-8 leading-relaxed">
                "{testimonials[activeIndex].text}"
              </blockquote>
              
              {/* Author */}
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg mb-1">
                  {testimonials[activeIndex].name}
                </p>
                <p className="text-primary text-sm mb-1">
                  {testimonials[activeIndex].product}
                </p>
                <p className="text-muted-foreground text-sm">
                  {testimonials[activeIndex].occasion} • {testimonials[activeIndex].date}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:-left-6">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 bg-background rounded-full shadow-soft flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 md:-right-6">
              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 bg-background rounded-full shadow-soft flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Ver depoimento ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-card rounded-xl shadow-card">
              <p className="text-3xl font-display font-semibold text-primary mb-1">37+</p>
              <p className="text-sm text-muted-foreground">Avaliações</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl shadow-card">
              <p className="text-3xl font-display font-semibold text-primary mb-1">5.0</p>
              <p className="text-sm text-muted-foreground">Nota Média</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl shadow-card">
              <p className="text-3xl font-display font-semibold text-primary mb-1">100%</p>
              <p className="text-sm text-muted-foreground">Recomendações</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl shadow-card">
              <p className="text-3xl font-display font-semibold text-primary mb-1">28</p>
              <p className="text-sm text-muted-foreground">Seguidores Elo7</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a 
              href="https://www.elo7.com.br/emporiolelecute/avaliacoes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300"
            >
              Ver todas as 37 avaliações no Elo7
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;