import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Star, Send, ExternalLink, Share2, Truck, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug, products } from "@/data/products";
import { trackProductView, trackInquiry } from "@/lib/analytics";
import { useEffect } from "react";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "" });
  const { toast } = useToast();

  // Track product view
  useEffect(() => {
    if (product) {
      trackProductView(product.name, product.id, product.price);
    }
  }, [product]);

  const relatedProducts = products
    .filter(p => p.id !== product?.id && p.occasions.some(o => product?.occasions.includes(o)))
    .slice(0, 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsLoading(true);
    trackInquiry(product.name, product.id);

    try {
      const { error } = await supabase.functions.invoke("send-order-email", {
        body: { ...formData, product: product.name, type: "product" }
      });

      if (error) throw error;

      toast({
        title: "Pedido enviado! 🎉",
        description: "Entraremos em contato em breve pelo WhatsApp.",
      });
      setIsOpen(false);
      setFormData({ name: "", email: "", whatsapp: "" });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl text-foreground mb-4">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-8">O produto que você procura não existe ou foi removido.</p>
          <Link to="/produtos">
            <Button>Ver todos os produtos</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Início</Link>
            <span>/</span>
            <Link to="/produtos" className="hover:text-primary">Produtos</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-card shadow-lg">
                <img 
                  src={product.image}
                  alt={`${product.name} - Lembrancinha artesanal Empório LeleCute`}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.badge && (
                <span className="absolute top-6 left-6 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <Link to="/produtos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 w-fit">
                <ArrowLeft className="h-4 w-4" />
                Voltar aos produtos
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {[...Array(product.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-muted-foreground">({product.rating}.0)</span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
                {product.name}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {product.longDescription || product.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-display font-semibold text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">{product.originalPrice}</span>
                )}
                <span className="text-sm text-muted-foreground">/ unidade</span>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center p-4 bg-card rounded-xl border border-border/50">
                  <Truck className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs text-center text-muted-foreground">Envio Brasil</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-card rounded-xl border border-border/50">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs text-center text-muted-foreground">Hipoalergênico</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-card rounded-xl border border-border/50">
                  <Palette className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs text-center text-muted-foreground">Personalizável</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground rounded-full py-6">
                      <Send className="h-5 w-5 mr-2" />
                      Fazer Pedido
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">Encomendar {product.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">Nome completo</label>
                        <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Seu nome" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">WhatsApp</label>
                        <Input required value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="(41) 99999-9999" className="mt-1" />
                      </div>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary-dark rounded-full" disabled={isLoading}>
                        {isLoading ? "Enviando..." : "Enviar Pedido"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <a href={product.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full border-2 border-primary text-primary hover:bg-primary-light rounded-full py-6">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Ver no Elo7
                  </Button>
                </a>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/5541992214299?text=Olá! Tenho interesse no produto: ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Tirar dúvidas no WhatsApp
              </a>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-display text-3xl text-foreground text-center mb-8">
                Produtos <span className="text-primary">Relacionados</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductPage;
