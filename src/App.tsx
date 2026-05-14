import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { CartProvider } from "./contexts/CartContext";
import { initGA, initFBPixel, usePageTracking } from "./lib/analytics";
import { PageSkeleton, AdminSkeleton } from "./components/ui/skeleton-loading";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Produtos = lazy(() => import("./pages/Produtos"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const Carrinho = lazy(() => import("./pages/Carrinho"));
const Envio = lazy(() => import("./pages/Envio"));
const RastrearPedido = lazy(() => import("./pages/RastrearPedido"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Contato = lazy(() => import("./pages/Contato"));
const Depoimentos = lazy(() => import("./pages/Depoimentos"));
const Ocasioes = lazy(() => import("./pages/Ocasioes"));
const Orcamento = lazy(() => import("./pages/Orcamento"));
const DynamicPage = lazy(() => import("./pages/DynamicPage"));
const Loja = lazy(() => import("./pages/Loja"));
const LembrancinhasLanding = lazy(() => import("./pages/LembrancinhasLanding"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Admin pages - lazy loaded
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminOccasions = lazy(() => import("./pages/admin/AdminOccasions"));
const AdminTags = lazy(() => import("./pages/admin/AdminTags"));
const AdminImport = lazy(() => import("./pages/admin/AdminImport"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminSEOReport = lazy(() => import("./pages/admin/AdminSEOReport"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminPageForm = lazy(() => import("./pages/admin/AdminPageForm"));
const AdminMenus = lazy(() => import("./pages/admin/AdminMenus"));
const AdminFaqs = lazy(() => import("./pages/admin/AdminFaqs"));
const AdminHomepageBlocks = lazy(() => import("./pages/admin/AdminHomepageBlocks"));
const AdminMerchantFeed = lazy(() => import("./pages/admin/AdminMerchantFeed"));
const AdminInstagram = lazy(() => import("./pages/admin/AdminInstagram"));
const AdminOccasionLandings = lazy(() => import("./pages/admin/AdminOccasionLandings"));
const AdminHeroSlides = lazy(() => import("./pages/admin/AdminHeroSlides"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminRedirects = lazy(() => import("./pages/admin/AdminRedirects"));
const AdminRobots = lazy(() => import("./pages/admin/AdminRobots"));
const AdminTracking = lazy(() => import("./pages/admin/AdminTracking"));

import RedirectHandler from "./components/RedirectHandler";
import TrackingScripts from "./components/TrackingScripts";

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
                {/* Public Routes */}
                <Route path="/" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Index />
                  </Suspense>
                } />
                <Route path="/sobre" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Sobre />
                  </Suspense>
                } />
                <Route path="/contato" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Contato />
                  </Suspense>
                } />
                <Route path="/depoimentos" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Depoimentos />
                  </Suspense>
                } />
                <Route path="/ocasioes" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Ocasioes />
                  </Suspense>
                } />
                <Route path="/orcamento" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Orcamento />
                  </Suspense>
                } />
                <Route path="/produtos" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Produtos />
                  </Suspense>
                } />
                <Route path="/produtos/:slug" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <ProductPage />
                  </Suspense>
                } />
                <Route path="/carrinho" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Carrinho />
                  </Suspense>
                } />
                <Route path="/envio" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Envio />
                  </Suspense>
                } />
                <Route path="/envio-brasil" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Envio />
                  </Suspense>
                } />
                <Route path="/rastrear" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <RastrearPedido />
                  </Suspense>
                } />
                <Route path="/rastrear/:code" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <RastrearPedido />
                  </Suspense>
                } />
                
                {/* SEO Landing Pages — Horizonte 2 */}
                {[
                  "cha-de-bebe",
                  "maternidade",
                  "cha-revelacao",
                  "batizado",
                  "aniversario-infantil",
                  "formatura",
                ].map((slug) => (
                  <Route
                    key={slug}
                    path={`/lembrancinhas-${slug}`}
                    element={
                      <Suspense fallback={<PageSkeleton />}>
                        <LembrancinhasLanding configKey={slug} />
                      </Suspense>
                    }
                  />
                ))}

                {/* Blog — Horizonte 2 Fase 2 */}
                <Route path="/blog" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Blog />
                  </Suspense>
                } />
                <Route path="/blog/:slug" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <BlogPost />
                  </Suspense>
                } />

                {/* Admin Routes */}
                <Route path="/admin/login" element={
                  <Suspense fallback={<AdminSkeleton />}>
                    <AdminLogin />
                  </Suspense>
                } />
                <Route path="/admin" element={
                  <Suspense fallback={<AdminSkeleton />}>
                    <AdminLayout />
                  </Suspense>
                }>
                  <Route index element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminDashboard />
                    </Suspense>
                  } />
                  <Route path="pedidos" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminOrders />
                    </Suspense>
                  } />
                  <Route path="clientes" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminCustomers />
                    </Suspense>
                  } />
                  <Route path="produtos" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminProducts />
                    </Suspense>
                  } />
                  <Route path="produtos/novo" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminProductForm />
                    </Suspense>
                  } />
                  <Route path="produtos/:id" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminProductForm />
                    </Suspense>
                  } />
                  <Route path="categorias" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminCategories />
                    </Suspense>
                  } />
                  <Route path="ocasioes" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminOccasions />
                    </Suspense>
                  } />
                  <Route path="tags" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminTags />
                    </Suspense>
                  } />
                  <Route path="importar" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminImport />
                    </Suspense>
                  } />
                  <Route path="paginas" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminPages />
                    </Suspense>
                  } />
                  <Route path="paginas/nova" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminPageForm />
                    </Suspense>
                  } />
                  <Route path="paginas/:id" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminPageForm />
                    </Suspense>
                  } />
                  <Route path="menus" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminMenus />
                    </Suspense>
                  } />
                  <Route path="faqs" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminFaqs />
                    </Suspense>
                  } />
                  <Route path="blocos" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminHomepageBlocks />
                    </Suspense>
                  } />
                  <Route path="configuracoes" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminSettings />
                    </Suspense>
                  } />
                  <Route path="seo" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminSEO />
                    </Suspense>
                  } />
                  <Route path="seo/relatorio" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminSEOReport />
                    </Suspense>
                  } />
                  <Route path="merchant-feed" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminMerchantFeed />
                    </Suspense>
                  } />
                  <Route path="instagram" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminInstagram />
                    </Suspense>
                  } />
                  <Route path="landings" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminOccasionLandings />
                    </Suspense>
                  } />
                  <Route path="hero-slides" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminHeroSlides />
                    </Suspense>
                  } />
                  <Route path="depoimentos" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminTestimonials />
                    </Suspense>
                  } />
                </Route>
                
                {/* Landing Page for Google Ads */}
                <Route path="/loja" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Loja />
                  </Suspense>
                } />
                
                {/* Dynamic Pages - must be after other routes */}
                <Route path="/:slug" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <DynamicPage />
                  </Suspense>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </AnalyticsWrapper>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
