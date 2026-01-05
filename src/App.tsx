import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import ProductPage from "./pages/ProductPage";
import Carrinho from "./pages/Carrinho";
import Envio from "./pages/Envio";
import RastrearPedido from "./pages/RastrearPedido";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Depoimentos from "./pages/Depoimentos";
import Ocasioes from "./pages/Ocasioes";
import Sitemap from "./pages/Sitemap";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOccasions from "./pages/admin/AdminOccasions";
import AdminImport from "./pages/admin/AdminImport";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSEO from "./pages/admin/AdminSEO";
import AdminSEOReport from "./pages/admin/AdminSEOReport";
import { CartProvider } from "./contexts/CartContext";
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
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/depoimentos" element={<Depoimentos />} />
                <Route path="/ocasioes" element={<Ocasioes />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/produtos/:slug" element={<ProductPage />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/envio" element={<Envio />} />
                <Route path="/envio-brasil" element={<Envio />} />
                <Route path="/rastrear" element={<RastrearPedido />} />
                <Route path="/rastrear/:code" element={<RastrearPedido />} />
                <Route path="/sitemap.xml" element={<Sitemap />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="pedidos" element={<AdminOrders />} />
                  <Route path="clientes" element={<AdminCustomers />} />
                  <Route path="produtos" element={<AdminProducts />} />
                  <Route path="produtos/novo" element={<AdminProductForm />} />
                  <Route path="produtos/:id" element={<AdminProductForm />} />
                  <Route path="categorias" element={<AdminCategories />} />
                  <Route path="ocasioes" element={<AdminOccasions />} />
                  <Route path="importar" element={<AdminImport />} />
                  <Route path="configuracoes" element={<AdminSettings />} />
                  <Route path="seo" element={<AdminSEO />} />
                  <Route path="seo/relatorio" element={<AdminSEOReport />} />
                </Route>
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnalyticsWrapper>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
