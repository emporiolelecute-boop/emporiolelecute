import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Star, 
  Send, 
  Truck, 
  Shield, 
  Clock, 
  Heart, 
  Package,
  CheckCircle2,
  Loader2,
  Share2,
  ChevronRight,
  Minus,
  Plus,
  MessageCircle,
  ShoppingCart,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/data/products";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: dbProduct, isLoading } = useDbProduct(slug || "");
  const { data: allProducts } = useDbProducts();
  const { addItem } = useCart();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(10);
  const [personalization, setPersonalization] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
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
    weight: dbProduct.weight || 25,
    keywords: dbProduct.keywords || [],
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

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
      personalization,
      minQuantity: product.minQuantity,
      quantity,
    });
    setAddedToCart(true);
  };


  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ 
        title: "Link copiado!", 
        description: "O link do produto foi copiado para a área de transferência." 
      });
    } catch {
      toast({ 
        title: "Erro ao copiar", 
        description: "Não foi possível copiar o link.", 
        variant: "destructive" 
      });
    }
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

  // Generate product code from ID
  const productCode = product.id.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/produtos" className="hover:text-primary transition-colors">Lembrancinhas</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image Gallery - Horizontal layout with thumbnails below */}
            <div className="relative">
              <ProductGallery
                images={product.images.length > 0 ? product.images : ['/placeholder.svg']}
                productName={product.name}
                badge={product.badge}
                layout="horizontal"
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
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 flex items-center gap-1.5">
                  <Truck className="h-4 w-4" />
                  Frete reduzido
                </Badge>
              </div>
            </div>

            {/* Info Section - Reference Style */}
            <div className="flex flex-col">
              {/* Product Name & Rating */}
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < product.rating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-muted-foreground/30'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(45 avaliações)</span>
              </div>

              {/* Price Section - Clean Style */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Preço por unidade</p>
                <p className="text-3xl font-bold text-primary">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {product.description || `Lembrancinha especial com sabonete artesanal. Perfeito para lembrancinhas de maternidade, batizado e eventos especiais.`}
              </p>

              {/* Production Time - Highlighted */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Prazo de produção</p>
                    <p className="text-lg font-semibold text-foreground">Até {product.productionDays} dias úteis</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Código do produto: {productCode}
                </p>
              </div>

              {/* Personalization Field */}
              <div className="bg-card rounded-xl border border-border p-5 mb-6">
                <h3 className="font-semibold text-foreground mb-3">Personalização</h3>
                <Textarea
                  placeholder="Digite o nome, data ou mensagem para personalização..."
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Informe os dados para personalização do seu produto
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">Quantidade</span>
                  <span className="text-sm text-muted-foreground">(Mínimo: {product.minQuantity})</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => quantity > product.minQuantity && setQuantity(quantity - 1)}
                      disabled={quantity <= product.minQuantity}
                      className="p-3 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input 
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= product.minQuantity) {
                          setQuantity(val);
                        } else if (e.target.value === '') {
                          setQuantity(product.minQuantity);
                        }
                      }}
                      className="w-20 text-center border-0 bg-transparent focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min={product.minQuantity}
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    Total: <span className="text-primary">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              {/* Note about shipping */}
              <div className="bg-primary-light/50 rounded-xl border border-primary/20 p-4 mb-6">
                <p className="text-sm text-foreground/80 text-center">
                  <span className="font-semibold text-primary">📦 Frete:</span> O valor do frete será calculado após a confirmação do pedido via WhatsApp.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-4">
                <Button 
                  size="lg" 
                  className={`flex-1 rounded-lg py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all ${
                    addedToCart 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-primary hover:bg-primary-dark text-primary-foreground'
                  }`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Adicionado!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>

                {/* Favorite Button */}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-4"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>

                {/* Share Button */}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-4"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Go to Cart Button - Shows after adding to cart */}
              {addedToCart && (
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all mb-4"
                  onClick={() => navigate('/carrinho')}
                >
                  Finalizar Compra Agora
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              )}


              {/* Trust Badges - Horizontal */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="flex flex-col items-center text-center p-3 bg-card rounded-lg border border-border/50">
                  <Send className="h-5 w-5 text-primary mb-2" />
                  <span className="text-xs font-medium text-foreground">Envio todo Brasil</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-card rounded-lg border border-border/50">
                  <Shield className="h-5 w-5 text-primary mb-2" />
                  <span className="text-xs font-medium text-foreground">Hipoalergênico</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-card rounded-lg border border-border/50">
                  <Heart className="h-5 w-5 text-primary mb-2" />
                  <span className="text-xs font-medium text-foreground">100% Artesanal</span>
                </div>
              </div>

              {/* Tags Section */}
              {product.keywords && product.keywords.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.keywords.map((keyword, index) => (
                      <Link
                        key={index}
                        to={`/produtos?search=${encodeURIComponent(keyword)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-primary-light rounded-full text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Tag className="h-3 w-3" />
                        {keyword}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              <a
                href={`https://wa.me/5541992214299?text=Olá! Tenho interesse no produto: ${product.name} (${quantity} unidades)${personalization ? ` - Personalização: ${personalization}` : ''}`}
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
            <h2 className="font-display text-2xl text-foreground mb-6">Descrição do produto</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Description */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.longDescription || product.description || `${product.name} artesanal da LeleCute.

Cada peça é feita à mão com ingredientes hipoalergênicos de alta qualidade. Perfeito para lembrancinhas de maternidade, chá de bebê, batizado, casamento, aniversário e eventos corporativos.

Personalizamos conforme o tema do seu evento com cores, aromas e papelaria exclusivos.`}
                </p>
              </div>

              {/* Features */}
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Diferenciais
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground">Feito à mão com ingredientes hipoalergênicos</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground">Personalização de cores e aromas</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground">Tag/cinta personalizada com seu tema</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground">Embalagem especial para presente</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground">Aromas: Lavanda, Capim Limão, Mamãe e Bebê</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <div className="bg-card rounded-xl border border-border p-5 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Mínimo</h3>
              <p className="text-sm text-muted-foreground">{product.minQuantity} unidades</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Produção</h3>
              <p className="text-sm text-muted-foreground">Até {product.productionDays} dias úteis</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 text-center">
              <Truck className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Envio</h3>
              <p className="text-sm text-muted-foreground">Para todo Brasil</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Qualidade</h3>
              <p className="text-sm text-muted-foreground">100% artesanal</p>
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