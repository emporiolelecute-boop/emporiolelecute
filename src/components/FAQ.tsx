import { HelpCircle, Clock, Truck, Palette, CreditCard, Gift } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      icon: Clock,
      question: "Qual é o prazo de produção das lembrancinhas?",
      answer: "O prazo de produção varia de acordo com a quantidade e complexidade do pedido. Em média, trabalhamos com 7 a 15 dias úteis para produção. Para pedidos maiores (acima de 100 unidades), recomendamos fazer o pedido com pelo menos 30 dias de antecedência. Entre em contato conosco via WhatsApp para confirmar o prazo para o seu evento específico."
    },
    {
      icon: Truck,
      question: "Vocês enviam para todo o Brasil?",
      answer: "Sim! Enviamos nossas lembrancinhas artesanais para todos os estados do Brasil através dos Correios ou transportadoras parceiras. O frete é calculado de acordo com o CEP de destino e o peso do pedido. Produtos são embalados com muito cuidado para garantir que cheguem perfeitos ao seu destino."
    },
    {
      icon: Palette,
      question: "Posso personalizar as cores e fragrâncias?",
      answer: "Com certeza! Todas as nossas lembrancinhas podem ser totalmente personalizadas. Você pode escolher cores, fragrâncias, embalagens, tags e até mesmo o formato dos sabonetes e velas. Trabalhamos com uma ampla variedade de aromas hipoalergênicos e corantes especiais para criar a lembrancinha perfeita para o seu evento."
    },
    {
      icon: CreditCard,
      question: "Quais são as formas de pagamento aceitas?",
      answer: "Aceitamos diversas formas de pagamento: PIX (com desconto especial), cartão de crédito (em até 12x pelo Mercado Pago), transferência bancária e boleto. Para pedidos maiores, podemos dividir o pagamento em parcelas mediante aprovação. O pagamento pode ser feito diretamente pelo Elo7 ou combinado via WhatsApp."
    },
    {
      icon: Gift,
      question: "Qual é a quantidade mínima de pedido?",
      answer: "Para lembrancinhas personalizadas, a quantidade mínima geralmente é de 20 unidades, mas isso pode variar de acordo com o produto. Para kits especiais ou itens premium, consulte-nos. Temos condições especiais para pedidos acima de 50 e 100 unidades. Entre em contato para saber mais sobre descontos progressivos!"
    },
    {
      icon: HelpCircle,
      question: "Como funciona o processo de encomenda?",
      answer: "É muito simples! 1) Entre em contato pelo WhatsApp ou Elo7 informando o tipo de lembrancinha, quantidade e data do evento. 2) Enviamos um orçamento personalizado com todas as opções. 3) Após aprovação e pagamento de 50% de sinal, iniciamos a produção. 4) Enviamos fotos durante o processo para aprovação. 5) Ao finalizar, cobramos o restante e enviamos seu pedido."
    }
  ];

  return (
    <section 
      id="faq" 
      className="py-20 md:py-28 bg-background relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hearts-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
              <HelpCircle className="h-4 w-4" />
              Dúvidas Frequentes
            </span>
            <h2 id="faq-heading" className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Perguntas <span className="text-primary">Frequentes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas sobre prazos, personalização, formas de pagamento 
              e muito mais sobre nossas lembrancinhas artesanais.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-2xl px-6 shadow-soft overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                      <faq.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-display text-lg md:text-xl text-foreground">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-16 pr-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Não encontrou sua dúvida? Fale conosco!
            </p>
            <a
              href="https://wa.me/5541992214299?text=Olá! Tenho uma dúvida sobre as lembrancinhas."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
