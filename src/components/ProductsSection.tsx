import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useDbProducts } from "@/hooks/useProducts";
import type { Product } from "@/data/products";

const ProductsSection = () => {
  const { data: dbProducts, isLoading } = useDbProducts();

  // Convert db products to Product format for ProductCard - show 6 featured (most recent)
  const products: Product[] = (dbProducts || [])
    .filter(p => p.is_active)
    .slice(0, 6)
    .map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description || '',
      longDescription: p.long_description || undefined,
      price: `R$ ${p.price.toFixed(2).replace('.', ',')}`,
      originalPrice: p.original_price ? `R$ ${p.original_price.toFixed(2).replace('.', ',')}` : undefined,
      image: p.images?.[0] || '/placeholder.svg',
      images: p.images || [],
      link: p.elo7_link || '',
      badge: p.badge || undefined,
      rating: Math.round(p.rating || 5),
      category: 'outros' as const,
      occasions: [],
      keywords: p.keywords || [],
      min_quantity: p.min_quantity || undefined,
    }));

  const totalProducts = dbProducts?.filter(p => p.is_active).length || 0;

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
          <div className="text-center mb-16 animate-fade-in">
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
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-12">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* View All CTA */}
          {totalProducts > 0 && (
            <div className="text-center">
              <Link to="/produtos">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-10 py-6 text-lg shadow-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Ver Todos os {totalProducts} Produtos
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                Explore nosso catálogo completo e descubra a lembrancinha perfeita para seu evento
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
