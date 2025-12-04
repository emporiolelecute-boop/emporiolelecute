import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const ProductsSection = () => {
  // Show first 6 products on homepage
  const featuredProducts = products.slice(0, 6);

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
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
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
                Ver Todos os Produtos
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
