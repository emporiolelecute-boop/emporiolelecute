import { Heart, Award, Truck, MessageCircle, Sparkles, Star } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Feito com Amor",
      description: "Cada peça é confeccionada artesanalmente pela Letícia com muito carinho e atenção aos detalhes.",
    },
    {
      icon: Sparkles,
      title: "100% Personalizado",
      description: "Personalize cores, aromas, tags e embalagens de acordo com o tema da sua festa ou evento.",
    },
    {
      icon: Award,
      title: "Qualidade Premium",
      description: "Utilizamos matéria-prima hipoalergênica e de alta qualidade em todos os nossos produtos.",
    },
    {
      icon: Truck,
      title: "Envio Nacional",
      description: "Enviamos para todo o Brasil via PAC ou Sedex, com embalagens seguras e proteção especial.",
    },
  ];

  return (
    <section 
      id="sobre" 
      className="py-20 md:py-28 bg-background relative overflow-hidden"
      aria-labelledby="sobre-heading"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cream rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-primary" />
              Sobre Nós
            </span>
            <h2 id="sobre-heading" className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Conheça a <span className="text-primary">Empório LeleCute</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Fundado pela <strong className="text-foreground">Letícia</strong> em{" "}
              <strong className="text-foreground">São José dos Pinhais/PR</strong>, 
              o Empório LeleCute é um ateliê criativo especializado em lembrancinhas artesanais 
              que transformam momentos especiais em memórias inesquecíveis.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* Image/Visual Side */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-medium group">
                <img 
                  src="https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg"
                  alt="Sabonete artesanal em formato de margarida - exemplo de lembrancinha personalizada Empório LeleCute"
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width="685"
                  height="685"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-primary-foreground font-display text-xl mb-1">
                    "Lembrancinhas lindas e feitas com muito cuidado"
                  </p>
                  <p className="text-primary-foreground/80 text-sm">
                    — Cliente Cintia Queiroz
                  </p>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-medium flex items-center gap-2">
                <Star className="h-4 w-4 fill-primary-foreground" />
                <span className="text-sm font-semibold">37+ Avaliações</span>
              </div>
            </div>

            {/* Text Side */}
            <div className="space-y-6">
              <p className="text-foreground/80 leading-relaxed">
                Sou a <strong>Letícia</strong>, artesã apaixonada por criar lembrancinhas que 
                perfumam e encantam. Aqui na Empório LeleCute, cada sabonete, cada vela e cada 
                presente é feito com dedicação para tornar suas celebrações ainda mais especiais.
              </p>
              
              <p className="text-foreground/80 leading-relaxed">
                Trabalhamos com <strong>sabonetes artesanais personalizados</strong>, 
                <strong> velas perfumadas</strong>, <strong>kits presenteáveis</strong> e uma 
                variedade de lembrancinhas criativas para todas as ocasiões: maternidade, 
                chá de bebê, batizado, casamento, aniversário e muito mais.
              </p>
              
              <div className="bg-primary-light/50 rounded-xl p-6 border border-primary/20">
                <h3 className="font-display text-xl text-foreground mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Atendimento Personalizado
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Oferecemos consultoria direta pelo WhatsApp para criar orçamentos sob medida. 
                  Conte-nos sobre seu evento e criaremos lembrancinhas perfeitas para você!
                </p>
                <a
                  href="https://wa.me/5541992214299?text=Olá Letícia! Gostaria de saber mais sobre as lembrancinhas da Empório LeleCute."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-primary font-semibold hover:underline"
                >
                  Falar com a Letícia
                  <span className="text-lg">💬</span>
                </a>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <article 
                key={feature.title}
                className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-medium hover:-translate-y-1 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;