import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Grid, List, ShoppingBag, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import Chatbot from "@/components/Chatbot";
import DynamicSEO from "@/components/DynamicSEO";
import { useDbProducts, useDbCategories, useDbOccasions } from "@/hooks/useProducts";
import type { Product } from "@/data/products";

const Produtos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: dbProducts, isLoading: loadingProducts } = useDbProducts();
  const { data: dbCategories } = useDbCategories();
  const { data: dbOccasions } = useDbOccasions();
  
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('categoria') || null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(searchParams.get('ocasiao') || null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync URL params with state
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategoria = searchParams.get('categoria');
    const urlOcasiao = searchParams.get('ocasiao');
    
    if (urlSearch !== null) setSearch(urlSearch);
    if (urlCategoria !== null) setSelectedCategory(urlCategoria);
    if (urlOcasiao !== null) setSelectedOccasion(urlOcasiao);
  }, [searchParams]);

  // Update URL when filters change
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set('categoria', categoryId);
    } else {
      newParams.delete('categoria');
    }
    setSearchParams(newParams);
  };

  const handleOccasionChange = (occasionId: string | null) => {
    setSelectedOccasion(occasionId);
    const newParams = new URLSearchParams(searchParams);
    if (occasionId) {
      newParams.set('ocasiao', occasionId);
    } else {
      newParams.delete('ocasiao');
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedOccasion(null);
    setSearchParams({});
  };

  // Convert db products to Product format with relations
  const products: (Product & { categoryId?: string; occasionIds: string[] })[] = useMemo(() => {
    return (dbProducts || [])
      .filter(p => p.is_active)
      .map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description || '',
        longDescription: p.long_description || undefined,
        price: `R$ ${p.price.toFixed(2).replace('.', ',')}`,
        originalPrice: p.original_price ? `R$ ${p.original_price.toFixed(2).replace('.', ',')}` : undefined,
        image: p.images[0] || '/placeholder.svg',
        images: p.images,
        link: p.elo7_link || '',
        badge: p.badge || undefined,
        rating: Math.round(p.rating),
        category: 'outros' as const,
        occasions: [],
        keywords: p.keywords,
        categoryId: p.category_id || undefined,
        categoryName: p.category?.name,
        occasionIds: (p.occasions || []).map(o => o.id),
        occasionNames: (p.occasions || []).map(o => o.name),
      }));
  }, [dbProducts]);

  // Categories with icons
  const categories = useMemo(() => {
    return (dbCategories || []).map(c => ({
      id: c.id,
      name: c.name,
      icon: c.slug === 'sabonetes' ? '🧼' : c.slug === 'velas' ? '🕯️' : c.slug === 'kits' ? '🎁' : '✨'
    }));
  }, [dbCategories]);

  // Occasions with icons
  const occasions = useMemo(() => {
    return (dbOccasions || []).map(o => ({
      id: o.id,
      name: o.name,
      icon: o.slug === 'maternidade' ? '👶' : 
            o.slug === 'cha-bebe' ? '🍼' : 
            o.slug === 'batizado' ? '⛪' : 
            o.slug === 'casamento' ? '💒' : 
            o.slug === 'aniversario' ? '🎂' : '🏢'
    }));
  }, [dbOccasions]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      const matchesOccasion = !selectedOccasion || product.occasionIds.includes(selectedOccasion);
      
      return matchesSearch && matchesCategory && matchesOccasion;
    });
  }, [products, search, selectedCategory, selectedOccasion]);

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO
        title="Produtos | Empório LeleCute"
        description="Catálogo completo de lembrancinhas artesanais: sabonetes, velas perfumadas e kits personalizados para todas as ocasiões."
        url="https://emporiolelecute.com.br/produtos"
      />
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

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search and View Toggle */}
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar lembrancinhas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
              <div className="flex gap-2">
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
          </div>

          {/* Category Filters */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Categorias</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => handleCategoryChange(null)}
              >
                Todos
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.icon} {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Occasion Filters */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Ocasiões</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedOccasion === null ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => handleOccasionChange(null)}
              >
                Todas
              </Badge>
              {occasions.map((occasion) => (
                <Badge
                  key={occasion.id}
                  variant={selectedOccasion === occasion.id ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => handleOccasionChange(occasion.id)}
                >
                  {occasion.icon} {occasion.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4">
          {loadingProducts ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1 max-w-3xl mx-auto"
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Nenhum produto encontrado</p>
              <Button onClick={handleClearFilters}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {/* WhatsApp CTA */}
        <div className="container mx-auto px-4 mt-16">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Criamos lembrancinhas personalizadas para qualquer ocasião. 
              Entre em contato pelo WhatsApp e conte-nos sua ideia!
            </p>
            <a
              href="https://wa.me/5541992214299?text=Olá! Gostaria de um orçamento personalizado"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full"
              >
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
