import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, ExternalLink, Scale, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useDbProducts, useDeleteProduct, useUpdateProduct } from '@/hooks/useProducts';

const AdminProducts = () => {
  const { data: products, isLoading } = useDbProducts();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast({ title: 'Produto excluído com sucesso!' });
    } catch {
      toast({ title: 'Erro ao excluir produto', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateProduct.mutateAsync({ id, is_active: !isActive });
      toast({ title: isActive ? 'Produto desativado' : 'Produto ativado' });
    } catch {
      toast({ title: 'Erro ao atualizar produto', variant: 'destructive' });
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Produtos</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os produtos da loja</p>
        </div>
        <Button asChild>
          <Link to="/admin/produtos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Link>
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Imagem</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          {product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.name}</span>
                          <a
                            href={`/produtos/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="Abrir produto em nova aba"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {product.keywords && product.keywords.length > 0 ? (
                            product.keywords.slice(0, 3).map((keyword, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                {keyword}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">Sem tags</span>
                          )}
                          {product.keywords && product.keywords.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{product.keywords.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {product.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(product.id, product.is_active)}
                            title={product.is_active ? 'Desativar' : 'Ativar'}
                          >
                            {product.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/produtos/${product.id}`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum produto encontrado</p>
              <Button asChild>
                <Link to="/admin/produtos/novo">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeiro produto
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
