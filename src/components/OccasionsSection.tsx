import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const occasions = [
  {
    title: "Maternidade",
    description: "Lembrancinhas delicadas para celebrar a chegada do bebê. Sabonetes e velas personalizadas com o nome e tema do pequeno.",
    image: "https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg",
  },
  {
    title: "Chá de Bebê",
    description: "Surpreenda os convidados do chá revelação ou chá de fraldas com lembrancinhas artesanais encantadoras e perfumadas.",
    image: "https://img.elo7.com.br/product/685x685/548B92C/lembrancinha-sabonete-borboleta-letra-coracao.jpg",
  },
  {
    title: "Batizado",
    description: "Celebre a bênção do batismo com sabonetes em formato de anjo, pomba, terço e símbolos religiosos personalizados.",
    image: "https://img.elo7.com.br/product/685x685/5663EE8/lembrancinha-sabonete-brasao-2-letras.jpg",
  },
  {
    title: "Casamento",
    description: "Lembrancinhas elegantes para o grande dia. Sabonetes com iniciais dos noivos, velas aromáticas e kits especiais.",
    image: "https://img.elo7.com.br/product/685x685/54800D6/lembrancinha-sabonete-margarida-na-caixinha-margarida.jpg",
  },
  {
    title: "Aniversário",
    description: "Festas infantis ou adultas ficam mais especiais com lembrancinhas temáticas personalizadas com cores e aromas.",
    image: "https://img.elo7.com.br/product/685x685/548BDE7/lembrancinha-sabonete-fundo-do-mar-letra-mini-coracao.jpg",
  },
  {
    title: "Eventos Corporativos",
    description: "Kits presenteáveis personalizados para brindes corporativos, datas comemorativas e eventos empresariais.",
    image: "https://img.elo7.com.br/product/685x685/576D279/sabonete-lembrancinha-natal-presepio-sagrada-familia-natal-presepio.jpg",
  },
];

const OccasionsSection = () => {
  return (
    <section 
      id="ocasioes" 
      className="py-16 md:py-24 bg-cream/30 relative overflow-hidden"
      aria-labelledby="ocasioes-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 id="ocasioes-heading" className="font-display text-3xl md:text-5xl text-foreground mb-4">
              Ocasiões <span className="font-script text-primary italic">Especiais</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Seja qual for a celebração, temos a lembrancinha perfeita para eternizar seus momentos especiais com muito carinho e personalização.
            </p>
          </div>

          {/* Occasions Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {occasions.map((occasion, index) => (
              <article 
                key={occasion.title}
                className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 hover:shadow-medium hover:-translate-y-2 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={occasion.image}
                    alt={occasion.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl text-foreground mb-2">
                    {occasion.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {occasion.description}
                  </p>
                  
                  {/* CTA Button */}
                  <a 
                    href={`https://wa.me/5541992214299?text=Olá! Gostaria de um orçamento para lembrancinhas de ${occasion.title}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary rounded-full font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Solicitar Orçamento
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-foreground/90 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="font-display text-2xl md:text-3xl text-primary-foreground mb-4">
              Não encontrou a ocasião perfeita?
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Criamos lembrancinhas para qualquer tipo de evento! Entre em contato e conte-nos sobre sua celebração especial.
            </p>
            <a
              href="https://wa.me/5541992214299?text=Olá! Gostaria de criar uma lembrancinha personalizada para meu evento."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-8 py-6 text-lg shadow-lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Criar Lembrancinha Personalizada
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OccasionsSection;