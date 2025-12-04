import { ExternalLink, Heart, Star, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  link: string;
  badge?: string;
  rating: number;
}

const Products = () => {
  const products: Product[] = [
    {
      id: "1",
      name: "Sabonete Margarida na Caixinha",
      description: "Sabonetes artesanais em formato de margarida, decorados e embalados em caixinhas elegantes. Perfeitos como lembrancinhas personalizadas de chá de bebê, maternidade ou aniversário. Feito com matéria-prima hipoalergênica.",
      price: "R$ 4,60",
      image: "https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg",
      link: "https://www.elo7.com.br/lembrancinha-sabonete-margarida-na-caixinha/dp/1FB93C8",
      badge: "Mais Vendido",
      rating: 5,
    },
    {
      id: "2",
      name: "Vela Margarida Perfumada",
      description: "Mini vela perfumada em formato de margarida com cartão personalizado. Produzida com cera vegetal e pavio de algodão, esta vela aromática traz charme a qualquer decoração. Ideal para lembrancinhas de casamento ou maternidade.",
      price: "R$ 7,60",
      originalPrice: "R$ 8,50",
      image: "https://img.elo7.com.br/product/685x685/54800D6/lembrancinha-sabonete-margarida-na-caixinha-margarida.jpg",
      link: "https://www.elo7.com.br/vela-margarida-perfumada-cartao-personalizado/dp/1FB93E2",
      badge: "Promoção",
      rating: 5,
    },
    {
      id: "3",
      name: "Sabonete Borboleta + Letra + Coração",
      description: "Lindo conjunto de sabonetes artesanais com borboleta, letra personalizada e mini coração. Embalagem delicada ideal para chá de bebê, aniversário infantil ou maternidade. Personalização completa de cores e aromas.",
      price: "R$ 4,60",
      image: "https://img.elo7.com.br/product/685x685/548B92C/lembrancinha-sabonete-borboleta-letra-coracao.jpg",
      link: "https://www.elo7.com.br/lembrancinha-sabonete-borboleta-letra-coracao/dp/1FB93BF",
      badge: "Personalizável",
      rating: 5,
    },
  ];

  const getBadgeStyles = (badge?: string) => {
    switch (badge) {
      case "Mais Vendido":
        return "bg-primary text-primary-foreground";
      case "Promoção":
        return "bg-green-500 text-white";
      case "Personalizável":
        return "bg-coral-dark text-white";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <section 
      id="produtos" 
      className="py-20 md:py-28 bg-cream/50 relative overflow-hidden"
      aria-labelledby="produtos-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dotted-pattern opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
              <ShoppingBag className="h-4 w-4" />
              Produtos em Destaque
            </span>
            <h2 id="produtos-heading" className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Lembrancinhas que <span className="text-primary">Encantam</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça alguns dos nossos produtos artesanais mais queridos. 
              Cada peça é feita à mão com ingredientes de alta qualidade e pode ser 
              totalmente personalizada para o seu evento.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.map((product, index) => (
              <article 
                key={product.id}
                className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 product-card group"
                itemScope
                itemType="https://schema.org/Product"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image}
                    alt={`${product.name} - Lembrancinha artesanal personalizada Empório LeleCute`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    itemProp="image"
                    width="685"
                    height="685"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyles(product.badge)}`}>
                      {product.badge}
                    </span>
                  )}
                  
                  {/* Favorite Button */}
                  <button 
                    className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                    aria-label="Adicionar aos favoritos"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  
                  {/* Quick View Overlay */}
                  <a 
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <span className="bg-primary-foreground text-foreground px-6 py-3 rounded-full font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Ver no Elo7
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </a>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2" itemProp="ratingValue">{product.rating}.0</span>
                  </div>
                  
                  {/* Name */}
                  <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors" itemProp="name">
                    {product.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3" itemProp="description">
                    {product.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span className="text-2xl font-display font-semibold text-primary" itemProp="price">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                    )}
                    <meta itemProp="priceCurrency" content="BRL" />
                    <meta itemProp="availability" content="https://schema.org/InStock" />
                  </div>
                  
                  {/* CTA Button */}
                  <a 
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300"
                    >
                      Ver Detalhes
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center">
            <a
              href="https://www.elo7.com.br/emporiolelecute"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-10 py-6 text-lg shadow-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ver Todos os 81+ Produtos
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              Acesse nossa loja completa no Elo7 e descubra todas as opções de lembrancinhas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;