import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ShoppingBag, Package, MessageCircle, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[80vh]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Decorative 404 */}
            <div className="relative mb-8">
              <h1 className="text-[120px] md:text-[180px] font-display font-bold text-primary/10 leading-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary-light rounded-full p-6">
                  <Heart className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>

            {/* Message */}
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Ops! Página não encontrada
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Parece que você se perdeu no caminho. Mas não se preocupe, 
              temos muitas lembrancinhas lindas esperando por você!
            </p>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <Link to="/">
                <Button className="w-full gap-2 bg-primary hover:bg-primary-dark" size="lg">
                  <Home className="h-5 w-5" />
                  Ir para Início
                </Button>
              </Link>
              <Link to="/produtos">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <ShoppingBag className="h-5 w-5" />
                  Ver Produtos
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="bg-muted/50 rounded-2xl p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Talvez você esteja procurando por:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link 
                  to="/produtos" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full text-sm text-foreground hover:bg-primary-light transition-colors"
                >
                  <Search className="h-4 w-4" />
                  Lembrancinhas
                </Link>
                <Link 
                  to="/rastrear" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full text-sm text-foreground hover:bg-primary-light transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Rastrear Pedido
                </Link>
                <a 
                  href="https://wa.me/5541992214299?text=Olá! Preciso de ajuda com o site."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full text-sm text-foreground hover:bg-green-100 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
