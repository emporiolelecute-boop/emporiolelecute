import { ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyAddToCartProps {
  productName: string;
  price: string;
  /** Ação primária — WhatsApp (orçamento direto, fluxo principal). */
  onWhatsApp: () => void;
  /** Ação secundária — adicionar ao carrinho. */
  onAddToCart: () => void;
  isVisible: boolean;
}

export const StickyAddToCart = ({
  productName,
  price,
  onWhatsApp,
  onAddToCart,
  isVisible,
}: StickyAddToCartProps) => {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border p-3 transition-transform duration-500 md:hidden",
        "pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
      role="region"
      aria-label="Ações rápidas do produto"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-muted-foreground uppercase font-bold truncate max-w-[110px]">
            {productName}
          </span>
          <span className="text-base font-bold text-primary leading-tight">
            {price}
          </span>
        </div>

        <Button
          onClick={onAddToCart}
          variant="outline"
          size="icon"
          className="rounded-full border-primary/40 text-primary hover:bg-primary/10 shrink-0 h-11 w-11"
          aria-label="Adicionar ao carrinho"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>

        <Button
          onClick={onWhatsApp}
          className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold shadow-lg h-11"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
};
