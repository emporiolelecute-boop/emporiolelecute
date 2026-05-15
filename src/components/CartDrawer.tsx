import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export const CartDrawer = () => {
  const { items, removeItem, updateQuantity, total, isDrawerOpen, setIsDrawerOpen } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    navigate("/carrinho");
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-display text-2xl">
              <ShoppingBag className="h-6 w-6 text-primary" />
              Seu Carrinho
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-6">Seu carrinho está vazio</p>
              <Button 
                variant="outline" 
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-full"
              >
                Começar a Comprar
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm text-foreground line-clamp-2 pr-4">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-primary font-semibold mb-3">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-muted"
                          disabled={item.quantity <= item.minQuantity}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Mín: {item.minQuantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <SheetFooter className="p-6 border-t bg-muted/30 block">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Subtotal</span>
                <span className="text-primary">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Frete e prazos calculados na finalização.
              </p>
              <div className="grid gap-3">
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-full py-6 text-lg"
                >
                  Finalizar Pedido
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full rounded-full"
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
