import { useState } from "react";
import { Send, Heart, MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const QuoteFormSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    occasion: "",
    quantity: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-order-email", {
        body: {
          ...formData,
          type: "quote"
        }
      });

      if (error) throw error;

      toast({
        title: "Orçamento enviado! 🎉",
        description: "Entraremos em contato em breve pelo WhatsApp.",
      });
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        occasion: "",
        quantity: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending quote:", error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      id="orcamento" 
      className="py-16 md:py-24 bg-cream/50 relative overflow-hidden"
      aria-labelledby="orcamento-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dotted-pattern opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 id="orcamento-heading" className="font-display text-3xl md:text-5xl text-foreground mb-4">
              Orçamento <span className="font-script text-primary italic">Personalizado</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Preencha o formulário abaixo e receba um orçamento personalizado para suas lembrancinhas. Respondemos em até 24 horas!
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left Column - Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">100% Personalizado</p>
                  <p className="text-sm text-muted-foreground">Cores, aromas e embalagens</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Envio Nacional</p>
                  <p className="text-sm text-muted-foreground">Para todos os estados</p>
                </div>
              </div>
              
              {/* WhatsApp Direct */}
              <div className="bg-card rounded-xl border border-border p-6 mt-8">
                <h3 className="font-display text-lg text-foreground mb-2">
                  Ou fale direto no WhatsApp
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Atendimento rápido e personalizado
                </p>
                <a
                  href="https://wa.me/5541992214299?text=Olá! Gostaria de solicitar um orçamento."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    (41) 99221-4299
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Right Column - Form */}
            <div className="lg:col-span-3 bg-card p-6 md:p-8 rounded-2xl shadow-medium border border-border/50">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome completo *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="mt-1.5"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Email *</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">WhatsApp *</label>
                    <Input
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="(41) 99999-9999"
                      className="mt-1.5"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Ocasião *</label>
                    <Select 
                      value={formData.occasion} 
                      onValueChange={(value) => setFormData({ ...formData, occasion: value })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maternidade">Maternidade</SelectItem>
                        <SelectItem value="cha-bebe">Chá de Bebê</SelectItem>
                        <SelectItem value="batizado">Batizado</SelectItem>
                        <SelectItem value="casamento">Casamento</SelectItem>
                        <SelectItem value="aniversario">Aniversário</SelectItem>
                        <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Quantidade</label>
                    <Input
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="Ex: 50 unidades"
                      className="mt-1.5"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Mensagem</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Descreva o que você precisa, cores preferidas, data do evento..."
                    className="mt-1.5 min-h-[100px]"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-full py-6 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Solicitar Orçamento"}
                  <Send className="h-5 w-5 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteFormSection;