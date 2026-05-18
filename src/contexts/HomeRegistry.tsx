// Sprint final — registry de itens já exibidos na home, evita repetição
// entre blocos (BestSellers, ProductsSection, FeaturedKits, FeaturedCollections).
//
// Cada bloco chama `claim(ids)` durante render para registrar o que vai
// renderizar; blocos posteriores usam `filter(ids)` para excluir duplicados.
// Sets vivem em refs (não disparam re-render); são resetados quando o
// provider desmonta (saída da home).
import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";

interface RegistryShape {
  claimProducts: (ids: string[]) => void;
  filterProducts: (ids: string[]) => string[];
  claimKits: (slugs: string[]) => void;
  filterKits: (slugs: string[]) => string[];
  claimCollections: (slugs: string[]) => void;
  filterCollections: (slugs: string[]) => string[];
}

const noop: RegistryShape = {
  claimProducts: () => {},
  filterProducts: (ids) => ids,
  claimKits: () => {},
  filterKits: (slugs) => slugs,
  claimCollections: () => {},
  filterCollections: (slugs) => slugs,
};

const HomeRegistryContext = createContext<RegistryShape>(noop);

export function HomeRegistryProvider({ children }: { children: ReactNode }) {
  const productsRef = useRef<Set<string>>(new Set());
  const kitsRef = useRef<Set<string>>(new Set());
  const collectionsRef = useRef<Set<string>>(new Set());

  const value = useMemo<RegistryShape>(() => ({
    claimProducts: (ids) => ids.forEach((id) => productsRef.current.add(id)),
    filterProducts: (ids) => ids.filter((id) => !productsRef.current.has(id)),
    claimKits: (slugs) => slugs.forEach((s) => kitsRef.current.add(s)),
    filterKits: (slugs) => slugs.filter((s) => !kitsRef.current.has(s)),
    claimCollections: (slugs) => slugs.forEach((s) => collectionsRef.current.add(s)),
    filterCollections: (slugs) => slugs.filter((s) => !collectionsRef.current.has(s)),
  }), []);

  return (
    <HomeRegistryContext.Provider value={value}>
      {children}
    </HomeRegistryContext.Provider>
  );
}

export function useHomeRegistry() {
  return useContext(HomeRegistryContext);
}
