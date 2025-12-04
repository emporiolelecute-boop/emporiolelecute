import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.occasions.some((o) => o.toLowerCase().includes(query.toLowerCase()))
      );
      setSuggestions(filtered.slice(0, 6));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [query]);

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
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

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
          onFocus={() => query.length >= 2 && setIsOpen(true)}
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

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
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
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {product.category} • {product.price}
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
        </div>
      )}

      {isOpen && query.length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-xl shadow-lg p-4 z-50 animate-fade-in">
          <p className="text-sm text-muted-foreground text-center">
            Nenhum produto encontrado para "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
