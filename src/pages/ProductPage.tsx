import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Star, 
  Send, 
  ExternalLink, 
  Truck, 
  Shield, 
  Clock, 
  Heart, 
  Package,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import Chatbot from "@/components/Chatbot";
import { useDbProduct, useDbProducts } from "@/hooks/useProducts";
import { trackProductView, trackInquiry } from "@/lib/analytics";
import type { Product } from "@/data/products";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: dbProduct, isLoading } = useDbProduct(slug || "");
  const { data: allProducts } = useDbProducts();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(10);
  const [cep, setCep] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "" });
  const { toast } = useToast();

  // Convert to display format
  const product = dbProduct ? {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description || '',
    longDescription: dbProduct.long_description || undefined,
    price: dbProduct.price,
    originalPrice: dbProduct.original_price,
    images: dbProduct.images,
    link: dbProduct.elo7_link || '',
    badge: dbProduct.badge || undefined,
    rating: Math.round(dbProduct.rating),
    minQuantity: dbProduct.min_quantity,
    pixDiscount: dbProduct.pix_discount,
    productionDays: dbProduct.production_days,
  } : null;

  // Related products
  const relatedProducts: Product[] = (allProducts || [])
    .filter(p => p.is_active && p.id !== dbProduct?.id)
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description || '',
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
    }));

  // Track product view
  useEffect(() => {
    if (product) {
      trackProductView(product.name, product.id, `R$ ${product.price.toFixed(2)}`);
    }
  }, [product]);

  // Set initial quantity to min quantity
  useEffect(() => {
    if (product) {
      setQuantity(product.minQuantity);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsSubmitting(true);
    trackInquiry(product.name, product.id);

    try {
      const { error } = await supabase.functions.invoke("send-order-email", {
        body: { 
          ...formData, 
          product: product.name, 
          quantity,
          type: "product" 
        }
      });

      if (error) throw error;

      toast({
        title: "Pedido enviado! 🎉",
        description: "Entraremos em contato em breve pelo WhatsApp.",
      });
      setIsOpen(false);
      setFormData({ name: "", email: "", whatsapp: "" });
    } catch {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalculateFreight = () => {
    if (cep.length < 8) {
      toast({
        title: "CEP inválido",
        description: "Digite um CEP válido com 8 dígitos.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Frete calculado",
      description: "PAC: R$ 18,90 (5-8 dias úteis) | SEDEX: R$ 32,50 (2-3 dias úteis)",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

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

  // Calculate totals
  const totalPrice = product.price * quantity;
  const pixPrice = totalPrice * (1 - product.pixDiscount / 100);
  const installmentValue = totalPrice / 3;
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
            <span>/</span>
            <Link to="/produtos" className="hover:text-primary transition-colors">Produtos</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image Gallery with Favorite Button */}
            <div className="relative">
              <ProductGallery
                images={product.images.length > 0 ? product.images : ['/placeholder.svg']}
                productName={product.name}
                badge={product.badge}
              />
              
              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 z-10 p-3 bg-card/90 backdrop-blur-sm rounded-full shadow-md hover:bg-card transition-colors"
              >
                <Heart 
                  className={`h-6 w-6 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  }`} 
                />
              </button>

              {/* Reduced Shipping Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 flex items-center gap-1.5">
                  <Truck className="h-4 w-4" />
                  Frete reduzido
                </Badge>
              </div>
            </div>

            {/* Info - Elo7 Style */}
            <div className="flex flex-col">
              <Link 
                to="/produtos" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 w-fit transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar aos produtos
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < product.rating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-muted-foreground/30'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">({product.rating}.0)</span>
              </div>

              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Elo7 Style Pricing Section */}
              <div className="bg-card rounded-xl border border-border p-5 mb-6 space-y-4">
                {/* Unit Price + Min Quantity */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Valor unitário</span>
                    <p className="text-2xl font-semibold text-foreground">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Compra mínima</span>
                    <p className="text-lg font-medium text-foreground">{product.minQuantity} un.</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Total Price with Discount */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        R$ {(product.originalPrice * quantity).toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    {discountPercent && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        -{discountPercent}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou <span className="font-medium">3x sem juros</span> de R$ {installmentValue.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {/* PIX Discount */}
                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.pixDiscount}% no Pix
                  </div>
                  <span className="text-green-700 dark:text-green-400 font-semibold">
                    R$ {pixPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Quantidade:</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.max(product.minQuantity, quantity - 5))}
                      disabled={quantity <= product.minQuantity}
                    >
                      -
                    </Button>
                    <Input 
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.minQuantity, parseInt(e.target.value) || product.minQuantity))}
                      className="w-20 text-center h-8"
                      min={product.minQuantity}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setQuantity(quantity + 5)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Production Time */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-sm font-medium text-foreground">Feito sob encomenda</span>
                  <p className="text-xs text-muted-foreground">Prazo de produção: até {product.productionDays} dias úteis</p>
                </div>
              </div>

              {/* Freight Calculator */}
              <div className="bg-card rounded-xl border border-border p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Calcular frete</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleCalculateFreight}>
                    Calcular
                  </Button>
                </div>
                <a 
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  Não sei meu CEP
                </a>
              </div>

              {/* Buy Button - Elo7 Orange Style */}
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Quero comprar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">
                      Encomendar {product.name}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                      <p className="font-medium">Resumo do pedido:</p>
                      <p className="text-muted-foreground">
                        {quantity}x {product.name} = R$ {totalPrice.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nome completo</label>
                      <Input 
                        required 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        placeholder="Seu nome" 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input 
                        required 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        placeholder="seu@email.com" 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">WhatsApp</label>
                      <Input 
                        required 
                        value={formData.whatsapp} 
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} 
                        placeholder="(41) 99999-9999" 
                        className="mt-1" 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 rounded-lg" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Pedido"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Elo7 Link */}
              {product.link && (
                <a 
                  href={product.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-3"
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full border-2 border-primary text-primary hover:bg-primary-light rounded-lg py-5"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Ver no Elo7
                  </Button>
                </a>
              )}

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-card rounded-lg border border-border/50">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="text-xs font-medium text-foreground">Compra Segura</span>
                    <p className="text-[10px] text-muted-foreground">Proteção garantida</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-card rounded-lg border border-border/50">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <span className="text-xs font-medium text-foreground">Hipoalergênico</span>
                    <p className="text-[10px] text-muted-foreground">Matéria-prima segura</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/5541992214299?text=Olá! Tenho interesse no produto: ${product.name} (${quantity} unidades)`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-4 mt-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Tirar dúvidas no WhatsApp
              </a>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-16">
            <h2 className="font-display text-2xl text-foreground mb-4">Descrição do produto</h2>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-muted-foreground leading-relaxed">
                {product.longDescription || product.description}
              </p>
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
      <Chatbot />
    </div>
  );
};

export default ProductPage;
