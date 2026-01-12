import { useFaqs } from "@/hooks/useFaqs";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs?: FAQ[];
}

const FAQStructuredData = ({ faqs: propFaqs }: FAQStructuredDataProps) => {
  const { data: dbFaqs } = useFaqs();
  
  // Use provided FAQs or fetch from database
  const faqs = propFaqs || dbFaqs || [];

  if (faqs.length === 0) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default FAQStructuredData;
