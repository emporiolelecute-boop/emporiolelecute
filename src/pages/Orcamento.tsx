import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import QuoteFormSection from "@/components/QuoteFormSection";
import DynamicSEO from "@/components/DynamicSEO";

const Orcamento = () => {
  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO />
      <Header />
      <main className="pt-20">
        <QuoteFormSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Orcamento;
