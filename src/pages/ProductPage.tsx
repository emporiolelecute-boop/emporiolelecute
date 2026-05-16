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
  Tag,
  Layers,
  Calendar
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
import RelatedProducts from "@/components/RelatedProducts";
import RelatedByTaxonomy from "@/components/RelatedByTaxonomy";
import ProductGallery from "@/components/ProductGallery";
import Chatbot from "@/components/Chatbot";
import DynamicSEO from "@/components/DynamicSEO";
import ProductStructuredData from "@/components/ProductStructuredData";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";
import TrustBadges from "@/components/TrustBadges";
import FAQSection from "@/components/FAQSection";
import { useDbProduct, useDbProducts } from "@/hooks/useProducts";
import { usePaymentConfig } from "@/hooks/useStoreSettings";
import { trackProductView, trackInquiry, buildWhatsAppUrl, trackWhatsAppClick } from "@/lib/analytics";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/data/products";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { whatsappNumber } = useContactInfo();
  const phone = (whatsappNumber || "5541992214299").replace(/\D/g, "");
  const navigate = useNavigate();
  const { data: dbProduct, isLoading } = useDbProduct(slug || "");
  const { data: allProducts } = useDbProducts();
  const { data: paymentConfig } = usePaymentConfig();
  const { addItem } = useCart();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(10);
  const [quantityInput, setQuantityInput] = useState<string>("10");
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
    link: '',
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
      link: '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Set initial quantity to min quantity (only when product changes)
  useEffect(() => {
    if (product) {
      const q = product.minQuantity;
      setQuantity(q);
      setQuantityInput(String(q));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, product?.minQuantity]);

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

  // Calculate totals using store settings
  const totalPrice = product.price * quantity;
  const pixDiscountPercent = paymentConfig?.pix_discount ?? 5;
  const installments = paymentConfig?.installments ?? 3;
  const pixPrice = totalPrice * (1 - pixDiscountPercent / 100);
  const installmentValue = totalPrice / installments;
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : null;

  // Generate product code from ID
  const productCode = product.id.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* SEO and Structured Data */}
      <DynamicSEO
        title={`${product.name} | Empório LeleCute`}
        description={product.description || `Lembrancinha artesanal ${product.name}. Personalizada para ocasiões especiais.`}
        image={product.images[0] || undefined}
        url={`https://emporiolelecute.com.br/produto/${product.slug}`}
        type="product"
      />
      <ProductStructuredData
        name={product.name}
        description={product.description || `Lembrancinha artesanal ${product.name}`}
        price={product.price}
        images={product.images}
        slug={product.slug}
        rating={product.rating}
        productionDays={product.productionDays}
        category={dbProduct?.category?.name}
      />
      <BreadcrumbStructuredData
        items={[
          { name: 'Início', url: 'https://emporiolelecute.com.br/' },
          ...(dbProduct?.segments?.[0]
            ? [{ name: dbProduct.segments[0].name, url: `https://emporiolelecute.com.br/segmento/${dbProduct.segments[0].slug}` }]
            : []),
          ...(dbProduct?.occasions?.[0]
            ? [{ name: dbProduct.occasions[0].name, url: `https://emporiolelecute.com.br/ocasiao/${dbProduct.occasions[0].slug}` }]
            : []),
          ...(dbProduct?.category && !dbProduct?.segments?.[0] && !dbProduct?.occasions?.[0]
            ? [{ name: dbProduct.category.name, url: `https://emporiolelecute.com.br/categoria/${dbProduct.category.slug}` }]
            : []),
          { name: product.name, url: `https://emporiolelecute.com.br/produto/${product.slug}` },
        ]}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>

            {dbProduct?.segments?.[0] && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link to={`/segmento/${dbProduct.segments[0].slug}`} className="hover:text-primary transition-colors">
                  {dbProduct.segments[0].name}
                </Link>
              </>
            )}

            {dbProduct?.occasions?.[0] && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link to={`/ocasiao/${dbProduct.occasions[0].slug}`} className="hover:text-primary transition-colors">
                  {dbProduct.occasions[0].name}
                </Link>
              </>
            )}

            {dbProduct?.category && !dbProduct?.segments?.[0] && !dbProduct?.occasions?.[0] && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link
                  to={`/categoria/${dbProduct.category.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {dbProduct.category.name}
                </Link>
              </>
            )}

            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{product.name}</span>
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
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-1 bg-amber-400 text-white px-2 py-1 rounded-md flex-shrink-0">
                  <Star className="h-4 w-4 fill-white" />
                  <span className="font-bold text-sm">{product.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Category, Occasions & Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Category Badge - using SLUG for friendly URLs */}
                {dbProduct?.category && (
                  <Link
                    to={`/produtos?categoria=${dbProduct.category.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-full text-sm font-medium text-primary transition-colors"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    {dbProduct.category.name}
                  </Link>
                )}
                
                {/* Occasion Badges - using SLUG for friendly URLs */}
                {dbProduct?.occasions && dbProduct.occasions.length > 0 && (
                  dbProduct.occasions.map((occasion) => (
                    <Link
                      key={occasion.id}
                      to={`/produtos?ocasiao=${occasion.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent/80 rounded-full text-sm font-medium text-accent-foreground transition-colors"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {occasion.name}
                    </Link>
                  ))
                )}

                {/* Tags */}
                {dbProduct?.tags && dbProduct.tags.length > 0 && (
                  dbProduct.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/produtos?search=${encodeURIComponent(tag.name)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-xs font-medium text-muted-foreground transition-colors"
                    >
                      <Tag className="h-3 w-3" />
                      {tag.name}
                    </Link>
                  ))
                )}
              </div>

              {/* Price Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valor unitário</p>
                  <p className="text-lg font-semibold text-primary">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Compra mínima</p>
                  <p className="text-lg font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4">
                    {product.minQuantity} unidades
                  </p>
                </div>
              </div>

              {/* Total Price Section */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Valor total</p>
                <p className="text-3xl font-bold text-foreground">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ou {installments}x sem juros de R$ {installmentValue.toFixed(2).replace('.', ',')} no cartão
                </p>
              </div>

              {/* PIX Discount */}
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{pixDiscountPercent}% no Pix
                </span>
                <span className="text-lg font-semibold text-green-600">
                  R$ {pixPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Production Time */}
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Feito sob encomenda</span>
                </div>
                <p className="text-foreground">
                  Produto pronto em até <span className="font-semibold text-amber-600">{product.productionDays} dias úteis</span>
                </p>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {product.description || `Lembrancinha especial com sabonete artesanal. Perfeito para lembrancinhas de maternidade, batizado e eventos especiais.`}
              </p>

              {/* Personalization Field - only show if enabled */}
              {dbProduct?.personalization_enabled !== false && (
                <div className="bg-card rounded-xl border border-border p-5 mb-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    {dbProduct?.personalization_label || 'Personalização'}
                  </h3>
                  <Textarea
                    placeholder={dbProduct?.personalization_placeholder || 'Digite o nome, data ou mensagem para personalização...'}
                    value={personalization}
                    onChange={(e) => setPersonalization(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">Quantidade</span>
                  <span className="text-sm text-muted-foreground">(Mínimo: {product.minQuantity})</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button 
                      type="button"
                      onClick={() => {
                        const next = Math.max(product.minQuantity, quantity - 1);
                        setQuantity(next);
                        setQuantityInput(String(next));
                      }}
                      disabled={quantity <= product.minQuantity}
                      className="p-3 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input 
                      type="number"
                      inputMode="numeric"
                      value={quantityInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setQuantityInput(raw);
                        const parsed = Number(raw);
                        if (Number.isFinite(parsed) && parsed >= product.minQuantity) {
                          setQuantity(parsed);
                        }
                      }}
                      onBlur={() => {
                        const parsed = Number(quantityInput);
                        const next = Number.isFinite(parsed) && parsed >= product.minQuantity ? parsed : product.minQuantity;
                        setQuantity(next);
                        setQuantityInput(String(next));
                      }}
                      className="w-20 text-center border-0 bg-transparent focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min={product.minQuantity}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const next = quantity + 1;
                        setQuantity(next);
                        setQuantityInput(String(next));
                      }}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Note about shipping */}
              <div className="bg-primary-light/50 rounded-xl border border-primary/20 p-4 mb-6">
                <p className="text-sm text-foreground/80 text-center">
                  <span className="font-semibold text-primary">📦 Frete:</span> O valor do frete é calculado via WhatsApp.
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


              {/* Payment Methods */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-3">Formas de pagamento:</p>
                <div className="flex flex-wrap gap-2">
                  {paymentConfig?.accepted_methods?.pix && (
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      PIX
                    </span>
                  )}
                  {paymentConfig?.accepted_methods?.credit_card && (
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Cartão de Crédito
                    </span>
                  )}
                  {paymentConfig?.accepted_methods?.boleto && (
                    <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      Boleto Bancário
                    </span>
                  )}
                </div>
              </div>

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
              {(() => {
                const utmCampaign = `produto_${product.slug}`;
                const waMsg = `Olá! Gostaria de fazer um orçamento do produto: *${product.name}*

📝 *Detalhes:*
- Quantidade: ${quantity} unidades
${personalization ? `- Personalização: ${personalization}` : ''}
- Link: ${window.location.href}

Poderia me ajudar com o valor do frete e prazos?`;
                const waUrl = buildWhatsAppUrl({
                  phone,
                  message: waMsg,
                  utm_source: "pdp",
                  utm_medium: "whatsapp_cta",
                  utm_campaign: utmCampaign,
                  utm_content: product.slug,
                });
                return (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackInquiry(product.name, product.id);
                      trackWhatsAppClick({ source: "product_page", context: product.slug, utm_campaign: utmCampaign });
                    }}
                    className="flex items-center justify-center gap-3 p-4 mt-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <MessageCircle className="h-6 w-6" />
                    Fazer Orçamento no WhatsApp
                  </a>
                );
              })()}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-16">
            <h2 className="font-display text-2xl text-foreground mb-6">Descrição do produto</h2>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.longDescription || product.description || `${product.name} artesanal da LeleCute.

Cada peça é feita à mão com ingredientes hipoalergênicos de alta qualidade. Perfeito para lembrancinhas de maternidade, chá de bebê, batizado, casamento, aniversário e eventos corporativos.

Personalizamos conforme o tema do seu evento com cores, aromas e papelaria exclusivos.`}
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

      <TrustBadges />
      <FAQSection />

      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
};

export default ProductPage;