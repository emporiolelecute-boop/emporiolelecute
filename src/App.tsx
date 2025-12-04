import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import ProductPage from "./pages/ProductPage";
import Envio from "./pages/Envio";
import NotFound from "./pages/NotFound";
import { initGA, initFBPixel, usePageTracking } from "./lib/analytics";

const queryClient = new QueryClient();

// Analytics wrapper component
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

const App = () => {
  // Initialize analytics on mount
  useEffect(() => {
    // Uncomment these when you have real tracking IDs
    // initGA();
    // initFBPixel();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/produtos/:slug" element={<ProductPage />} />
              <Route path="/envio" element={<Envio />} />
              <Route path="/envio-brasil" element={<Envio />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnalyticsWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
