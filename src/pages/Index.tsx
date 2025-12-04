import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProductsSection from "@/components/ProductsSection";
import Occasions from "@/components/Occasions";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import QuoteForm from "@/components/QuoteForm";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <ProductsSection />
        <Occasions />
        <Testimonials />
        <FAQ />
        <QuoteForm />
        <InstagramFeed />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
