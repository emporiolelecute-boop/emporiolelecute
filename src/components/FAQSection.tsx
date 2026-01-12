import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useFaqs } from "@/hooks/useFaqs";
import { Skeleton } from "@/components/ui/skeleton";
import FAQStructuredData from "@/components/FAQStructuredData";

const FAQSection = () => {
  const { data: faqs, isLoading } = useFaqs();

  // Fallback FAQs if database is empty
  const defaultFaqs = [
    {
      id: '1',
      question: "Qual é o prazo de produção das lembrancinhas?",
      answer: "O prazo de produção varia de acordo com o produto e quantidade. Em média, leva de 7 a 15 dias úteis após a confirmação do pagamento. Para pedidos urgentes, consulte disponibilidade via WhatsApp."
    },
    {
      id: '2',
      question: "Vocês enviam para todo o Brasil?",
      answer: "Sim! Realizamos entregas para todos os estados do Brasil via Correios ou transportadoras. O frete é calculado conforme o CEP de destino, peso e dimensões do pedido."
    },
    {
      id: '3',
      question: "Posso personalizar as cores e fragrâncias?",
      answer: "Com certeza! Todas as nossas lembrancinhas são 100% personalizáveis. Você pode escolher cores, aromas, embalagens e adicionar nomes, datas e mensagens especiais."
    },
    {
      id: '4',
      question: "Quais são as formas de pagamento aceitas?",
      answer: "Aceitamos PIX (com 7% de desconto), cartão de crédito (parcelamento em até 3x sem juros), boleto bancário e Mercado Pago."
    },
    {
      id: '5',
      question: "Qual é a quantidade mínima de pedido?",
      answer: "A quantidade mínima varia por produto e está informada na descrição de cada um. Consulte cada produto ou fale conosco para mais informações."
    },
    {
      id: '6',
      question: "Como funciona o processo de encomenda?",
      answer: "É simples: 1) Escolha o modelo que deseja encomendar, 2) Defina a quantidade e adicione ao carrinho, 3) No carrinho, preencha seus dados e clique em 'Finalizar no WhatsApp', 4) Você será direcionado ao WhatsApp para cálculo de frete e pagamento do pedido."
    }
  ];

  // Filter only visible FAQs from database
  const visibleFaqs = faqs?.filter(faq => faq.is_visible !== false) || [];
  const displayFaqs = visibleFaqs.length > 0 ? visibleFaqs : defaultFaqs;

  return (
    <>
      {/* Schema.org FAQPage Structured Data for SEO */}
      <FAQStructuredData faqs={displayFaqs} />
      
      <section 
        id="faq" 
        className="py-16 md:py-24 bg-background relative overflow-hidden"
        aria-labelledby="faq-heading"
      >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hearts-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="font-display text-3xl md:text-5xl text-foreground mb-4">
              Perguntas <span className="font-script text-primary italic">Frequentes</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tire suas dúvidas sobre prazos, personalização, formas de pagamento e muito mais sobre nossas lembrancinhas artesanais.
            </p>
          </div>

          {/* FAQ Accordion */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {displayFaqs.map((faq, index) => (
                <AccordionItem 
                  key={faq.id || index} 
                  value={`item-${faq.id || index}`}
                  className="bg-card border border-border rounded-xl px-6 shadow-soft overflow-hidden data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="hover:no-underline py-5 text-left">
                    <span className="font-medium text-foreground pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* CTA */}
          <div className="text-center mt-10 bg-primary-light/50 rounded-2xl p-8 border border-primary/20">
            <p className="text-foreground font-medium mb-2">
              Não encontrou sua dúvida? Fale conosco!
            </p>
            <a
              href="https://wa.me/5541992214299?text=Olá! Tenho uma dúvida sobre as lembrancinhas."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-6 text-lg mt-4"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

export default FAQSection;
