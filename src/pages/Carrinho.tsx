import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/contexts/CartContext";

const Carrinho = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const handleWhatsAppCheckout = () => {
    const itemsList = items
      .map(item => `• ${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')})${item.personalization ? ` - Personalização: ${item.personalization}` : ''}`)
      .join('\n');
    
    const message = `Olá! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    const whatsappUrl = `https://wa.me/5541992214299?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground/50 mb-6" />
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Carrinho vazio
            </h1>
            <p className="text-muted-foreground mb-8">
              Adicione produtos ao carrinho para continuar
            </p>
            <Link to="/produtos">
              <Button className="bg-primary hover:bg-primary/90">
                Ver Produtos
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link 
            to="/produtos" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>

          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-8">
            Meu Carrinho
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-card rounded-xl border border-border p-4 md:p-6"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link to={`/produtos/${item.slug}`} className="shrink-0">
                      <img 
                        src={item.image || '/placeholder.svg'} 
                        alt={item.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/produtos/${item.slug}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      
                      <p className="text-primary font-bold mt-1">
                        R$ {item.price.toFixed(2).replace('.', ',')} / un
                      </p>

                      {item.personalization && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Personalização: {item.personalization}
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= item.minQuantity}
                            className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <Input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || item.minQuantity)}
                            className="w-16 text-center border-0 rounded-none focus-visible:ring-0"
                            min={item.minQuantity}
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          title="Remover item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right hidden md:block">
                      <p className="text-lg font-bold text-foreground">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Item Total */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border md:hidden">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-bold text-foreground">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Limpar carrinho
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-28">
                <h2 className="font-display text-xl text-foreground mb-4">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-muted-foreground">A calcular</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleWhatsAppCheckout}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Finalizar pelo WhatsApp
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Ao clicar, você será direcionado ao WhatsApp para finalizar seu pedido
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Compra 100% segura
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Produtos artesanais de qualidade
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Carrinho;
