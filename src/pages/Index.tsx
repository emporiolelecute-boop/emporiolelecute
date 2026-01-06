import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoriesHighlight from "@/components/CategoriesHighlight";
import About from "@/components/About";
import BestSellers from "@/components/BestSellers";
import OccasionsSection from "@/components/OccasionsSection";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import DynamicSEO from "@/components/DynamicSEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO />
      <Header />
      <main>
        <HeroSlider />
        <CategoriesHighlight />
        <About />
        <BestSellers />
        <OccasionsSection />
        <Testimonials />
        <FAQSection />
        <InstagramFeed />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
};

export default Index;