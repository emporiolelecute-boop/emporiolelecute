import { Package, Tags, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDbProducts, useDbCategories, useDbOccasions } from '@/hooks/useProducts';

const AdminDashboard = () => {
  const { data: products, isLoading: loadingProducts } = useDbProducts();
  const { data: categories, isLoading: loadingCategories } = useDbCategories();
  const { data: occasions, isLoading: loadingOccasions } = useDbOccasions();

  const stats = [
    {
      title: 'Total de Produtos',
      value: loadingProducts ? '...' : products?.length || 0,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Produtos Ativos',
      value: loadingProducts ? '...' : products?.filter(p => p.is_active).length || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Categorias',
      value: loadingCategories ? '...' : categories?.length || 0,
      icon: Tags,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Ocasiões',
      value: loadingOccasions ? '...' : occasions?.length || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo ao painel administrativo</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-display">Produtos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : products && products.length > 0 ? (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-display">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/produtos/novo"
              className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <Package className="w-5 h-5 text-primary" />
              <span className="text-foreground">Adicionar novo produto</span>
            </a>
            <a
              href="/admin/categorias"
              className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Tags className="w-5 h-5 text-blue-600" />
              <span className="text-foreground">Gerenciar categorias</span>
            </a>
            <a
              href="/admin/ocasioes"
              className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-foreground">Gerenciar ocasiões</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
