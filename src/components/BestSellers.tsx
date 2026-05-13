import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useDbProducts } from "@/hooks/useProducts";
import type { Product } from "@/data/products";

const BestSellers = () => {
  const { data: dbProducts, isLoading } = useDbProducts();

  // Get products with badges or highest ratings as "best sellers"
  const products: Product[] = (dbProducts || [])
    .filter(p => p.is_active)
    .sort((a, b) => {
      // Prioritize products with badges
      if (a.badge && !b.badge) return -1;
      if (!a.badge && b.badge) return 1;
      // Then sort by rating
      return (b.rating || 5) - (a.rating || 5);
    })
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
      badge: p.badge || "Mais Vendido",
      rating: Math.round(p.rating || 5),
      category: 'outros' as const,
      occasions: [],
      keywords: p.keywords || [],
      min_quantity: p.min_quantity || undefined,
    }));

  return (
    <section 
      id="mais-vendidos" 
      className="py-16 md:py-24 bg-background relative overflow-hidden"
      aria-labelledby="mais-vendidos-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-sm text-muted-foreground uppercase tracking-widest mb-2 block">
              Nossos Favoritos
            </span>
            <h2 id="mais-vendidos-heading" className="font-display text-3xl md:text-4xl text-foreground">
              Mais vendidos
            </h2>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;