import logoImg from "@/assets/logo.webp";
import { useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Calendar, 
  LogOut, 
  Menu,
  X,
  Home,
  Upload,
  Sparkles,
  ShoppingCart,
  Users,
  Settings,
  Search,
  HelpCircle,
  Rss,
  Instagram,
  MapPin,
  Image,
  MessageSquare,
  Tag,
  ArrowRightLeft,
  BarChart3,
  ShieldCheck,
  Bot,
  Activity,
  Clock,
  Star,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingCart, label: 'Pedidos', path: '/admin/pedidos' },
  { icon: Users, label: 'Clientes', path: '/admin/clientes' },
  { icon: Package, label: 'Produtos', path: '/admin/produtos' },
  { icon: ShieldCheck, label: 'Saúde SEO Produtos', path: '/admin/produtos/health' },
  { icon: Activity, label: 'Saúde do Conteúdo', path: '/admin/content-health' },
  { icon: Sparkles, label: 'Oportunidades', path: '/admin/opportunities' },
  { icon: Star, label: 'Avaliações', path: '/admin/reviews' },
  { icon: BookOpen, label: 'Blog', path: '/admin/blog' },
  { icon: Activity, label: 'Saúde do Blog', path: '/admin/blog/health' },
  { icon: Image, label: 'Saúde de Imagens', path: '/admin/image-health' },
  { icon: ArrowRightLeft, label: 'Páginas Combinatórias', path: '/admin/combination-pages' },
  { icon: Sparkles, label: 'Discovery Engine', path: '/admin/discovery' },
  { icon: Sparkles, label: 'Hubs Temáticos', path: '/admin/themes' },
  { icon: TrendingUp, label: 'Authority Center', path: '/admin/authority' },
  { icon: Sparkles, label: 'Editorial Execution', path: '/admin/editorial-execution' },
  { icon: BarChart3, label: 'SEO Operations', path: '/admin/seo-operations' },
  { icon: Activity, label: 'Saúde de Links', path: '/admin/link-health' },
  { icon: Tags, label: 'Categorias', path: '/admin/categorias' },
  { icon: Calendar, label: 'Ocasiões', path: '/admin/ocasioes' },
  { icon: Tags, label: 'Tags', path: '/admin/tags' },
  { icon: Sparkles, label: 'Taxonomias (novo)', path: '/admin/taxonomias' },
  { icon: Tag, label: 'Cupons', path: '/admin/cupons' },
  
  { icon: Image, label: 'Slides do Hero', path: '/admin/hero-slides' },
  { icon: MessageSquare, label: 'Depoimentos', path: '/admin/depoimentos' },
  { icon: Home, label: 'Blocos Homepage', path: '/admin/blocos' },
  { icon: Instagram, label: 'Instagram', path: '/admin/instagram' },
  { icon: Instagram, label: 'Feed Instagram', path: '/admin/feed-instagram' },
  { icon: MapPin, label: 'Landings SEO', path: '/admin/landings' },
  { icon: Home, label: 'Páginas', path: '/admin/paginas' },
  { icon: Menu, label: 'Menus', path: '/admin/menus' },
  { icon: HelpCircle, label: 'FAQs', path: '/admin/faqs' },
  { icon: ArrowRightLeft, label: 'Redirects 301', path: '/admin/redirects' },
  { icon: Bot, label: 'Robots.txt', path: '/admin/robots' },
  { icon: BarChart3, label: 'Analytics & Ads', path: '/admin/tracking' },
  { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
  { icon: Rss, label: 'Feed Merchant', path: '/admin/merchant-feed' },
  { icon: Search, label: 'SEO & Sitemap', path: '/admin/seo' },
  { icon: BarChart3, label: 'SEO Dashboard', path: '/admin/seo-dashboard' },
  { icon: Bot, label: 'Cloudflare Worker', path: '/admin/cloudflare-worker' },
  { icon: BarChart3, label: 'Diagnóstico', path: '/admin/diagnostico' },
  { icon: Activity, label: 'Telemetria', path: '/admin/telemetria' },
  { icon: Clock, label: 'Tarefas Agendadas', path: '/admin/cron' },
  { icon: ShieldCheck, label: 'Usuários', path: '/admin/usuarios' },
  { icon: ShieldCheck, label: 'Solicitações de acesso', path: '/admin/usuarios/solicitacoes' },
  { icon: BarChart3, label: 'Auditoria', path: '/admin/auditoria' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-accent/5">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 z-50 flex items-center justify-between px-4 shadow-sm">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2.5 hover:bg-primary/10 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <Link to="/admin" className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-full bg-white shadow ring-1 ring-primary/20 flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="LeleCute" className="w-full h-full object-contain p-0.5" />
          </span>
          <span className="font-display text-lg text-foreground">Admin</span>
        </Link>
        <div className="w-10" />
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 bg-card/95 backdrop-blur-xl border-r border-border/50 z-50 transition-all duration-300 shadow-xl lg:shadow-none flex flex-col",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50 shrink-0">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-white shadow-md ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all flex items-center justify-center overflow-hidden shrink-0">
              <img src={logoImg} alt="LeleCute" className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <span className="font-display text-xl text-foreground block leading-tight">LeleCute</span>
              <span className="text-xs text-muted-foreground">Painel Admin</span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent [scrollbar-gutter:stable]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary-dark text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive && "drop-shadow-lg"
                )} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-border/50 space-y-2 bg-card/80 backdrop-blur-sm">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Ver site</span>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl py-3 h-auto"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
