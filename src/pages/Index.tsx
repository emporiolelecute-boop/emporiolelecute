import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import DynamicSEO from "@/components/DynamicSEO";
import OrganizationStructuredData from "@/components/OrganizationStructuredData";
import WebSiteStructuredData from "@/components/WebSiteStructuredData";
import LocalBusinessStructuredData from "@/components/LocalBusinessStructuredData";
import { useHomeSectionsPublic } from "@/hooks/useHomeSections";
import { HOME_SECTIONS_REGISTRY } from "@/lib/homeSectionsRegistry";
import { HomeRegistryProvider } from "@/contexts/HomeRegistry";

const SectionFallback = () => (
  <div className="h-32 md:h-48 animate-pulse bg-muted/30" aria-hidden />
);

const Index = () => {
  const { data: sections, isLoading } = useHomeSectionsPublic();

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO />
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      <LocalBusinessStructuredData />
      <Header />
      <main>
        <HomeRegistryProvider>
          {isLoading || !sections
            ? null
            : sections.map((section) => {
                const Component = HOME_SECTIONS_REGISTRY[section.component_name];
                if (!Component) {
                  if (import.meta.env.DEV) {
                    console.warn(
                      `[home] Componente "${section.component_name}" não está registrado em homeSectionsRegistry.`
                    );
                  }
                  return null;
                }
                return (
                  <Suspense key={section.id} fallback={<SectionFallback />}>
                    <Component {...(section.editable_props || {})} />
                  </Suspense>
                );
              })}
        </HomeRegistryProvider>
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
};

export default Index;
