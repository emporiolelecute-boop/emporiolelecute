import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  productName: string;
  items?: FAQItem[];
}

export const ProductFAQ = ({ productName, items }: ProductFAQProps) => {
  const defaultItems: FAQItem[] = [
    {
      question: `Como posso personalizar o ${productName}?`,
      answer: "Você pode escolher as cores, aromas, elementos da papelaria (tags) e fitas. Após a confirmação do pedido, entraremos em contato via WhatsApp para alinhar todos os detalhes da arte."
    },
    {
      question: "Qual o prazo de produção?",
      answer: "Nosso prazo médio é de 7 a 15 dias úteis, dependendo da quantidade e complexidade. Para pedidos urgentes, consulte nossa disponibilidade via WhatsApp."
    },
    {
      question: "Vocês enviam para todo o Brasil?",
      answer: "Sim! Enviamos via Correios (PAC ou SEDEX) e transportadoras para todo o território nacional, com embalagens seguras para garantir que seus produtos cheguem perfeitos."
    }
  ];

  const displayItems = items || defaultItems;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": displayItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="mt-16 border-t pt-10">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      
      <h2 className="font-display text-2xl text-foreground mb-6">
        Dúvidas sobre o <span className="text-primary">{productName}</span>
      </h2>
      
      <Accordion type="single" collapsible className="w-full max-w-3xl">
        {displayItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-foreground hover:text-primary transition-colors">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
