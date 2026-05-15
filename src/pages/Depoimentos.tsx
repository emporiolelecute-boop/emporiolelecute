import { Star, Quote, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DynamicSEO from "@/components/DynamicSEO";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";
import { Helmet } from "react-helmet";

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    location: "São Paulo, SP",
    rating: 5,
    text: "Simplesmente perfeitas! As lembrancinhas do chá de bebê ficaram lindas. Todos os convidados amaram e perguntaram onde comprei. O atendimento foi excepcional do início ao fim.",
    product: "Sabonete Ursinho",
    date: "Dezembro 2024",
  },
  {
    id: 2,
    name: "Ana Paula Santos",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Escolhi o Empório LeleCute para as lembrancinhas do batizado da minha filha e não poderia estar mais satisfeita. A qualidade é impecável e o prazo foi cumprido perfeitamente.",
    product: "Vela Anjinho",
    date: "Novembro 2024",
  },
  {
    id: 3,
    name: "Juliana Costa",
    location: "Curitiba, PR",
    rating: 5,
    text: "Já é a terceira vez que compro aqui. Primeiro foi para a maternidade, depois para o batizado e agora para o aniversário de 1 ano. Sempre superando as expectativas!",
    product: "Kit Maternidade",
    date: "Outubro 2024",
  },
  {
    id: 4,
    name: "Fernanda Lima",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "O atendimento pelo WhatsApp foi maravilhoso. Tiraram todas as minhas dúvidas e me ajudaram a escolher a lembrancinha ideal para o meu casamento. Recomendo demais!",
    product: "Sabonete Rosa",
    date: "Setembro 2024",
  },
  {
    id: 5,
    name: "Camila Rodrigues",
    location: "Porto Alegre, RS",
    rating: 5,
    text: "As velas chegaram super bem embaladas e cheirosas. A personalização ficou perfeita. Com certeza vou comprar novamente para outros eventos.",
    product: "Vela Flor de Lotus",
    date: "Agosto 2024",
  },
  {
    id: 6,
    name: "Patrícia Mendes",
    location: "Brasília, DF",
    rating: 5,
    text: "Comprei para um evento corporativo e todos ficaram encantados. A qualidade é premium e o acabamento impecável. Já estou planejando o próximo pedido.",
    product: "Sabonete Corporativo",
    date: "Julho 2024",
  },
  {
    id: 7,
    name: "Renata Oliveira",
    location: "Salvador, BA",
    rating: 5,
    text: "Mesmo com a distância, os produtos chegaram perfeitos e dentro do prazo. A embalagem é linda e os sabonetes são de altíssima qualidade. Adorei!",
    product: "Sabonete Marinheiro",
    date: "Junho 2024",
  },
  {
    id: 8,
    name: "Luciana Ferreira",
    location: "Recife, PE",
    rating: 5,
    text: "Fiz o chá de bebê da minha irmã e escolhi o Empório LeleCute para as lembrancinhas. Foi um sucesso! Todos perguntaram onde encontrar produtos tão lindos.",
    product: "Sabonete Bailarina",
    date: "Maio 2024",
  },
];

const stats = [
  { value: "50.000+", label: "Clientes satisfeitos" },
  { value: "4.9", label: "Avaliação média" },
  { value: "98%", label: "Recomendariam" },
  { value: "5.000+", label: "Avaliações 5 estrelas" },
];

const Depoimentos = () => {
  const breadcrumbItems = [
    { name: 'Início', url: 'https://emporiolelecute.com.br/' },
    { name: 'Depoimentos', url: 'https://emporiolelecute.com.br/depoimentos' },
  ];

  // Review structured data
  const reviewStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://emporiolelecute.com.br/#localbusiness",
    "name": "Empório LeleCute",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.9,
      "reviewCount": 5000,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": testimonials.slice(0, 5).map((t) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": t.name
      },
      "datePublished": "2024-01-01",
      "reviewBody": t.text,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": t.rating,
        "bestRating": 5,
        "worstRating": 1
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO
        title="Depoimentos | Empório LeleCute - O que nossos clientes dizem"
        description="Veja o que nossos clientes dizem sobre as lembrancinhas do Empório LeleCute. Mais de 50 mil clientes satisfeitos com avaliação 4.9 estrelas."
        url="https://emporiolelecute.com.br/depoimentos"
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(reviewStructuredData)}
        </script>
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Depoimentos
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              O que nossos clientes dizem
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mais de 50 mil clientes satisfeitos em todo o Brasil. Confira algumas 
              das avaliações que recebemos.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-primary-light rounded-xl p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <article 
                  key={testimonial.id} 
                  className="bg-card rounded-xl p-6 border border-border/50 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Quote className="h-8 w-8 text-primary/20 mb-3" />
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-primary">{testimonial.product}</span>
                      <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Depoimentos;
