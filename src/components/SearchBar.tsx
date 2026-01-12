import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDbProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce the search query for performance (300ms delay)
  const debouncedQuery = useDebounce(query, 300);

  const { data: products = [], isLoading } = useDbProducts();

  // Cache filtered suggestions using memoization
  const suggestions = useMemo(() => {
    if (debouncedQuery.length < 2) return [];
    
    const searchTerm = debouncedQuery.toLowerCase();
    return products
      .filter((product) => {
        // Search across multiple fields for best results
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          (product.description?.toLowerCase().includes(searchTerm)) ||
          (product.category?.name?.toLowerCase().includes(searchTerm)) ||
          (product.occasions?.some((o) => o.name.toLowerCase().includes(searchTerm))) ||
          (product.tags?.some((t) => t.name.toLowerCase().includes(searchTerm))) ||
          (product.keywords?.some((k) => k.toLowerCase().includes(searchTerm)))
        );
      })
      .slice(0, 6);
  }, [debouncedQuery, products]);

  // Show/hide dropdown based on debounced query
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigate(`/produtos/${suggestions[selectedIndex].slug}`);
        setQuery("");
        setIsOpen(false);
      } else if (query.length >= 2) {
        navigate(`/produtos?busca=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  // Show loading only while typing (not on initial load)
  const isSearching = query.length >= 2 && query !== debouncedQuery;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar produtos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => debouncedQuery.length >= 2 && setIsOpen(true)}
          className="pl-9 pr-8 h-9 rounded-full bg-secondary/50 border-border/50 focus:bg-background"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
          {isSearching || isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Buscando...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <ul className="py-2">
                {suggestions.map((product, index) => (
                  <li key={product.id}>
                    <Link
                      to={`/produtos/${product.slug}`}
                      onClick={() => {
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                        index === selectedIndex
                          ? "bg-primary-light"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <img
                        src={product.images?.[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {product.category?.name} • {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to={`/produtos?busca=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-center text-sm text-primary hover:bg-secondary border-t border-border"
              >
                Ver todos os resultados para "{query}"
              </Link>
            </>
          ) : (
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                Nenhum produto encontrado para "{debouncedQuery}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
