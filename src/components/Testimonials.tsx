import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";

const fallback = [
  { id: '1', customer_name: 'Caroline Amorim', customer_text: 'Excelente compra do começo, meio e fim. Muito obrigada pelo tratamento e cuidado no envio. Indico e comprarei mais vezes.', product_name: 'Lembrancinha Sabonete Letra Brasão + Espírito Santo', occasion: 'Lembrancinhas de aniversário', rating: 5, testimonial_date: '2025-06-26' },
  { id: '2', customer_name: 'Cintia Queiroz', customer_text: 'Lembrancinhas linda e feitas com muito cuidado. Ficou exatamente do jeito que pedi.', product_name: 'Lembrancinha Sabonete Margarida na Caixinha', occasion: 'Lembrancinha aniversário', rating: 5, testimonial_date: '2025-05-08' },
  { id: '3', customer_name: 'Fernanda Martins', customer_text: 'Os produtos chegaram perfeitos, lindos e cheirosos!', product_name: 'Sabonete Letra Brasão + Espírito Santo com Mini Terço', occasion: 'Batizado', rating: 5, testimonial_date: '2025-05-24' },
];

const formatDate = (d?: string | null) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('pt-BR');
  } catch {
    return d;
  }
};

const Testimonials = () => {
  const { data } = useTestimonials();
  const testimonials = (data && data.length > 0 ? data : fallback) as any[];
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, testimonials.length - 1);
  const current = testimonials[safeIndex];

  const nextTestimonial = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-cream/30 relative overflow-hidden" aria-labelledby="depoimentos-heading">
      <div className="absolute inset-0 bg-hearts-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-primary" />
              Depoimentos
            </span>
            <h2 id="depoimentos-heading" className="font-display text-4xl md:text-5xl text-foreground mb-6">
              O que Nossas <span className="text-primary">Clientes</span> Dizem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Confira alguns depoimentos de clientes que amaram suas lembrancinhas personalizadas.
            </p>
          </div>

          <div className="relative bg-card rounded-3xl p-8 md:p-12 shadow-medium border border-border/50 mb-12">
            <Quote className="absolute top-8 left-8 h-12 w-12 text-primary/20" />

            <div className="relative">
              <div className="flex items-center gap-1 mb-6 justify-center">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl font-display text-foreground text-center mb-8 leading-relaxed">
                "{current.customer_text}"
              </blockquote>

              <div className="text-center">
                <p className="font-semibold text-foreground text-lg mb-1">{current.customer_name}</p>
                {current.product_name && (
                  <p className="text-primary text-sm mb-1">{current.product_name}</p>
                )}
                {(current.occasion || current.testimonial_date) && (
                  <p className="text-muted-foreground text-sm">
                    {current.occasion}{current.occasion && current.testimonial_date ? ' • ' : ''}{formatDate(current.testimonial_date)}
                  </p>
                )}
              </div>
            </div>

            {testimonials.length > 1 && (
              <>
                <div className="absolute top-1/2 -translate-y-1/2 left-4 md:-left-6">
                  <button onClick={prevTestimonial} className="w-12 h-12 bg-background rounded-full shadow-soft flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Depoimento anterior">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 md:-right-6">
                  <button onClick={nextTestimonial} className="w-12 h-12 bg-background rounded-full shadow-soft flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Próximo depoimento">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === safeIndex ? 'bg-primary w-8' : 'bg-primary/30 hover:bg-primary/50'}`}
                      aria-label={`Ver depoimento ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
