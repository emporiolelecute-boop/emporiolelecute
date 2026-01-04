import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, MessageCircle, MapPin, User, Mail, Phone, Truck, Package, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
  company: string;
}

interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

const generateOrderCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LC';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Carrinho = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { toast } = useToast();
  
  const [customer, setCustomer] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
  });
  
  const [address, setAddress] = useState<AddressData>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '').slice(0, 8);
    setAddress(prev => ({ ...prev, cep: cleanCep }));
    
    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          }));
          
          // Simulate shipping options based on location
          const baseShipping = data.uf === 'PR' ? 15 : data.uf === 'SP' || data.uf === 'SC' ? 22 : 35;
          setShippingOptions([
            {
              id: 'pac',
              name: 'PAC',
              price: baseShipping,
              days: data.uf === 'PR' ? '3-5 dias úteis' : '5-10 dias úteis',
              company: 'Correios',
            },
            {
              id: 'sedex',
              name: 'SEDEX',
              price: baseShipping + 15,
              days: data.uf === 'PR' ? '1-2 dias úteis' : '2-4 dias úteis',
              company: 'Correios',
            },
            {
              id: 'express',
              name: 'Entrega Expressa',
              price: baseShipping + 25,
              days: '1 dia útil',
              company: 'Região Metropolitana de Curitiba',
            },
          ]);
        } else {
          toast({
            title: "CEP não encontrado",
            description: "Verifique o CEP digitado",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Erro ao buscar CEP",
          description: "Tente novamente",
          variant: "destructive",
        });
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const selectedShippingOption = shippingOptions.find(s => s.id === selectedShipping);
  const shippingPrice = selectedShippingOption?.price || 0;
  const grandTotal = total + shippingPrice;

  const formatWhatsAppMessage = (code: string) => {
    const itemsList = items
      .map((item, index) => 
        `${index + 1}. ${item.name}\n   Qtd: ${item.quantity}x\n   Preço unit: R$ ${item.price.toFixed(2).replace('.', ',')}\n   Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}${item.personalization ? `\n   Personalização: ${item.personalization}` : ''}`
      )
      .join('\n\n');

    return `🛒 *NOVO PEDIDO - EMPÓRIO LELECUTE*\n\n📋 *Código do Pedido:* ${code}\n\n👤 *DADOS DO CLIENTE*\nNome: ${customer.name}\nTelefone: ${customer.phone}\nEmail: ${customer.email}\n\n📍 *ENDEREÇO DE ENTREGA*\nCEP: ${address.cep}\nEndereço: ${address.street} ${address.number}${address.complement ? `, ${address.complement}` : ''}\nCidade: ${address.city} - ${address.state}\n\n📦 *PRODUTOS*\n${itemsList}\n\n🚚 *FRETE SELECIONADO*\nTransportadora: ${selectedShippingOption?.name} - ${selectedShippingOption?.company}\nPrazo: ${selectedShippingOption?.days}\nValor: R$ ${shippingPrice.toFixed(2).replace('.', ',')}\n\n💰 *VALORES*\nSubtotal: R$ ${total.toFixed(2).replace('.', ',')}\nFrete: R$ ${shippingPrice.toFixed(2).replace('.', ',')}\n*TOTAL: R$ ${grandTotal.toFixed(2).replace('.', ',')}*\n\n_Aguardando confirmação e dados para pagamento_`;
  };

  const handleSubmitOrder = async () => {
    // Validation
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os dados pessoais",
        variant: "destructive",
      });
      return;
    }

    if (!address.cep || !address.street || !address.number || !address.city || !address.state) {
      toast({
        title: "Endereço incompleto",
        description: "Preencha o endereço completo",
        variant: "destructive",
      });
      return;
    }

    if (!selectedShipping) {
      toast({
        title: "Selecione o frete",
        description: "Escolha uma opção de entrega",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const code = generateOrderCode();
    setOrderCode(code);

    try {
      // Save order to database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_code: code,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          address_cep: address.cep,
          address_street: address.street,
          address_number: address.number,
          address_complement: address.complement || null,
          address_neighborhood: address.neighborhood || null,
          address_city: address.city,
          address_state: address.state,
          shipping_method: selectedShippingOption?.name || '',
          shipping_company: selectedShippingOption?.company || null,
          shipping_days: selectedShippingOption?.days || null,
          shipping_price: shippingPrice,
          subtotal: total,
          total: grandTotal,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order save error:', orderError);
        throw orderError;
      }

      // Save order items
      if (orderData) {
        const orderItems = items.map(item => ({
          order_id: orderData.id,
          product_name: item.name,
          product_slug: item.slug,
          product_image: item.image,
          quantity: item.quantity,
          unit_price: item.price,
          personalization: item.personalization || null,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Order items save error:', itemsError);
        }
      }

      // Send email to store
      const emailResponse = await supabase.functions.invoke('send-order-email', {
        body: {
          orderCode: code,
          customer,
          address,
          items: items.map(item => ({
            name: item.name,
            slug: item.slug,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
            personalization: item.personalization,
          })),
          shipping: selectedShippingOption,
          subtotal: total,
          shippingPrice,
          total: grandTotal,
        },
      });

      if (emailResponse.error) {
        console.error('Email error:', emailResponse.error);
      }

      // Open WhatsApp with order details
      const whatsappMessage = formatWhatsAppMessage(code);
      const whatsappUrl = `https://wa.me/5541992214299?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      setOrderComplete(true);
      
      toast({
        title: "Pedido enviado! 🎉",
        description: `Código: ${code}. Finalize pelo WhatsApp.`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao enviar pedido",
        description: "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 py-16 text-center max-w-lg">
            <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Pedido Enviado!
            </h1>
            <p className="text-muted-foreground mb-2">
              Seu código de pedido é:
            </p>
            <p className="text-3xl font-bold text-primary mb-6">
              {orderCode}
            </p>
            <p className="text-muted-foreground mb-8">
              Finalize seu pedido pelo WhatsApp. Você receberá uma cópia por email.
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => {
                  const whatsappMessage = formatWhatsAppMessage(orderCode);
                  window.open(`https://wa.me/5541992214299?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                }}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Abrir WhatsApp
              </Button>
              <Link to={`/rastrear?code=${orderCode}`}>
                <Button variant="outline" className="w-full">
                  <Package className="h-5 w-5 mr-2" />
                  Rastrear Pedido
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => {
                  clearCart();
                  navigate('/');
                }}
              >
                Voltar ao Início
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            Finalizar Pedido
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <div className="bg-card rounded-xl border border-border p-4 md:p-6">
                <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Produtos ({items.length})
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <Link to={`/produtos/${item.slug}`} className="shrink-0">
                        <img 
                          src={item.image || '/placeholder.svg'} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/produtos/${item.slug}`}
                          className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-primary font-bold text-sm mt-1">
                          R$ {item.price.toFixed(2).replace('.', ',')} / un
                        </p>
                        {item.personalization && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {item.personalization}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-border rounded overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= item.minQuantity}
                              className="p-1.5 hover:bg-muted transition-colors disabled:opacity-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-muted transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="ml-auto font-bold text-foreground">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Data */}
              <div className="bg-card rounded-xl border border-border p-4 md:p-6">
                <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Dados Pessoais
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={customer.name}
                      onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={customer.email}
                      onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">WhatsApp *</Label>
                    <Input
                      id="phone"
                      placeholder="(41) 99999-9999"
                      value={customer.phone}
                      onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-card rounded-xl border border-border p-4 md:p-6">
                <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Endereço de Entrega
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        value={address.cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        maxLength={9}
                      />
                      {loadingCep && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Rua *</Label>
                    <Input
                      id="street"
                      placeholder="Nome da rua"
                      value={address.street}
                      onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      placeholder="123"
                      value={address.number}
                      onChange={(e) => setAddress(prev => ({ ...prev, number: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      placeholder="Apto, bloco..."
                      value={address.complement}
                      onChange={(e) => setAddress(prev => ({ ...prev, complement: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      placeholder="Bairro"
                      value={address.neighborhood}
                      onChange={(e) => setAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      placeholder="Cidade"
                      value={address.city}
                      onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      placeholder="UF"
                      value={address.state}
                      onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="mt-1"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Options */}
              {shippingOptions.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-4 md:p-6">
                  <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Opções de Entrega
                  </h2>
                  <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedShipping === option.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {option.name} - {option.company}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {option.days}
                            </p>
                          </div>
                          <p className="font-bold text-primary">
                            R$ {option.price.toFixed(2).replace('.', ',')}
                          </p>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-28">
                <h2 className="font-display text-xl text-foreground mb-4">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                    <span className="text-foreground">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-foreground">
                      {selectedShippingOption 
                        ? `R$ ${shippingPrice.toFixed(2).replace('.', ',')}` 
                        : 'Selecione'
                      }
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {grandTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Finalizar pelo WhatsApp
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Você receberá um código de pedido e será direcionado ao WhatsApp
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Compra 100% segura
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Produtos artesanais de qualidade
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Confirmação por email e WhatsApp
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