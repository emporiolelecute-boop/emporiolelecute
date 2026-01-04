import { useState, useMemo } from "react";
import { Search, Filter, Grid, List, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import Chatbot from "@/components/Chatbot";
import { products, categories, occasions } from "@/data/products";

const Produtos = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesOccasion = !selectedOccasion || product.occasions.includes(selectedOccasion as any);
      
      return matchesSearch && matchesCategory && matchesOccasion;
    });
  }, [search, selectedCategory, selectedOccasion]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-primary-light via-cream to-primary-light py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-dotted-pattern opacity-30" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <ShoppingBag className="h-4 w-4" />
              Catálogo Completo
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Nossas <span className="text-primary">Lembrancinhas</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore nossa coleção completa de sabonetes artesanais, velas perfumadas 
              e kits personalizados para todas as ocasiões especiais.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Filters */}
          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border/50 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, tipo ou palavra-chave..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 py-6 rounded-full"
                />
              </div>
              
              {/* View Mode */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-full"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-full"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Category Filters */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Categorias
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 rounded-full"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todos
                </Badge>
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 rounded-full"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.icon} {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Occasion Filters */}
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground mb-3">Ocasiões</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedOccasion === null ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 rounded-full"
                  onClick={() => setSelectedOccasion(null)}
                >
                  Todas
                </Badge>
                {occasions.map((occ) => (
                  <Badge
                    key={occ.id}
                    variant={selectedOccasion === occ.id ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 rounded-full"
                    onClick={() => setSelectedOccasion(occ.id)}
                  >
                    {occ.icon} {occ.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            Exibindo <span className="font-semibold text-foreground">{filteredProducts.length}</span> produtos
          </p>

          {/* Products Grid */}
          <div className={`grid gap-8 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Nenhum produto encontrado
              </p>
              <Button onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedOccasion(null); }}>
                Limpar filtros
              </Button>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16 p-8 bg-primary-light rounded-2xl">
            <h3 className="font-display text-2xl text-foreground mb-4">
              Não encontrou o que procura?
            </h3>
            <p className="text-muted-foreground mb-6">
              Criamos lembrancinhas sob medida para você! Entre em contato e solicite um orçamento personalizado.
            </p>
            <a
              href="https://wa.me/5541992214299?text=Olá! Gostaria de encomendar uma lembrancinha personalizada."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-8">
                Falar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
};

export default Produtos;
