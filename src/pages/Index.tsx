import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoriesHighlight from "@/components/CategoriesHighlight";

import BestSellers from "@/components/BestSellers";
import OccasionsSection from "@/components/OccasionsSection";
import QuoteCTABanner from "@/components/QuoteCTABanner";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import DynamicSEO from "@/components/DynamicSEO";
import OrganizationStructuredData from "@/components/OrganizationStructuredData";
import WebSiteStructuredData from "@/components/WebSiteStructuredData";
import LocalBusinessStructuredData from "@/components/LocalBusinessStructuredData";

import { ScrollReveal } from "@/components/ScrollReveal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO />
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      <LocalBusinessStructuredData />
      <Header />
      <main>
        <HeroSlider />
        
        <ScrollReveal>
          <CategoriesHighlight />
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <BestSellers />
        </ScrollReveal>

        <ScrollReveal>
          <OccasionsSection />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <QuoteCTABanner />
        </ScrollReveal>

        <ScrollReveal>
          <Testimonials />
        </ScrollReveal>

        <ScrollReveal>
          <FAQSection />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <InstagramFeed />
        </ScrollReveal>
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
};

export default Index;