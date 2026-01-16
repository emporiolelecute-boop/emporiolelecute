import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Grid, List, ShoppingBag, Loader2, Tag, ChevronRight, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import Chatbot from "@/components/Chatbot";
import DynamicSEO from "@/components/DynamicSEO";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";
import { useDbProducts, useDbCategories, useDbOccasions } from "@/hooks/useProducts";
import { useTags } from "@/hooks/useTags";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Product } from "@/data/products";

const PRODUCTS_PER_PAGE = 12;

const Produtos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: dbProducts, isLoading: loadingProducts } = useDbProducts();
  const { data: dbCategories } = useDbCategories();
  const { data: dbOccasions } = useDbOccasions();
  const { data: dbTags } = useTags();
  
  const [search, setSearch] = useState(searchParams.get('busca') || searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('categoria') || null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(searchParams.get('ocasiao') || null);
  const [selectedTag, setSelectedTag] = useState<string | null>(searchParams.get('tag') || null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('pagina')) || 1);

  // Debounce search for better performance
  const debouncedSearch = useDebounce(search, 300);

  // Sync URL params with state
  useEffect(() => {
    const urlSearch = searchParams.get('busca') || searchParams.get('search');
    const urlCategoria = searchParams.get('categoria');
    const urlOcasiao = searchParams.get('ocasiao');
    const urlTag = searchParams.get('tag');
    const urlPage = searchParams.get('pagina');
    
    if (urlSearch !== null) setSearch(urlSearch);
    if (urlCategoria !== null) setSelectedCategory(urlCategoria);
    if (urlOcasiao !== null) setSelectedOccasion(urlOcasiao);
    if (urlTag !== null) setSelectedTag(urlTag);
    if (urlPage !== null) setCurrentPage(Number(urlPage) || 1);
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedOccasion, selectedTag]);

  // Helper to find category/occasion/tag by slug or ID
  const findCategoryBySlugOrId = (value: string | null) => {
    if (!value || !dbCategories) return null;
    return dbCategories.find(c => c.slug === value || c.id === value) || null;
  };

  const findOccasionBySlugOrId = (value: string | null) => {
    if (!value || !dbOccasions) return null;
    return dbOccasions.find(o => o.slug === value || o.id === value) || null;
  };

  const findTagBySlugOrId = (value: string | null) => {
    if (!value || !dbTags) return null;
    return dbTags.find(t => t.slug === value || t.id === value) || null;
  };

  // Get resolved filters from URL params
  const resolvedCategory = findCategoryBySlugOrId(selectedCategory);
  const resolvedOccasion = findOccasionBySlugOrId(selectedOccasion);
  const resolvedTag = findTagBySlugOrId(selectedTag);

  // Update URL when filters change - use SLUG for friendly URLs
  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    const newParams = new URLSearchParams(searchParams);
    if (categorySlug) {
      newParams.set('categoria', categorySlug);
    } else {
      newParams.delete('categoria');
    }
    newParams.delete('pagina');
    setSearchParams(newParams);
  };

  const handleOccasionChange = (occasionSlug: string | null) => {
    setSelectedOccasion(occasionSlug);
    const newParams = new URLSearchParams(searchParams);
    if (occasionSlug) {
      newParams.set('ocasiao', occasionSlug);
    } else {
      newParams.delete('ocasiao');
    }
    newParams.delete('pagina');
    setSearchParams(newParams);
  };

  const handleTagChange = (tagSlug: string | null) => {
    setSelectedTag(tagSlug);
    const newParams = new URLSearchParams(searchParams);
    if (tagSlug) {
      newParams.set('tag', tagSlug);
    } else {
      newParams.delete('tag');
    }
    newParams.delete('pagina');
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newParams = new URLSearchParams(searchParams);
    if (page > 1) {
      newParams.set('pagina', String(page));
    } else {
      newParams.delete('pagina');
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedOccasion(null);
    setSelectedTag(null);
    setCurrentPage(1);
    setSearchParams({});
  };

  // Count active filters
  const activeFiltersCount = [resolvedCategory, resolvedOccasion, resolvedTag, debouncedSearch].filter(Boolean).length;

  // Convert db products to Product format with relations
  const products: (Product & { categoryId?: string; occasionIds: string[]; tagIds: string[] })[] = useMemo(() => {
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
        tagIds: (p.tags || []).map(t => t.id),
        tagNames: (p.tags || []).map(t => t.name),
      }));
  }, [dbProducts]);

  // Filter products with debounced search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !debouncedSearch ||
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.keywords.some(k => k.toLowerCase().includes(debouncedSearch.toLowerCase()));
      
      const matchesCategory = !resolvedCategory || product.categoryId === resolvedCategory.id;
      const matchesOccasion = !resolvedOccasion || product.occasionIds.includes(resolvedOccasion.id);
      const matchesTag = !resolvedTag || product.tagIds.includes(resolvedTag.id);
      
      return matchesSearch && matchesCategory && matchesOccasion && matchesTag;
    });
  }, [products, debouncedSearch, resolvedCategory, resolvedOccasion, resolvedTag]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Generate pagination numbers
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Build breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const items = [
      { name: 'Início', url: 'https://emporiolelecute.com.br/' },
      { name: 'Produtos', url: 'https://emporiolelecute.com.br/produtos' },
    ];
    
    if (resolvedCategory) {
      items.push({ 
        name: resolvedCategory.name, 
        url: `https://emporiolelecute.com.br/produtos?categoria=${resolvedCategory.slug}` 
      });
    }
    
    if (resolvedOccasion) {
      items.push({ 
        name: resolvedOccasion.name, 
        url: `https://emporiolelecute.com.br/produtos?ocasiao=${resolvedOccasion.slug}` 
      });
    }
    
    return items;
  }, [resolvedCategory, resolvedOccasion]);

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO
        title={resolvedCategory ? `${resolvedCategory.name} | Empório LeleCute` : "Produtos | Empório LeleCute"}
        description="Catálogo completo de lembrancinhas artesanais: sabonetes, velas perfumadas e kits personalizados para todas as ocasiões."
        url="https://emporiolelecute.com.br/produtos"
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
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

        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
            <ChevronRight className="h-4 w-4" />
            {resolvedCategory || resolvedOccasion ? (
              <>
                <Link to="/produtos" className="hover:text-primary transition-colors">Produtos</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">
                  {resolvedCategory?.name || resolvedOccasion?.name}
                </span>
              </>
            ) : (
              <span className="text-foreground">Produtos</span>
            )}
          </nav>
        </div>

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
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-muted-foreground"
                  >
                    Limpar filtros ({activeFiltersCount})
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Categorias</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!resolvedCategory ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => handleCategoryChange(null)}
              >
                Todas
              </Badge>
              {(dbCategories || []).map((category) => (
                <Badge
                  key={category.id}
                  variant={resolvedCategory?.id === category.id ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  {category.slug === 'sabonetes' ? '🧼' : category.slug === 'velas' ? '🕯️' : category.slug === 'kits' ? '🎁' : '✨'} {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Occasion Filters */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Ocasiões</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!resolvedOccasion ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => handleOccasionChange(null)}
              >
                Todas
              </Badge>
              {(dbOccasions || []).map((occasion) => (
                <Badge
                  key={occasion.id}
                  variant={resolvedOccasion?.id === occasion.id ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => handleOccasionChange(occasion.slug)}
                >
                  {occasion.slug === 'maternidade' ? '👶' : 
                   occasion.slug === 'cha-bebe' ? '🍼' : 
                   occasion.slug === 'batizado' ? '⛪' : 
                   occasion.slug === 'casamento' ? '💒' : 
                   occasion.slug === 'aniversario' ? '🎂' : '🏢'} {occasion.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tag Filters */}
          {dbTags && dbTags.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={!resolvedTag ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => handleTagChange(null)}
                >
                  Todas
                </Badge>
                {dbTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={resolvedTag?.id === tag.id ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => handleTagChange(tag.slug)}
                  >
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4">
          {loadingProducts ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
              </p>
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1 max-w-3xl mx-auto"
              }`}>
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Anterior</span>
                        </PaginationPrevious>
                      </PaginationItem>

                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        >
                          <span>Próxima</span>
                          <ChevronRight className="h-4 w-4" />
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
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
