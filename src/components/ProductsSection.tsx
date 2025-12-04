import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const ProductsSection = () => {
  // Show first 9 products on homepage
  const featuredProducts = products.slice(0, 9);
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>();
  const [gridRef, gridVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section 
      id="produtos" 
      className="py-20 md:py-28 bg-cream/50 relative overflow-hidden"
      aria-labelledby="produtos-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dotted-pattern opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div 
            ref={headerRef}
            className={`text-center mb-16 transition-all duration-700 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
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
          <div 
            ref={gridRef}
            className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 transition-all duration-700 ${
              gridVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="transition-all duration-500"
                style={{ 
                  transitionDelay: gridVisible ? `${index * 100}ms` : "0ms",
                  opacity: gridVisible ? 1 : 0,
                  transform: gridVisible ? "translateY(0)" : "translateY(30px)"
                }}
              >
                <Link to={`/produtos/${product.slug}`}>
                  <ProductCard product={product} />
                </Link>
              </div>
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center">
            <Link to="/produtos">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-10 py-6 text-lg shadow-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ver Todos os {products.length} Produtos
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Explore nosso catálogo completo e descubra a lembrancinha perfeita para seu evento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
