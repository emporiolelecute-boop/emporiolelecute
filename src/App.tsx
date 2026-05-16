import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import StaleBundleOverlay from "@/components/StaleBundleOverlay";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { CartProvider } from "./contexts/CartContext";
import { usePageTracking } from "./lib/analytics";
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
const SitemapCheck = lazy(() => import("./pages/SitemapCheck"));
const TaxonomyPage = lazy(() => import("./pages/TaxonomyPage"));
const CombinationPage = lazy(() => import("./pages/CombinationPage"));
const ThemePage = lazy(() => import("./pages/ThemePage"));

// Admin pages - lazy loaded with retry + telemetry
import { lazyWithRetry } from "./lib/lazyWithRetry";
const AdminLogin = lazyWithRetry(() => import("./pages/admin/AdminLogin"), "AdminLogin");
const AdminLayout = lazyWithRetry(() => import("./pages/admin/AdminLayout"), "AdminLayout");
const AdminDashboard = lazyWithRetry(() => import("./pages/admin/AdminDashboard"), "AdminDashboard");
const AdminProducts = lazyWithRetry(() => import("./pages/admin/AdminProducts"), "AdminProducts");
const AdminProductForm = lazyWithRetry(() => import("./pages/admin/AdminProductForm"), "AdminProductForm");
const AdminCategories = lazyWithRetry(() => import("./pages/admin/AdminCategories"), "AdminCategories");
const AdminOccasions = lazyWithRetry(() => import("./pages/admin/AdminOccasions"), "AdminOccasions");
const AdminTags = lazyWithRetry(() => import("./pages/admin/AdminTags"), "AdminTags");
const AdminImport = lazyWithRetry(() => import("./pages/admin/AdminImport"), "AdminImport");
const AdminOrders = lazyWithRetry(() => import("./pages/admin/AdminOrders"), "AdminOrders");
const AdminCustomers = lazyWithRetry(() => import("./pages/admin/AdminCustomers"), "AdminCustomers");
const AdminSettings = lazyWithRetry(() => import("./pages/admin/AdminSettings"), "AdminSettings");
const AdminSEO = lazyWithRetry(() => import("./pages/admin/AdminSEO"), "AdminSEO");
const AdminSEOReport = lazyWithRetry(() => import("./pages/admin/AdminSEOReport"), "AdminSEOReport");
const AdminPages = lazyWithRetry(() => import("./pages/admin/AdminPages"), "AdminPages");
const AdminPageForm = lazyWithRetry(() => import("./pages/admin/AdminPageForm"), "AdminPageForm");
const AdminMenus = lazyWithRetry(() => import("./pages/admin/AdminMenus"), "AdminMenus");
const AdminFaqs = lazyWithRetry(() => import("./pages/admin/AdminFaqs"), "AdminFaqs");
const AdminHomepageBlocks = lazyWithRetry(() => import("./pages/admin/AdminHomepageBlocks"), "AdminHomepageBlocks");
const AdminMerchantFeed = lazyWithRetry(() => import("./pages/admin/AdminMerchantFeed"), "AdminMerchantFeed");
const AdminInstagram = lazyWithRetry(() => import("./pages/admin/AdminInstagram"), "AdminInstagram");
const AdminFeedInstagram = lazyWithRetry(() => import("./pages/admin/AdminFeedInstagram"), "AdminFeedInstagram");
const AdminOccasionLandings = lazyWithRetry(() => import("./pages/admin/AdminOccasionLandings"), "AdminOccasionLandings");
const AdminHeroSlides = lazyWithRetry(() => import("./pages/admin/AdminHeroSlides"), "AdminHeroSlides");
const AdminTestimonials = lazyWithRetry(() => import("./pages/admin/AdminTestimonials"), "AdminTestimonials");
const AdminProductReviews = lazyWithRetry(() => import("./pages/admin/AdminProductReviews"), "AdminProductReviews");
const AdminProductsHealth = lazyWithRetry(() => import("./pages/admin/AdminProductsHealth"), "AdminProductsHealth");
const AdminCoupons = lazyWithRetry(() => import("./pages/admin/AdminCoupons"), "AdminCoupons");
const AdminRedirects = lazyWithRetry(() => import("./pages/admin/AdminRedirects"), "AdminRedirects");
const AdminRobots = lazyWithRetry(() => import("./pages/admin/AdminRobots"), "AdminRobots");
const AdminTracking = lazyWithRetry(() => import("./pages/admin/AdminTracking"), "AdminTracking");
const AdminSEODashboard = lazyWithRetry(() => import("./pages/admin/AdminSEODashboard"), "AdminSEODashboard");
const AdminTelemetry = lazyWithRetry(() => import("./pages/admin/AdminTelemetry"), "AdminTelemetry");
const AdminCronStatus = lazyWithRetry(() => import("./pages/admin/AdminCronStatus"), "AdminCronStatus");
const AdminCloudflareGuide = lazyWithRetry(() => import("./pages/admin/AdminCloudflareGuide"), "AdminCloudflareGuide");
const AdminDiagnostics = lazyWithRetry(() => import("./pages/admin/AdminDiagnostics"), "AdminDiagnostics");
const AdminUsers = lazyWithRetry(() => import("./pages/admin/AdminUsers"), "AdminUsers");
const AdminAccessRequests = lazyWithRetry(() => import("./pages/admin/AdminAccessRequests"), "AdminAccessRequests");
const AdminAccessRequestDetail = lazyWithRetry(() => import("./pages/admin/AdminAccessRequestDetail"), "AdminAccessRequestDetail");
const AdminAudit = lazyWithRetry(() => import("./pages/admin/AdminAudit"), "AdminAudit");
const AdminTaxonomies = lazyWithRetry(() => import("./pages/admin/AdminTaxonomies"), "AdminTaxonomies");
const AdminTaxonomiesHealth = lazyWithRetry(() => import("./pages/admin/AdminTaxonomiesHealth"), "AdminTaxonomiesHealth");
const AdminContentHealth = lazyWithRetry(() => import("./pages/admin/AdminContentHealth"), "AdminContentHealth");
const AdminOpportunities = lazyWithRetry(() => import("./pages/admin/AdminOpportunities"), "AdminOpportunities");
const AdminBlog = lazyWithRetry(() => import("./pages/admin/AdminBlog"), "AdminBlog");
const AdminBlogHealth = lazyWithRetry(() => import("./pages/admin/AdminBlogHealth"), "AdminBlogHealth");
const AdminImageHealth = lazyWithRetry(() => import("./pages/admin/AdminImageHealth"), "AdminImageHealth");
const AdminCombinationPages = lazyWithRetry(() => import("./pages/admin/AdminCombinationPages"), "AdminCombinationPages");
const AdminDiscovery = lazyWithRetry(() => import("./pages/admin/AdminDiscovery"), "AdminDiscovery");
const AdminThemes = lazyWithRetry(() => import("./pages/admin/AdminThemes"), "AdminThemes");
const AdminAuthority = lazyWithRetry(() => import("./pages/admin/AdminAuthority"), "AdminAuthority");
const AdminEditorialExecution = lazyWithRetry(() => import("./pages/admin/AdminEditorialExecution"), "AdminEditorialExecution");
const AdminSeoOperations = lazyWithRetry(() => import("./pages/admin/AdminSeoOperations"), "AdminSeoOperations");
const AdminLinkHealth = lazyWithRetry(() => import("./pages/admin/AdminLinkHealth"), "AdminLinkHealth");
const AdminContentGaps = lazyWithRetry(() => import("./pages/admin/AdminContentGaps"), "AdminContentGaps");
const AdminSeoCommandCenter = lazyWithRetry(() => import("./pages/admin/AdminSeoCommandCenter"), "AdminSeoCommandCenter");
const AcessoRestrito = lazy(() => import("./pages/AcessoRestrito"));

