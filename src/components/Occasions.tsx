import { Baby, Heart, Church, Gift, Cake, Sparkles } from "lucide-react";

const Occasions = () => {
  const occasions = [
    {
      icon: Baby,
      title: "Maternidade",
      description: "Lembrancinhas delicadas para celebrar a chegada do bebê. Sabonetes e velas personalizadas com o nome e tema do pequeno.",
      keywords: "lembrancinhas maternidade, nascimento bebê, presente recém-nascido",
    },
    {
      icon: Sparkles,
      title: "Chá de Bebê",
      description: "Surpreenda os convidados do chá revelação ou chá de fraldas com lembrancinhas artesanais encantadoras e perfumadas.",
      keywords: "chá de bebê, chá revelação, chá de fraldas, lembrancinhas chá",
    },
    {
      icon: Church,
      title: "Batizado",
      description: "Celebre a bênção do batismo com sabonetes em formato de anjo, pomba, terço e símbolos religiosos personalizados.",
      keywords: "lembrancinhas batizado, batismo, primeira comunhão, crisma",
    },
    {
      icon: Heart,
      title: "Casamento",
      description: "Lembrancinhas elegantes para o grande dia. Sabonetes com iniciais dos noivos, velas aromáticas e kits especiais.",
      keywords: "lembrancinhas casamento, noivos, matrimônio, bodas",
    },
    {
      icon: Cake,
      title: "Aniversário",
      description: "Festas infantis ou adultas ficam mais especiais com lembrancinhas temáticas personalizadas com cores e aromas.",
      keywords: "lembrancinhas aniversário, festa infantil, festa adulto",
    },
    {
      icon: Gift,
      title: "Eventos Corporativos",
      description: "Kits presenteáveis personalizados para brindes corporativos, datas comemorativas e eventos empresariais.",
      keywords: "brindes corporativos, presentes empresa, eventos corporativos",
    },
  ];

  return (
    <section 
      id="ocasioes" 
      className="py-20 md:py-28 bg-background relative overflow-hidden"
      aria-labelledby="ocasioes-heading"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary-light/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-cream/50 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
              <Heart className="h-4 w-4 fill-primary" />
              Ocasiões Especiais
            </span>
            <h2 id="ocasioes-heading" className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Lembrancinhas para <span className="text-primary">Cada Momento</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seja qual for a celebração, temos a lembrancinha perfeita para eternizar 
              seus momentos especiais com muito carinho e personalização.
            </p>
          </div>

          {/* Occasions Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasions.map((occasion, index) => (
              <article 
                key={occasion.title}
                className="bg-card rounded-2xl p-8 shadow-card border border-border/50 hover:shadow-medium hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <occasion.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                
                {/* Title */}
                <h3 className="font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                  {occasion.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {occasion.description}
                </p>
                
                {/* Hidden keywords for SEO */}
                <span className="sr-only">{occasion.keywords}</span>
                
                {/* Link */}
                <a 
                  href="https://wa.me/5541992214299?text=Olá! Gostaria de um orçamento para lembrancinhas de ${occasion.title.toLowerCase()}."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-300"
                >
                  Solicitar Orçamento
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center bg-gradient-to-r from-primary-light via-cream to-primary-light rounded-2xl p-8 md:p-12">
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-4">
              Não encontrou a ocasião perfeita?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Criamos lembrancinhas para qualquer tipo de evento! Entre em contato 
              e conte-nos sobre sua celebração especial.
            </p>
            <a
              href="https://wa.me/5541992214299?text=Olá! Tenho um evento especial e gostaria de um orçamento personalizado."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-full font-semibold shadow-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <Gift className="h-5 w-5" />
              Criar Lembrancinha Personalizada
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Occasions;