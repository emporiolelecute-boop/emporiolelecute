import { Package, Tags, Calendar, TrendingUp, ArrowUpRight, Plus, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDbProducts, useDbCategories, useDbOccasions } from '@/hooks/useProducts';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const { data: products, isLoading: loadingProducts } = useDbProducts();
  const { data: categories, isLoading: loadingCategories } = useDbCategories();
  const { data: occasions, isLoading: loadingOccasions } = useDbOccasions();

  const stats = [
    {
      title: 'Total de Produtos',
      value: loadingProducts ? '...' : products?.length || 0,
      icon: Package,
      gradient: 'from-primary/80 to-primary',
      bgGlow: 'bg-primary/20',
    },
    {
      title: 'Produtos Ativos',
      value: loadingProducts ? '...' : products?.filter(p => p.is_active).length || 0,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGlow: 'bg-emerald-500/20',
    },
    {
      title: 'Categorias',
      value: loadingCategories ? '...' : categories?.length || 0,
      icon: Tags,
      gradient: 'from-blue-500 to-blue-600',
      bgGlow: 'bg-blue-500/20',
    },
    {
      title: 'Ocasiões',
      value: loadingOccasions ? '...' : occasions?.length || 0,
      icon: Calendar,
      gradient: 'from-violet-500 to-violet-600',
      bgGlow: 'bg-violet-500/20',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Bem-vindo de volta!</span>
          </div>
          <h1 className="text-4xl font-display font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus produtos e acompanhe suas métricas</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className={cn(
              "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group",
              "animate-fade-in-up"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300", stat.bgGlow, "blur-xl")} />
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-xl bg-gradient-to-br shadow-lg", stat.gradient)}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Produtos Recentes
              </CardTitle>
              <Link 
                to="/admin/produtos" 
                className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 group"
              >
                Ver todos
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-14 h-14 rounded-xl bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="space-y-3">
                {products.slice(0, 5).map((product, index) => (
                  <Link 
                    key={product.id} 
                    to={`/admin/produtos/${product.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">
                        R$ {Number(product.price).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                      product.is_active 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
                <Link to="/admin/produtos/novo" className="text-primary hover:underline text-sm font-medium mt-2 inline-block">
                  Adicionar primeiro produto
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              to="/admin/produtos/novo"
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all group border border-primary/10"
            >
              <div className="p-2.5 rounded-lg bg-primary text-white shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-foreground font-medium block">Novo Produto</span>
                <span className="text-xs text-muted-foreground">Adicione ao catálogo</span>
              </div>
            </Link>
            <Link
              to="/admin/categorias"
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 transition-all group border border-blue-500/10"
            >
              <div className="p-2.5 rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <Tags className="w-5 h-5" />
              </div>
              <div>
                <span className="text-foreground font-medium block">Categorias</span>
                <span className="text-xs text-muted-foreground">Organize seus produtos</span>
              </div>
            </Link>
            <Link
              to="/admin/ocasioes"
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-violet-500/5 hover:from-violet-500/20 hover:to-violet-500/10 transition-all group border border-violet-500/10"
            >
              <div className="p-2.5 rounded-lg bg-violet-500 text-white shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-foreground font-medium block">Ocasiões</span>
                <span className="text-xs text-muted-foreground">Eventos e celebrações</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