import RequireAdmin from "./components/RequireAdmin";
import AdminErrorBoundary from "./components/AdminErrorBoundary";
import RedirectHandler from "./components/RedirectHandler";
import TrackingScripts from "./components/TrackingScripts";
import CanonicalNormalizer from "./components/CanonicalNormalizer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5min — evita refetch em pico de tráfego
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Analytics wrapper component
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

const App = () => {
  // Analytics carregadas dinamicamente em <TrackingScripts /> via tracking_config.
  useEffect(() => {}, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StaleBundleOverlay />
          <PwaInstallPrompt />
          <BrowserRouter>
            <AnalyticsWrapper>
              <RedirectHandler />
              <CanonicalNormalizer />
              <TrackingScripts />
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

                <Route path="/sitemap-check" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <SitemapCheck />
                  </Suspense>
                } />

                {/* Public Taxonomy Pages — Fase 3.1 */}
                <Route path="/categoria/:slug" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <TaxonomyPage kind="categoria" />
                  </Suspense>
                } />
                <Route path="/ocasiao/:slug" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <TaxonomyPage kind="ocasiao" />
                  </Suspense>
                } />
                <Route path="/segmento/:slug" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <TaxonomyPage kind="segmento" />
                  </Suspense>
                } />

                {/* Fase 10.2 — Rota combinatória SAFE MODE (noindex por padrão) */}
                <Route path="/segmento/:segmentSlug/ocasiao/:occasionSlug" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <CombinationPage />
                  </Suspense>
                } />

                {/* Fase 10.3 — Hub temático SAFE MODE */}
                <Route path="/tema/:slug" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <ThemePage />
                  </Suspense>
                } />

                {/* Admin Routes */}
                <Route path="/admin/login" element={
                  <Suspense fallback={<AdminSkeleton />}>
                    <AdminLogin />
                  </Suspense>
                } />
                <Route path="/acesso-restrito" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <AcessoRestrito />
                  </Suspense>
                } />
                <Route path="/admin" element={
                  <AdminErrorBoundary>
                    <RequireAdmin>
                      <Suspense fallback={<AdminSkeleton />}>
                        <AdminLayout />
                      </Suspense>
                    </RequireAdmin>
                  </AdminErrorBoundary>
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
                  <Route path="seo-dashboard" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminSEODashboard />
                    </Suspense>
                  } />
                  <Route path="cloudflare-worker" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminCloudflareGuide />
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
                  <Route path="feed-instagram" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminFeedInstagram />
                    </Suspense>
                  } />
                  <Route path="diagnostico" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminDiagnostics />
                    </Suspense>
                  } />
                  <Route path="telemetria" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminTelemetry />
                    </Suspense>
                  } />
                  <Route path="cron" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminCronStatus />
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
                  <Route path="cupons" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminCoupons />
                    </Suspense>
                  } />
                  <Route path="redirects" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminRedirects />
                    </Suspense>
                  } />
                  <Route path="robots" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminRobots />
                    </Suspense>
                  } />
                  <Route path="tracking" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminTracking />
                    </Suspense>
                  } />
                  <Route path="usuarios" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminUsers />
                    </Suspense>
                  } />
                  <Route path="usuarios/solicitacoes" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminAccessRequests />
                    </Suspense>
                  } />
                  <Route path="usuarios/solicitacoes/:id" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminAccessRequestDetail />
                    </Suspense>
                  } />
                  <Route path="taxonomias" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminTaxonomies />
                    </Suspense>
                  } />
                  <Route path="taxonomias/health" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminTaxonomiesHealth />
                    </Suspense>
                  } />
                  <Route path="produtos/health" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminProductsHealth />
                    </Suspense>
                  } />
                  <Route path="content-health" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminContentHealth />
                    </Suspense>
                  } />
                  <Route path="opportunities" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminOpportunities />
                    </Suspense>
                  } />
                  <Route path="reviews" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminProductReviews />
                    </Suspense>
                  } />
                  <Route path="auditoria" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminAudit />
                    </Suspense>
                  } />
                  <Route path="blog" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminBlog />
                    </Suspense>
                  } />
                  <Route path="blog/health" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminBlogHealth />
                    </Suspense>
                  } />
                  <Route path="image-health" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminImageHealth />
                    </Suspense>
                  } />
                  <Route path="combination-pages" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminCombinationPages />
                    </Suspense>
                  } />
                  <Route path="discovery" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminDiscovery />
                    </Suspense>
                  } />
                  <Route path="themes" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminThemes />
                    </Suspense>
                  } />
                  <Route path="authority" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminAuthority />
                    </Suspense>
                  } />
                  <Route path="editorial-execution" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminEditorialExecution />
                    </Suspense>
                  } />
                  <Route path="seo-operations" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminSeoOperations />
                    </Suspense>
                  } />
                  <Route path="link-health" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminLinkHealth />
                    </Suspense>
                  } />
                  <Route path="content-gaps" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminContentGaps />
                    </Suspense>
                  } />
                  <Route path="seo-command" element={
                    <Suspense fallback={<AdminSkeleton />}>
                      <AdminSeoCommandCenter />
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
